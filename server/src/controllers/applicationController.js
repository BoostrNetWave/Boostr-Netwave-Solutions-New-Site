const JobApplication = require('../models/JobApplication');
const Career = require('../models/Career');
const { ApiResponse } = require('../utils/ApiResponse');
const { ApiError } = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { sendEmail } = require('../utils/mailer');
const { escapeHtml } = require('../utils/emailTemplates'); // Let's export it from there or define it here. Wait, let's define it here or modify emailTemplates.js to export it.

// POST /api/applications  (public)
const submitApplication = asyncHandler(async (req, res) => {
  const { jobId, name, email, phone, linkedinUrl, portfolioUrl, resumeUrl, coverLetter } = req.body;
  if (!jobId || !name || !email || !resumeUrl) {
    throw new ApiError(400, 'Job ID, Name, email, and resume link are required.');
  }

  // Length validations
  if (String(name).length > 100) throw new ApiError(400, 'Name is too long.');
  if (String(email).length > 254) throw new ApiError(400, 'Email is too long.');
  if (String(resumeUrl).length > 1000) throw new ApiError(400, 'Resume URL is too long.');
  if (coverLetter && String(coverLetter).length > 3000) throw new ApiError(400, 'Cover letter is too long (max 3000 chars).');

  // Verify job exists
  const job = await Career.findById(jobId);
  if (!job) throw new ApiError(404, 'Job not found.');

  const application = await JobApplication.create({
    jobId, name, email, phone, linkedinUrl, portfolioUrl, resumeUrl, coverLetter,
    ipAddress: req.ip,
  });

  // Fire-and-forget emails
  Promise.allSettled([
    sendEmail({
      to: process.env.CONTACT_ALERT_EMAIL,
      subject: `New Job Application: ${name} for ${job.title}`,
      html: `
        <h2>New Application for ${escapeHtml(job.title)}</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone) || 'N/A'}</p>
        <p><strong>LinkedIn:</strong> ${escapeHtml(linkedinUrl) || 'N/A'}</p>
        <p><strong>Portfolio:</strong> ${escapeHtml(portfolioUrl) || 'N/A'}</p>
        <p><strong>Resume:</strong> <a href="${escapeHtml(resumeUrl)}">${escapeHtml(resumeUrl)}</a></p>
        <p><strong>Cover Letter:</strong></p>
        <p>${escapeHtml(coverLetter) || 'None'}</p>
      `
    }),
    sendEmail({
      to: email,
      subject: `Application Received: ${job.title}`,
      html: `
        <p>Hi ${escapeHtml(name)},</p>
        <p>Thanks for applying for the <strong>${escapeHtml(job.title)}</strong> position at Boostr Netwave Solutions. We have successfully received your application.</p>
        <p>Our team will review your profile and get back to you if we think it's a good match.</p>
        <p>Best,<br/>The Boostr Netwave Team</p>
      `
    }),
  ]);

  res.status(201).json(new ApiResponse(201, { id: application._id }, 'Application submitted successfully!'));
});

// GET /api/admin/applications  (admin)
const getAllApplications = asyncHandler(async (req, res) => {
  const status = req.query.status;
  const filter = status ? { status } : {};
  // Populate the career title for the frontend
  const applications = await JobApplication.find(filter)
    .populate('jobId', 'title')
    .sort('-createdAt');
  res.json(new ApiResponse(200, applications));
});

// PATCH /api/admin/applications/:id  (admin — update status)
const updateApplicationStatus = asyncHandler(async (req, res) => {
  const application = await JobApplication.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  ).populate('jobId', 'title');
  if (!application) throw new ApiError(404, 'Application not found.');
  res.json(new ApiResponse(200, application, 'Application status updated.'));
});

module.exports = { submitApplication, getAllApplications, updateApplicationStatus };
