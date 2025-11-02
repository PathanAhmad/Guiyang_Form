const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
const API = `${BASE_URL}/api/survey-access/validate`;

const colors = {
  reset: '\x1b[0m', red: '\x1b[31m', green: '\x1b[32m', yellow: '\x1b[33m', blue: '\x1b[34m'
};
const log = {
  info: (m) => console.log(`${colors.blue}ℹ️  ${m}${colors.reset}`),
  ok: (m) => console.log(`${colors.green}✅ ${m}${colors.reset}`),
  err: (m) => console.log(`${colors.red}❌ ${m}${colors.reset}`),
  warn: (m) => console.log(`${colors.yellow}⚠️  ${m}${colors.reset}`)
};

async function post(data) {
  try {
    const res = await axios.post(API, data, { timeout: 5000 });
    return res.data;
  } catch (e) {
    if (e.response) return e.response.data;
    throw e;
  }
}

async function run() {
  log.info('Ensure you ran: node scripts/seed-survey-access-keys.js --clear --count=1');

  // Valid keys (from seed: index 1)
  const valid = [
    { accessKey: 'MGT-TEST-001', surveyType: 'management' },
    { accessKey: 'EDU-TEST-001', surveyType: 'educators' },
    { accessKey: 'LEARN-TEST-001', surveyType: 'learners' },
  ];

  for (const v of valid) {
    const res = await post(v);
    if (res && res.valid === true && res.success === true && typeof res.schoolName === 'string') {
      log.ok(`Valid key accepted (${v.surveyType})`);
    } else {
      log.err(`Valid key failed (${v.surveyType}) → ${JSON.stringify(res)}`);
    }
  }

  // Invalid key
  const invalid = await post({ accessKey: 'NOPE-123', surveyType: 'management' });
  if (invalid && invalid.valid === false) log.ok('Invalid key rejected'); else log.err(`Invalid key test failed → ${JSON.stringify(invalid)}`);

  // Missing accessKey
  const missingKey = await post({ surveyType: 'management' });
  if (missingKey && missingKey.valid === false) log.ok('Missing key rejected'); else log.err(`Missing key test failed → ${JSON.stringify(missingKey)}`);

  // Invalid surveyType
  const badType = await post({ accessKey: 'MGT-TEST-001', surveyType: 'admin' });
  if (badType && badType.valid === false) log.ok('Invalid type rejected'); else log.err(`Invalid type test failed → ${JSON.stringify(badType)}`);

  // Trim whitespace
  const trimmed = await post({ accessKey: '  MGT-TEST-001  ', surveyType: 'management' });
  if (trimmed && trimmed.valid === true) log.ok('Whitespace trimmed'); else log.err(`Trim test failed → ${JSON.stringify(trimmed)}`);
}

run().catch((e) => {
  log.err(e.message || e);
  process.exit(1);
});


