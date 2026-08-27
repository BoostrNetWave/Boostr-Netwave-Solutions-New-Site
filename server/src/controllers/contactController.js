const ContactLead = require('../models/ContactLead');
const { ApiResponse } = require('../utils/ApiResponse');
const { ApiError } = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { sendEmail } = require('../utils/mailer');
const { adminLeadAlertTemplate, userAutoResponderTemplate } = require('../utils/emailTemplates');

// POST /api/contact  (public)
const submit = asyncHandler(async (req, res) => {
  const { name, email, phone, company, service, budget, message } = req.body;
  if (!name || !email || !message) throw new ApiError(400, 'Name, email, and message are required.');

  if (String(name).length > 100) throw new ApiError(400, 'Name is too long.');
  if (String(email).length > 254) throw new ApiError(400, 'Email is too long.');
  if (String(message).length > 3000) throw new ApiError(400, 'Message is too long (max 3000 chars).');

  const lead = await ContactLead.create({
    name, email, phone, company, service, budget, message,
    ipAddress: req.ip,
  });

  // Fire-and-forget: do not await-block the response on email delivery.
  Promise.allSettled([
    sendEmail({
      to: process.env.CONTACT_ALERT_EMAIL,
      subject: `New Inquiry: ${name}`,
      html: adminLeadAlertTemplate({ name, email, phone, service, budget, message }),
    }),
    sendEmail({
      to: email,
      subject: 'Thanks for reaching out to Boostr Netwave',
      html: userAutoResponderTemplate({ name }),
    }),
  ]);

  res.status(201).json(new ApiResponse(201, { id: lead._id }, 'Message received. We will be in touch shortly!'));
});

// GET /api/admin/contact  (admin)
const getAll = asyncHandler(async (req, res) => {
  const status = req.query.status;
  const filter = status ? { status } : {};
  const leads = await ContactLead.find(filter).sort('-createdAt');
  res.json(new ApiResponse(200, leads));
});

// PATCH /api/admin/contact/:id  (admin — update status)
const updateStatus = asyncHandler(async (req, res) => {
  const lead = await ContactLead.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  );
  if (!lead) throw new ApiError(404, 'Lead not found.');
  res.json(new ApiResponse(200, lead, 'Lead status updated.'));
});

module.exports = { submit, getAll, updateStatus };
