const User = require('../models/User');
const mailer = require('../services/mailer');
const bcrypt = require('bcryptjs');

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.getLogin = (req, res) => {
  res.render('customer/login', { layout: false, error: null, isRegister: false });
};

exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.render('customer/login', {
        layout: false,
        error: 'Email hoặc mật khẩu không đúng',
        isRegister: false
      });
    }

    if (!user.isActive) {
      // If user exists but not active, resend OTP and redirect to verify
      const otp = generateOTP();
      user.otp = otp;
      user.otpExpires = new Date(Date.now() + 5 * 60000); // 5 minutes
      await user.save();
      await mailer.sendOTP(user.email, otp, true);
      console.log(`🔑 [TESTING] OTP resent for unverified user (${user.email}): ${otp}`);
      return res.redirect(`/auth/verify-otp?email=${encodeURIComponent(user.email)}&type=register`);
    }

    user.lastLogin = new Date();
    await user.save();

    req.session.user = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar,
      balance: user.balance
    };

    const returnTo = req.session.returnTo;
    delete req.session.returnTo;

    if (user.role === 'admin') {
      return res.redirect(returnTo || '/admin/dashboard');
    }
    return res.redirect(returnTo || '/customer');
  } catch (error) {
    console.error('Login error:', error);
    res.render('customer/login', {
      layout: false,
      error: 'Đã xảy ra lỗi, vui lòng thử lại',
      isRegister: false
    });
  }
};

exports.getRegister = (req, res) => {
  res.render('customer/login', { layout: false, error: null, isRegister: true });
};

exports.postRegister = async (req, res) => {
  try {
    const { fullName, email, phone, password, confirmPassword } = req.body;

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#\$%\^&\*])/;
    if (!passwordRegex.test(password)) {
      return res.render('customer/login', {
        layout: false,
        error: 'Mật khẩu phải chứa ít nhất 1 chữ hoa và 1 ký tự đặc biệt (@, #, $...)',
        isRegister: true
      });
    }

    if (password !== confirmPassword) {
      return res.render('customer/login', {
        layout: false,
        error: 'Mật khẩu xác nhận không khớp',
        isRegister: true
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isActive) {
      return res.render('customer/login', {
        layout: false,
        error: 'Email đã được sử dụng',
        isRegister: true
      });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 5 * 60000); // 5 mins

    if (existingUser && !existingUser.isActive) {
      // Update existing unverified user
      existingUser.fullName = fullName;
      existingUser.phone = phone;
      existingUser.password = password; // pre-save hook will hash it
      existingUser.otp = otp;
      existingUser.otpExpires = otpExpires;
      await existingUser.save();
    } else {
      await User.create({
        fullName,
        email,
        phone,
        password,
        role: 'customer',
        balance: 0,
        isActive: false,
        otp,
        otpExpires
      });
    }

    await mailer.sendOTP(email, otp, true);
    console.log(`🔑 [TESTING] OTP generated for registration (${email}): ${otp}`);

    return res.redirect(`/auth/verify-otp?email=${encodeURIComponent(email)}&type=register`);
  } catch (error) {
    console.error('Register error:', error);
    res.render('customer/login', {
      layout: false,
      error: 'Đã xảy ra lỗi khi đăng ký',
      isRegister: true
    });
  }
};

// --- OTP Verification ---
exports.getVerifyOTP = (req, res) => {
  const { email, type } = req.query;
  res.render('customer/verify-otp', { layout: false, email, type, error: null });
};

exports.postVerifyOTP = async (req, res) => {
  try {
    const { email, otp, type } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || user.otpExpires < new Date()) {
      return res.render('customer/verify-otp', {
        layout: false,
        email,
        type,
        error: 'Mã OTP không hợp lệ hoặc đã hết hạn'
      });
    }

    // Clear OTP
    user.otp = undefined;
    user.otpExpires = undefined;

    if (type === 'register') {
      user.isActive = true;
      await user.save();
      // Log them in
      req.session.user = {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        balance: user.balance
      };
      return res.redirect('/customer');
    } else if (type === 'reset') {
      await user.save();
      return res.redirect(`/auth/reset-password?email=${encodeURIComponent(email)}`);
    }

    return res.redirect('/auth/login');
  } catch (error) {
    res.render('customer/verify-otp', { layout: false, email: req.body.email, type: req.body.type, error: 'Lỗi xác thực OTP' });
  }
};

// --- Forgot Password ---
exports.getForgotPassword = (req, res) => {
  res.render('customer/forgot-password', { layout: false, error: null });
};

exports.postForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email, isActive: true });
    
    if (!user) {
      // Don't reveal if user exists or not
      return res.render('customer/forgot-password', { layout: false, error: 'Nếu email này tồn tại, mã OTP sẽ được gửi đi.' });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 5 * 60000);
    await user.save();

    await mailer.sendOTP(email, otp, false);
    console.log(`🔑 [TESTING] OTP generated for forgot password (${email}): ${otp}`);

    return res.redirect(`/auth/verify-otp?email=${encodeURIComponent(email)}&type=reset`);
  } catch (error) {
    res.render('customer/forgot-password', { layout: false, error: 'Đã xảy ra lỗi' });
  }
};

// --- Reset Password ---
exports.getResetPassword = (req, res) => {
  const { email } = req.query;
  res.render('customer/reset-password', { layout: false, email, error: null });
};

exports.postResetPassword = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#\$%\^&\*])/;
    if (!passwordRegex.test(password)) {
      return res.render('customer/reset-password', {
        layout: false,
        email,
        error: 'Mật khẩu phải chứa ít nhất 1 chữ hoa và 1 ký tự đặc biệt (@, #, $...)'
      });
    }

    if (password !== confirmPassword) {
      return res.render('customer/reset-password', { layout: false, email, error: 'Mật khẩu không khớp' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.redirect('/auth/login');

    user.password = password; // Pre-save hook handles hashing
    await user.save();

    return res.redirect('/auth/login');
  } catch (error) {
    res.render('customer/reset-password', { layout: false, email: req.body.email, error: 'Đã xảy ra lỗi' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    res.redirect('/auth/login');
  });
};
