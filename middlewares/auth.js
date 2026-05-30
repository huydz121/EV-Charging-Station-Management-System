module.exports = {
  isAuthenticated: (req, res, next) => {
    if (req.session && req.session.user) {
      return next();
    }
    req.session.returnTo = req.originalUrl;
    return res.redirect('/auth/login');
  },

  isGuest: (req, res, next) => {
    if (req.session && req.session.user) {
      if (req.session.user.role === 'admin') {
        return res.redirect('/admin/dashboard');
      }
      return res.redirect('/customer');
    }
    return next();
  }
};
// Tuan 3
