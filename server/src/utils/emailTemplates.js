function adminLeadAlertTemplate({ name, email, phone, service, budget, message }) {
  return `
    <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #0052FF; padding: 24px; border-radius: 12px 12px 0 0;">
        <h2 style="color: white; margin: 0;">New Contact Inquiry</h2>
      </div>
      <div style="padding: 24px; border: 1px solid #E5E7EB; border-top: none; border-radius: 0 0 12px 12px;">
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        ${phone ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ''}
        ${service ? `<p><strong>Service Interested In:</strong> ${escapeHtml(service)}</p>` : ''}
        ${budget ? `<p><strong>Budget:</strong> ${escapeHtml(budget)}</p>` : ''}
        <p><strong>Message:</strong></p>
        <p style="background: #F9F9F7; padding: 16px; border-radius: 8px;">${escapeHtml(message)}</p>
        <p style="margin-top: 24px;">
          <a href="${process.env.ADMIN_PANEL_URL || 'https://boostrnetwave.com'}/admin/inbox" style="color: #0052FF;">View in Admin Inbox →</a>
        </p>
      </div>
    </div>
  `;
}

function userAutoResponderTemplate({ name }) {
  return `
    <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #0D0D12; padding: 32px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">BOOSTR<span style="color:#0052FF">NETWAVE</span></h1>
      </div>
      <div style="padding: 32px; border: 1px solid #E5E7EB; border-top: none; border-radius: 0 0 12px 12px;">
        <p>Hi ${escapeHtml(name)},</p>
        <p>Thanks for reaching out to Boostr Netwave Solutions. We've received your inquiry and our team will review it within 24 hours.</p>
        <p>In the meantime, feel free to explore our <a href="https://boostrnetwave.com/case-studies" style="color:#0052FF;">recent work</a> or <a href="https://boostrnetwave.com/products" style="color:#0052FF;">our products</a>.</p>
        <p>Talk soon,<br/>The Boostr Netwave Team</p>
      </div>
    </div>
  `;
}

// Prevents HTML injection via user-submitted form fields
function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

module.exports = { adminLeadAlertTemplate, userAutoResponderTemplate, escapeHtml };
