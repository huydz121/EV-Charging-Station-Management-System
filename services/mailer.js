const nodemailer = require('nodemailer');

const createTransporter = async () => {
  // If no real SMTP config is provided, we can use ethereal email for testing
  if (!process.env.SMTP_USER) {
    let testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, 
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  // Use real config (like Gmail)
  return nodemailer.createTransport({
    service: 'gmail', // or host: process.env.SMTP_HOST
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

exports.sendOTP = async (email, otp, isRegister = false) => {
  const transporter = await createTransporter();
  const subject = isRegister ? 'Xác thực tài khoản EV Charge' : 'Khôi phục mật khẩu EV Charge';
  const title = isRegister ? 'Xác thực tài khoản' : 'Khôi phục mật khẩu';
  const desc = isRegister 
    ? 'Cảm ơn bạn đã đăng ký tài khoản tại EV Charge. Để hoàn tất quá trình, vui lòng sử dụng mã OTP dưới đây:'
    : 'Chúng tôi nhận được yêu cầu khôi phục mật khẩu của bạn. Vui lòng sử dụng mã OTP dưới đây để thiết lập lại:';

  const html = `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
    <div style="background-color: #00d26a; padding: 25px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 1px;">⚡ EV Charge</h1>
    </div>
    <div style="padding: 40px 30px; background-color: #ffffff;">
      <h2 style="color: #2c3e50; margin-top: 0; font-size: 22px;">${title}</h2>
      <p style="color: #555555; line-height: 1.6; font-size: 16px;">
        Xin chào,<br><br>
        ${desc}
      </p>
      <div style="text-align: center; margin: 35px 0;">
        <span style="display: inline-block; padding: 15px 40px; font-size: 36px; font-weight: bold; color: #00d26a; background-color: #f0fdf4; border: 2px dashed #00d26a; border-radius: 10px; letter-spacing: 8px;">
          ${otp}
        </span>
      </div>
      <p style="color: #888888; font-size: 14px; text-align: center; margin-bottom: 0;">
        Mã OTP này có hiệu lực trong vòng <strong>5 phút</strong>.<br>Vui lòng không chia sẻ mã này cho bất kỳ ai để đảm bảo an toàn.
      </p>
    </div>
    <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eeeeee;">
      <p style="color: #999999; font-size: 13px; margin: 0;">
        © 2026 EV Charge. Tất cả các quyền được bảo lưu.
      </p>
    </div>
  </div>
  `;

  const info = await transporter.sendMail({
    from: '"EV Charge" <noreply@evcharge.vn>',
    to: email,
    subject: subject,
    html: html,
  });

  if (!process.env.SMTP_USER) {
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  }
  
  return info;
};
