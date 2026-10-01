import { supabase } from '../config/supabase.js';
import { mockCategories } from '../data/mockData.js';

let localCategories = [...mockCategories];

export const getCategories = async (req, res) => {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });
      if (!error && data && data.length > 0) {
        return res.json({ success: true, count: data.length, data });
      }
    }

    return res.json({ success: true, count: localCategories.length, data: localCategories });
  } catch (error) {
    console.error('Error in getCategories:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const categoryData = req.body;
    if (!categoryData.slug && categoryData.name) {
      categoryData.slug = categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    if (supabase) {
      const { data, error } = await supabase.from('categories').insert([categoryData]).select().single();
      if (!error && data) {
        return res.status(201).json({ success: true, data });
      }
    }

    const newCategory = {
      id: `c-${Date.now()}`,
      sort_order: localCategories.length + 1,
      is_active: true,
      image_url: categoryData.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
      icon_name: categoryData.icon_name || 'Package',
      ...categoryData
    };

    localCategories.push(newCategory);
    return res.status(201).json({ success: true, data: newCategory });
  } catch (error) {
    console.error('Error in createCategory:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (supabase) {
      const { data, error } = await supabase.from('categories').update(updates).eq('id', id).select().single();
      if (!error && data) {
        return res.json({ success: true, data });
      }
    }

    const index = localCategories.findIndex(c => c.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    localCategories[index] = { ...localCategories[index], ...updates };
    return res.json({ success: true, data: localCategories[index] });
  } catch (error) {
    console.error('Error in updateCategory:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (supabase) {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (!error) {
        return res.json({ success: true, message: 'Category deleted' });
      }
    }

    localCategories = localCategories.filter(c => c.id !== id);
    return res.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    console.error('Error in deleteCategory:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
