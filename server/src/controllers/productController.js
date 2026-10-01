import { supabase } from '../config/supabase.js';
import { mockProducts } from '../data/mockData.js';

let localProducts = [...mockProducts];

export const getProducts = async (req, res) => {
  try {
    const { category, search, wholesaleOnly, featured, limit } = req.query;

    if (supabase) {
      let query = supabase.from('products').select('*, categories(name, slug)');
      
      if (category) {
        // category can be slug or id
        query = query.or(`category_id.eq.${category},category_slug.eq.${category}`);
      }
      if (search) {
        query = query.ilike('name', `%${search}%`);
      }
      if (wholesaleOnly === 'true') {
        query = query.eq('is_wholesale', true);
      }
      if (featured === 'true') {
        query = query.eq('is_featured', true);
      }
      if (limit) {
        query = query.limit(parseInt(limit, 10));
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return res.json({ success: true, count: data.length, data });
      }
    }

    // Fallback or in-memory
    let filtered = [...localProducts];

    if (category) {
      filtered = filtered.filter(p => p.category_slug === category || p.category_id === category);
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.brand?.toLowerCase().includes(q) || 
        p.description?.toLowerCase().includes(q)
      );
    }
    if (wholesaleOnly === 'true') {
      filtered = filtered.filter(p => p.is_wholesale === true);
    }
    if (featured === 'true') {
      filtered = filtered.filter(p => p.is_featured === true);
    }
    if (limit) {
      filtered = filtered.slice(0, parseInt(limit, 10));
    }

    return res.json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    console.error('Error in getProducts:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    if (supabase) {
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(name, slug)')
        .eq('slug', slug)
        .single();
      if (!error && data) {
        return res.json({ success: true, data });
      }
    }

    const product = localProducts.find(p => p.slug === slug || p.id === slug);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    return res.json({ success: true, data: product });
  } catch (error) {
    console.error('Error in getProductBySlug:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const productData = req.body;
    
    // Auto-generate slug if missing
    if (!productData.slug && productData.name) {
      productData.slug = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    if (supabase) {
      const { data, error } = await supabase.from('products').insert([productData]).select().single();
      if (!error && data) {
        return res.status(201).json({ success: true, data });
      }
    }

    const newProduct = {
      id: `p-${Date.now()}`,
      created_at: new Date().toISOString(),
      stock_quantity: parseInt(productData.stock_quantity || 100, 10),
      low_stock_threshold: parseInt(productData.low_stock_threshold || 10, 10),
      retail_price: parseFloat(productData.retail_price || 0),
      wholesale_price: parseFloat(productData.wholesale_price || 0),
      wholesale_min_qty: parseInt(productData.wholesale_min_qty || 5, 10),
      is_wholesale: productData.is_wholesale !== false,
      is_retail: productData.is_retail !== false,
      is_featured: !!productData.is_featured,
      is_active: productData.is_active !== false,
      images: Array.isArray(productData.images) && productData.images.length > 0 
        ? productData.images 
        : ['https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80'],
      ...productData
    };

    localProducts.unshift(newProduct);
    return res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.error('Error in createProduct:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (supabase) {
      const { data, error } = await supabase.from('products').update(updates).eq('id', id).select().single();
      if (!error && data) {
        return res.json({ success: true, data });
      }
    }

    const index = localProducts.findIndex(p => p.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    localProducts[index] = {
      ...localProducts[index],
      ...updates,
      updated_at: new Date().toISOString()
    };

    return res.json({ success: true, data: localProducts[index] });
  } catch (error) {
    console.error('Error in updateProduct:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (supabase) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (!error) {
        return res.json({ success: true, message: 'Product deleted successfully' });
      }
    }

    localProducts = localProducts.filter(p => p.id !== id);
    return res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error in deleteProduct:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getInventoryAlerts = async (req, res) => {
  try {
    const lowStockItems = localProducts.filter(p => p.stock_quantity <= p.low_stock_threshold);
    const outOfStockItems = localProducts.filter(p => p.stock_quantity === 0);

    return res.json({
      success: true,
      lowStockCount: lowStockItems.length,
      outOfStockCount: outOfStockItems.length,
      lowStockItems,
      outOfStockItems
    });
  } catch (error) {
    console.error('Error in getInventoryAlerts:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
