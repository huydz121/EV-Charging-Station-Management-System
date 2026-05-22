module.exports = {
  isAdmin: (req, res, next) => {
    if (req.session && req.session.user && req.session.user.role === 'admin') {
      return next();
    }
    return res.status(403).render('customer/login', {
      layout: false,
      error: 'Bạn không có quyền truy cập trang này'
    });
  },

  isCustomer: (req, res, next) => {
    if (req.session && req.session.user && req.session.user.role === 'customer') {
      return next();
    }
    return res.status(403).redirect('/auth/login');
  }
};
