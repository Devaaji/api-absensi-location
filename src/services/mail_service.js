require("dotenv").config();
const nodemailer = require("nodemailer");
const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

const transport = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: true,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

const sendOtpMail = async ({ to, otp }) =>
  await transport.sendMail({
    from: `'Presensi App' <noreply.presensi@mail.co.id`,
    to: `${to}`,
    subject: "Vrifikasi OTP Presensi App",
    text: `Jangan berikan kode ini kepada siapapun.
    Gunakan kode ini untuk verifikasi otp.
    
    OTP: ${otp}`,
    html: `Jangan berikan kode ini kepada siapapun. Gunakan kode ini untuk verifikasi otp.
    <br><br>
    OTP: <b>${otp}</b>`,
  });

module.exports = {
  sendOtpMail,
};
