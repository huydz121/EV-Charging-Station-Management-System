const express = require('express');
const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const methodOverride = require('method-override');
const path = require('path');

const config = require('./config');
const connectDB = require('./config/database');
const errorHandler = require('./middlewares/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/customerRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Session
app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: config.mongodbUri,
    touchAfter: 24 * 3600
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
  }
}));

// Khởi tạo biến toàn cục lưu thông báo
global.adminNotifications = global.adminNotifications || [];

// Global variables for views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.activePage = '';
  res.locals.hideNav = false;
  
  // Lấy 10 thông báo mới nhất
  res.locals.adminNotifications = global.adminNotifications.slice().reverse().slice(0, 10);
  
  next();
});

// Routes
app.get('/', (req, res) => {
  if (req.session.user) {
    if (req.session.user.role === 'admin') {
      return res.redirect('/admin/dashboard');
    }
    return res.redirect('/customer');
  }
  res.redirect('/auth/login');
});

app.use('/auth', authRoutes);
app.use('/customer', customerRoutes);
app.use('/admin', adminRoutes);

// PayOS Webhook (public endpoint)
app.post('/webhook/payos', require('./controllers/customer/paymentController').webhook);

// Error handler
app.use(errorHandler);

// 404
app.use((req, res) => {
  res.status(404).render('customer/login', {
    layout: false,
    error: 'Trang không tồn tại (404)'
  });
});

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`
  ⚡ =============================================
  ⚡  EV Charging System
  ⚡  Server running on http://localhost:${PORT}
  ⚡  
  ⚡  Login: http://localhost:${PORT}/auth/login
  ⚡ =============================================
  `);
});

module.exports = app;
// Tuan 3
