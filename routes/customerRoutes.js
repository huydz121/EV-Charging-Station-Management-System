const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/auth');
const { isCustomer } = require('../middlewares/role');
const { renderWithLayout } = require('../middlewares/layoutHelper');

const mapController = require('../controllers/customer/mapController');
const reservationController = require('../controllers/customer/reservationController');
const chargingController = require('../controllers/customer/chargingController');
const paymentController = require('../controllers/customer/paymentController');
const historyController = require('../controllers/customer/historyController');
const profileController = require('../controllers/customer/profileController');
const Station = require('../models/Station');

// All customer routes require authentication
router.use(isAuthenticated, isCustomer);

// Add layout render helper to res
router.use((req, res, next) => {
  res.renderCustomer = function(view, data = {}) {
    data.user = req.session.user;
    renderWithLayout(res, 'customer/' + view, 'layouts/customer-layout', data);
  };
  next();
});

// Home
router.get('/', async (req, res) => {
  try {
    const stations = await Station.find({ status: 'active' }).limit(5);
    res.renderCustomer('index', {
      title: 'Trang chủ',
      stations,
      activePage: 'home'
    });
  } catch (error) {
    res.renderCustomer('index', {
      title: 'Trang chủ',
      stations: [],
      activePage: 'home'
    });
  }
});

// Map
router.get('/map', mapController.getMap);
router.get('/stations/search', mapController.searchStations);
router.get('/stations/:id', mapController.getStationDetail);

// Reservation
router.post('/reservations', reservationController.createReservation);
router.put('/reservations/:id/cancel', reservationController.cancelReservation);

// Charging
router.post('/charging/start', chargingController.startCharging);
router.get('/charging/:id', chargingController.getChargingSession);
router.get('/charging/:id/status', chargingController.getChargingStatus);
router.post('/charging/:id/stop', chargingController.stopCharging);

// Payment
router.get('/wallet', paymentController.getWallet);
router.post('/payment/topup', paymentController.createTopup);
router.get('/payment/check/:orderCode', paymentController.checkTopupStatus);
router.get('/payment/success', paymentController.paymentSuccess);
router.get('/payment/cancel', paymentController.paymentCancel);
router.post('/payment/webhook', paymentController.webhook);

// History
router.get('/history', historyController.getHistory);
router.get('/history/:id', historyController.getSessionDetail);

// Profile
router.get('/profile', profileController.getProfile);
router.put('/profile', profileController.updateProfile);
router.put('/profile/password', profileController.changePassword);

module.exports = router;
