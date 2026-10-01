import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { mockInquiries } from './mockData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ORDERS_FILE = path.join(__dirname, 'orders.json');

// Default initial inquiries with product images
const initialInquiries = [
  {
    id: "inq-101",
    inquiry_number: "SK-2026-001",
    customer_name: "Rajesh Gupta (Gupta Sweets & Dhaba)",
    customer_phone: "+91 98390 12345",
    customer_email: "guptasweets@example.com",
    customer_type: "wholesale",
    status: "new",
    total_amount: 14740,
    notes: "Need 2 tins of Fortune Mustard 15L, 3 sacks of Sharbati Wheat, and 1 box Kaju W240. Delivery needed by Thursday.",
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    items: [
      {
        product_name: "Fortune Kachi Ghani Mustard Oil (15 Litre)",
        quantity: 2,
        price_type: "wholesale",
        unit_price: 2080,
        subtotal: 4160,
        image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=80"
      },
      {
        product_name: "MP Sharbati Gehu / Wheat (50 kg Sack)",
        quantity: 3,
        price_type: "wholesale",
        unit_price: 1920,
        subtotal: 5760,
        image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop&q=80"
      },
      {
        product_name: "Whole Cashew Nuts Kaju W240 (10 kg Box)",
        quantity: 1,
        price_type: "wholesale",
        unit_price: 7650,
        subtotal: 7650,
        image: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=500&auto=format&fit=crop&q=80"
      }
    ]
  },
  {
    id: "inq-102",
    inquiry_number: "SK-2026-002",
    customer_name: "Anita Verma",
    customer_phone: "+91 98261 23456",
    customer_email: "anita.verma@example.com",
    customer_type: "retail",
    status: "contacted",
    total_amount: 1958,
    notes: "Monthly home grocery pack. Home delivery near Clock Tower.",
    created_at: new Date(Date.now() - 3600000 * 28).toISOString(),
    items: [
      {
        product_name: "Aashirvaad Shudh Chakki Atta (10 kg)",
        quantity: 1,
        price_type: "retail",
        unit_price: 440,
        subtotal: 440,
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80"
      },
      {
        product_name: "Tata Sampann Toor Dal (1 kg)",
        quantity: 2,
        price_type: "retail",
        unit_price: 178,
        subtotal: 356,
        image: "https://images.unsplash.com/photo-1585994192701-f1a505c8574a?w=500&auto=format&fit=crop&q=80"
      },
      {
        product_name: "Amul Pure Cow Ghee (1 Litre Tin)",
        quantity: 1,
        price_type: "retail",
        unit_price: 680,
        subtotal: 680,
        image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=500&auto=format&fit=crop&q=80"
      },
      {
        product_name: "Daawat Rozana Gold Basmati Rice (5 kg)",
        quantity: 1,
        price_type: "retail",
        unit_price: 460,
        subtotal: 460,
        image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80"
      }
    ]
  }
];

let ordersCache = null;

function loadOrders() {
  if (ordersCache) return ordersCache;
  try {
    if (fs.existsSync(ORDERS_FILE)) {
      const data = fs.readFileSync(ORDERS_FILE, 'utf-8');
      ordersCache = JSON.parse(data);
      return ordersCache;
    }
  } catch (err) {
    console.warn('Failed to read orders.json, using default orders', err.message);
  }
  ordersCache = [...initialInquiries];
  saveOrders(ordersCache);
  return ordersCache;
}

function saveOrders(orders) {
  ordersCache = orders;
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write orders.json', err.message);
  }
}

export const orderStore = {
  getAll: (filters = {}) => {
    let list = [...loadOrders()];
    if (filters.status) {
      list = list.filter(o => o.status === filters.status);
    }
    if (filters.type) {
      list = list.filter(o => o.customer_type === filters.type);
    }
    return list;
  },

  getById: (id) => {
    const list = loadOrders();
    return list.find(o => o.id === id || o.inquiry_number === id);
  },

  add: (orderData) => {
    const list = loadOrders();
    const count = list.length + 1;
    const inquiryNumber = orderData.inquiry_number || `SK-${new Date().getFullYear()}-${String(count).padStart(3, '0')}`;
    
    const newOrder = {
      id: orderData.id || `inq-${Date.now()}`,
      inquiry_number: inquiryNumber,
      customer_name: orderData.customer_name,
      customer_phone: orderData.customer_phone,
      customer_email: orderData.customer_email || '',
      customer_type: orderData.customer_type || 'retail',
      status: orderData.status || 'new',
      total_amount: parseFloat(orderData.total_amount || 0),
      notes: orderData.notes || '',
      created_at: orderData.created_at || new Date().toISOString(),
      items: (orderData.items || []).map(item => ({
        id: item.id || item.product_id,
        product_name: item.name || item.product_name,
        quantity: item.quantity,
        price_type: item.price_type || 'retail',
        unit_price: parseFloat(item.unit_price || item.price || 0),
        subtotal: parseFloat(item.subtotal || ((item.unit_price || item.price || 0) * item.quantity) || 0),
        image: item.image || item.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=80'
      }))
    };

    list.unshift(newOrder);
    saveOrders(list);
    return newOrder;
  },

  updateStatus: (id, status) => {
    const list = loadOrders();
    const idx = list.findIndex(o => o.id === id || o.inquiry_number === id);
    if (idx === -1) return null;
    list[idx].status = status;
    saveOrders(list);
    return list[idx];
  },

  count: () => {
    return loadOrders().length;
  }
};
