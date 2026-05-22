const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/auth');
const { isAdmin } = require('../middlewares/role');
const { renderWithLayout } = require('../middlewares/layoutHelper');

const dashboardController = require('../controllers/admin/dashboardController');
const stationController = require('../controllers/admin/stationController');
const userController = require('../controllers/admin/userController');
const priceController = require('../controllers/admin/priceController');
const reportController = require('../controllers/admin/reportController');
const maintenanceController = require('../controllers/admin/maintenanceController');
const refundController = require('../controllers/admin/refundController');

// All admin routes require authentication & admin role
router.use(isAuthenticated, isAdmin);

// Add layout render helper to res
router.use((req, res, next) => {
  res.renderAdmin = function(view, data = {}) {
    data.user = req.session.user;
    renderWithLayout(res, 'admin/' + view, 'layouts/admin-layout', data);
  };
  next();
});

// Dashboard and Settings
router.get('/dashboard', dashboardController.getDashboard);
router.get('/settings', dashboardController.getSettings);

// Clear notifications route
router.get('/clear-notifications', (req, res) => {
  global.adminNotifications = [];
  res.redirect('back');
});

// Station management
router.get('/stations', stationController.listStations);
router.get('/stations/create', stationController.getCreateStation);
router.post('/stations', stationController.createStation);
router.get('/stations/:id/edit', stationController.getEditStation);
router.put('/stations/:id', stationController.updateStation);
router.delete('/stations/:id', stationController.deleteStation);

// User management
router.get('/users', userController.listUsers);
router.put('/users/:id/toggle', userController.toggleUserStatus);
router.delete('/users/:id', userController.deleteUser);
router.get('/profile', userController.getProfile);

// Price management
router.get('/prices', priceController.listPrices);
router.post('/prices', priceController.createPrice);
router.put('/prices/:id', priceController.updatePrice);
router.delete('/prices/:id', priceController.deletePrice);

// Reports
router.get('/reports', reportController.getReports);

// Maintenance
router.get('/maintenance', maintenanceController.listMaintenance);
router.post('/maintenance', maintenanceController.createMaintenance);
router.put('/maintenance/:id', maintenanceController.updateMaintenanceStatus);

// Refunds
router.get('/refunds', refundController.listRefunds);
router.post('/refunds', refundController.processRefund);

module.exports = router;
