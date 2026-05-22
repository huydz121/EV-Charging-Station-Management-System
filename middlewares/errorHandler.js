module.exports = (err, req, res, next) => {
  console.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Đã xảy ra lỗi server';

  if (req.xhr || req.headers.accept?.indexOf('json') > -1) {
    return res.status(statusCode).json({ success: false, message });
  }

  res.status(statusCode).render('customer/login', {
    layout: false,
    error: message
  });
};
