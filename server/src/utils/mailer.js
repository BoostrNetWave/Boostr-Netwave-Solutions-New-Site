const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail({ to, subject, html }) {
  try {
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });
    return { success: true, result };
  } catch (err) {
    // IMPORTANT: never throw here — the response must not depend on email delivery
    console.error('Email send failed:', err.message);
    return { success: false, error: err.message };
  }
}

module.exports = { sendEmail };
