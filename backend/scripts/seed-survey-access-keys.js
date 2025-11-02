const mongoose = require('mongoose');
const path = require('path');
const config = require('../config/environment');
const SchoolOrganization = require('../models/SchoolOrganization');

async function connect() {
  const uri = process.env.MONGO_URI || config.MONGO_URI;
  if (!uri) {
    console.error('❌ MONGO_URI is not set');
    process.exit(1);
  }
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
}

function makeOrg(index) {
  const n = String(index).padStart(3, '0');
  return {
    schoolName: `Test School ${n}`,
    accessKeys: {
      management: `MGT-TEST-${n}`,
      educators: `EDU-TEST-${n}`,
      learners: `LEARN-TEST-${n}`,
    },
  };
}

async function run() {
  const args = process.argv.slice(2);
  const shouldClear = args.includes('--clear');
  const countArg = args.find(a => a.startsWith('--count='));
  const count = countArg ? parseInt(countArg.split('=')[1], 10) || 3 : 3;

  await connect();

  if (shouldClear) {
    console.log('🧹 Clearing existing SchoolOrganization documents...');
    await SchoolOrganization.deleteMany({});
  }

  console.log(`🌱 Seeding ${count} SchoolOrganization documents...`);

  for (let i = 1; i <= count; i++) {
    const data = makeOrg(i);
    const existing = await SchoolOrganization.findOne({ schoolName: data.schoolName });
    if (existing) {
      console.log(`↷ Skipping existing: ${data.schoolName}`);
      continue;
    }
    await SchoolOrganization.create(data);
    console.log(`✅ Inserted: ${data.schoolName}`);
  }

  await mongoose.connection.close();
  console.log('🎉 Done.');
}

run().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
