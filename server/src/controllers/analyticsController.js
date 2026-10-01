import { mockProducts, mockCategories } from '../data/mockData.js';
import { orderStore } from '../data/orderStore.js';

export const getDashboardStats = async (req, res) => {
  try {
    const orders = orderStore.getAll();
    const totalProducts = mockProducts.length;
    const totalCategories = mockCategories.length;
    const activeInquiries = orders.filter(i => i.status === 'new' || i.status === 'contacted').length;
    const lowStockCount = mockProducts.filter(p => p.stock_quantity <= p.low_stock_threshold).length;
    const outOfStockCount = mockProducts.filter(p => p.stock_quantity === 0).length;
    const wholesaleProductsCount = mockProducts.filter(p => p.is_wholesale).length;
    
    const totalStockUnits = mockProducts.reduce((acc, p) => acc + (p.stock_quantity || 0), 0);
    const totalPipelineValue = orders.reduce((acc, i) => acc + (i.total_amount || 0), 0);

    const recentInquiries = orders.slice(0, 10);
    const lowStockAlerts = mockProducts
      .filter(p => p.stock_quantity <= p.low_stock_threshold)
      .map(p => ({
        id: p.id,
        name: p.name,
        stock_quantity: p.stock_quantity,
        low_stock_threshold: p.low_stock_threshold,
        unit: p.unit
      }));

    return res.json({
      success: true,
      stats: {
        totalProducts,
        totalCategories,
        activeInquiries,
        lowStockCount,
        outOfStockCount,
        wholesaleProductsCount,
        totalStockUnits,
        totalPipelineValue
      },
      recentInquiries,
      lowStockAlerts
    });
  } catch (error) {
    console.error('Error in getDashboardStats:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
