/**
 * db/setupAdmin.js — Create Initial Superadmin via CLI
 * Run: node src/db/setupAdmin.js [name] [email] [password]
 * Example: node src/db/setupAdmin.js Admin admin@boostrnetwave.com SecurePassword123!
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { connectDB } = require('../config/db');
const AdminUser = require('../models/AdminUser');

const setup = async () => {
  const args = process.argv.slice(2);
  const name = args[0] || 'Super Admin';
  const email = args[1] || 'admin@boostrnetwave.com';
  const password = args[2] || 'BoostrAdmin2026!';

  console.log('👑  Setting up Superadmin account...\n');
  await connectDB();

  const existing = await AdminUser.findOne({ email });
  if (existing) {
    console.log(`⚠️  Admin user with email ${email} already exists.`);
    const hashedPassword = await bcrypt.hash(password, 12);
    existing.password = hashedPassword;
    existing.role = 'superadmin';
    existing.isActive = true;
    await existing.save();
    console.log(`✅  Password updated successfully for: ${email}`);
  } else {
    const hashedPassword = await bcrypt.hash(password, 12);
    await AdminUser.create({
      name,
      email,
      password: hashedPassword,
      role: 'superadmin',
      isActive: true,
    });
    console.log(`🎉  Superadmin user created successfully:`);
    console.log(`    Name:     ${name}`);
    console.log(`    Email:    ${email}`);
    console.log(`    Password: ${password}\n`);
  }

  await mongoose.connection.close();
  process.exit(0);
};

setup().catch((err) => {
  console.error('❌  Setup failed:', err.message);
  process.exit(1);
});
