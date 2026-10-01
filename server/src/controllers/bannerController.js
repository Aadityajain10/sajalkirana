import { supabase } from '../config/supabase.js';
import { mockBanners } from '../data/mockData.js';

let localBanners = [...mockBanners];

export const getBanners = async (req, res) => {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .order('display_order', { ascending: true });
      if (!error && data && data.length > 0) {
        return res.json({ success: true, count: data.length, data });
      }
    }

    return res.json({ success: true, count: localBanners.length, data: localBanners });
  } catch (error) {
    console.error('Error in getBanners:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createBanner = async (req, res) => {
  try {
    const bannerData = req.body;

    if (supabase) {
      const { data, error } = await supabase.from('banners').insert([bannerData]).select().single();
      if (!error && data) {
        return res.status(201).json({ success: true, data });
      }
    }

    const newBanner = {
      id: `b-${Date.now()}`,
      display_order: localBanners.length + 1,
      is_active: true,
      ...bannerData
    };

    localBanners.push(newBanner);
    return res.status(201).json({ success: true, data: newBanner });
  } catch (error) {
    console.error('Error in createBanner:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (supabase) {
      const { data, error } = await supabase.from('banners').update(updates).eq('id', id).select().single();
      if (!error && data) {
        return res.json({ success: true, data });
      }
    }

    const index = localBanners.findIndex(b => b.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }

    localBanners[index] = { ...localBanners[index], ...updates };
    return res.json({ success: true, data: localBanners[index] });
  } catch (error) {
    console.error('Error in updateBanner:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;

    if (supabase) {
      const { error } = await supabase.from('banners').delete().eq('id', id);
      if (!error) {
        return res.json({ success: true, message: 'Banner deleted' });
      }
    }

    localBanners = localBanners.filter(b => b.id !== id);
    return res.json({ success: true, message: 'Banner deleted' });
  } catch (error) {
    console.error('Error in deleteBanner:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
