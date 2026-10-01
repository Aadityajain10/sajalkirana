import { supabase } from '../config/supabase.js';
import { mockStoreSettings } from '../data/mockData.js';
import { orderStore } from '../data/orderStore.js';

const PRIMARY_WHATSAPP = '917974981304';
const SECONDARY_WHATSAPP = '918819939196';

export const getInquiries = async (req, res) => {
  try {
    const { status, type } = req.query;

    if (supabase) {
      let query = supabase.from('inquiries').select('*, inquiry_items(*)').order('created_at', { ascending: false });
      if (status) query = query.eq('status', status);
      if (type) query = query.eq('customer_type', type);

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return res.json({ success: true, count: data.length, data });
      }
    }

    const orders = orderStore.getAll({ status, type });
    return res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    console.error('Error in getInquiries:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createInquiry = async (req, res) => {
  try {
    const {
      customer_name,
      customer_phone,
      customer_email,
      customer_type = 'retail',
      items = [],
      notes = '',
      total_amount = 0
    } = req.body;

    if (!customer_name || !customer_phone) {
      return res.status(400).json({ success: false, message: 'Name and phone are required' });
    }

    const newInquiry = orderStore.add({
      customer_name,
      customer_phone,
      customer_email: customer_email || '',
      customer_type,
      status: 'new',
      total_amount: parseFloat(total_amount),
      notes,
      items
    });

    if (supabase) {
      try {
        const { data: inqData, error: inqErr } = await supabase.from('inquiries').insert([{
          inquiry_number: newInquiry.inquiry_number,
          customer_name,
          customer_phone,
          customer_email,
          customer_type,
          status: 'new',
          total_amount: newInquiry.total_amount,
          notes
        }]).select().single();

        if (!inqErr && inqData && items.length > 0) {
          const itemRows = items.map(it => ({
            inquiry_id: inqData.id,
            product_id: it.id || null,
            product_name: it.name || it.product_name,
            quantity: it.quantity,
            price_type: it.price_type || 'retail',
            unit_price: it.price || it.unit_price,
            subtotal: it.subtotal || (it.price * it.quantity)
          }));
          await supabase.from('inquiry_items').insert(itemRows);
        }
      } catch (sbErr) {
        console.warn('Supabase sync skipped/failed:', sbErr.message);
      }
    }

    // Build WhatsApp URLs for redirect (for both owners)
    const orderItems = newInquiry.items || items;
    let orderSummary = orderItems.map((it, idx) => 
      `${idx + 1}. *${it.product_name || it.name}* (${it.quantity} units) - ₹${it.subtotal || (it.unit_price * it.quantity)}`
    ).join('%0A');

    const whatsappText = `🛒 *New Order / Inquiry - Sajal Kirana*%0A` +
      `*Ref:* ${newInquiry.inquiry_number}%0A` +
      `👤 *Customer:* ${customer_name}%0A` +
      `📞 *Phone:* ${customer_phone}%0A` +
      `🏷️ *Order Type:* ${customer_type.toUpperCase()}%0A%0A` +
      `📦 *Items:*%0A${orderSummary}%0A%0A` +
      `💰 *Estimated Total:* ₹${newInquiry.total_amount}%0A` +
      (notes ? `📝 *Address / Notes:* ${encodeURIComponent(notes)}%0A` : '') +
      `📍 Please confirm dispatch & payment details.`;

    const whatsappUrl = `https://wa.me/${PRIMARY_WHATSAPP}?text=${whatsappText}`;
    const whatsappUrl2 = `https://wa.me/${SECONDARY_WHATSAPP}?text=${whatsappText}`;

    return res.status(201).json({
      success: true,
      data: newInquiry,
      whatsappUrl,
      whatsappUrl2,
      phones: {
        primary: PRIMARY_WHATSAPP,
        secondary: SECONDARY_WHATSAPP,
        label1: "Sajal (+91 79749 81304)",
        label2: "Store Counter (+91 88199 39196)"
      }
    });
  } catch (error) {
    console.error('Error in createInquiry:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateInquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (supabase) {
      try {
        await supabase.from('inquiries').update({ status }).eq('id', id);
      } catch (err) {
        console.warn('Supabase status update skipped:', err.message);
      }
    }

    const updated = orderStore.updateStatus(id, status);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    return res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error in updateInquiryStatus:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
