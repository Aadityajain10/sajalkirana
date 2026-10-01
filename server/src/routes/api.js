import express from 'express';
import {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  getInventoryAlerts
} from '../controllers/productController.js';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';
import {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner
} from '../controllers/bannerController.js';
import {
  getInquiries,
  createInquiry,
  updateInquiryStatus
} from '../controllers/inquiryController.js';
import { getDashboardStats } from '../controllers/analyticsController.js';
import { mockStoreSettings } from '../data/mockData.js';

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    store: 'Sajal Kirana API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Store Settings
router.get('/store-settings', (req, res) => {
  res.json({ success: true, data: mockStoreSettings });
});

// Products
router.get('/products', getProducts);
router.get('/products/inventory-alerts', getInventoryAlerts);
router.get('/products/:slug', getProductBySlug);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Categories
router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// Banners
router.get('/banners', getBanners);
router.post('/banners', createBanner);
router.put('/banners/:id', updateBanner);
router.delete('/banners/:id', deleteBanner);

// Inquiries / WhatsApp Orders
router.get('/inquiries', getInquiries);
router.post('/inquiries', createInquiry);
router.put('/inquiries/:id/status', updateInquiryStatus);

// Analytics
router.get('/analytics/dashboard', getDashboardStats);

export default router;
