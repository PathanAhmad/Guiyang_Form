const mongoose = require('mongoose');
const path = require('path');
const config = require('../config/environment');
const DeploymentAccessKey = require('../models/DeploymentAccessKey');

/**
 * Database connection helper
 */
async function connect() {
  const uri = process.env.MONGO_URI || config.MONGO_URI;
  if (!uri) {
    console.error('❌ MONGO_URI is not set');
    process.exit(1);
  }
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
}

/**
 * Generate a unique access key
 */
async function generateUniqueKey() {
  let accessKey;
  let isUnique = false;
  let attempts = 0;
  
  while (!isUnique && attempts < 10) {
    accessKey = DeploymentAccessKey.generateKey();
    const existing = await DeploymentAccessKey.findOne({ accessKey });
    if (!existing) {
      isUnique = true;
    }
    attempts++;
  }
  
  if (!isUnique) {
    throw new Error('Failed to generate unique access key after 10 attempts');
  }
  
  return accessKey;
}

/**
 * Calculate expiration date
 */
function getExpirationDate(months) {
  if (!months) return null;
  const date = new Date();
  date.setMonth(date.getMonth() + months);
  return date;
}

/**
 * Create deployment key configuration
 */
function createKeyConfig(roleType, index, count) {
  const configs = {
    school: {
      keyName: count > 1 ? `School Management Key ${index}` : 'School Management Key',
      expiresAt: null, // Never expires
      maxUses: null, // Unlimited uses
      duration: 'never',
      originalMaxUses: 'unlimited',
    },
    educator: {
      keyName: count > 1 ? `Educator Access Key ${index}` : 'Educator Access Key',
      expiresAt: getExpirationDate(6), // 6 months
      maxUses: 50,
      duration: '6months',
      originalMaxUses: '50',
    },
    learner: {
      keyName: count > 1 ? `Learner Access Key ${index}` : 'Learner Access Key',
      expiresAt: getExpirationDate(3), // 3 months
      maxUses: 100,
      duration: '3months',
      originalMaxUses: '100',
    },
    special: {
      keyName: count > 1 ? `Special Learner Key ${index}` : 'Special Learner Key',
      expiresAt: getExpirationDate(12), // 1 year
      maxUses: null, // Unlimited uses
      duration: '1year',
      originalMaxUses: 'unlimited',
    },
  };
  
  return configs[roleType];
}

/**
 * Create a deployment access key
 */
async function createDeploymentKey(roleType, index, count) {
  const config = createKeyConfig(roleType, index, count);
  const accessKey = await generateUniqueKey();
  
  const keyData = {
    keyName: config.keyName,
    accessKey: accessKey,
    roleType: roleType,
    expiresAt: config.expiresAt,
    maxUses: config.maxUses,
    createdBy: 'saraundre', // Admin userid from auth system
    metadata: {
      duration: config.duration,
      originalMaxUses: config.originalMaxUses,
      seededAt: new Date().toISOString(),
    },
  };
  
  const key = await DeploymentAccessKey.create(keyData);
  return key;
}

/**
 * Format expiration date for display
 */
function formatExpiration(date) {
  if (!date) return 'Never';
  return new Date(date).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

/**
 * Format max uses for display
 */
function formatMaxUses(maxUses) {
  return maxUses === null ? 'Unlimited' : maxUses.toString();
}

/**
 * Display keys in a formatted table
 */
function displayKeys(keys) {
  console.log('\n' + '='.repeat(100));
  console.log('📋 GENERATED DEPLOYMENT ACCESS KEYS');
  console.log('='.repeat(100));
  
  // Group by role type
  const roleTypes = ['school', 'educator', 'learner', 'special'];
  
  roleTypes.forEach(roleType => {
    const roleKeys = keys.filter(k => k.roleType === roleType);
    if (roleKeys.length === 0) return;
    
    const roleEmojis = {
      school: '🏫',
      educator: '👨‍🏫',
      learner: '🎓',
      special: '✨',
    };
    
    console.log(`\n${roleEmojis[roleType]} ${roleType.toUpperCase()}`);
    console.log('-'.repeat(100));
    
    roleKeys.forEach(key => {
      console.log(`  Key Name:  ${key.keyName}`);
      console.log(`  Access Key: ${key.accessKey}`);
      console.log(`  Max Uses:   ${formatMaxUses(key.maxUses)}`);
      console.log(`  Expires:    ${formatExpiration(key.expiresAt)}`);
      console.log(`  Status:     Active`);
      console.log('-'.repeat(100));
    });
  });
  
  console.log('\n💡 Use these keys to test the deployment portal login at:');
  console.log('   http://localhost:3000/deployment_portal/{roleType}');
  console.log('');
}

/**
 * Main seed function
 */
async function run() {
  const args = process.argv.slice(2);
  const shouldClear = args.includes('--clear');
  const countArg = args.find(a => a.startsWith('--count='));
  const count = countArg ? parseInt(countArg.split('=')[1], 10) || 1 : 1;
  
  console.log('\n🌱 Deployment Access Keys Seeder');
  console.log('================================\n');
  
  await connect();
  console.log('✅ Connected to MongoDB\n');
  
  if (shouldClear) {
    console.log('🧹 Clearing existing deployment access keys...');
    const result = await DeploymentAccessKey.deleteMany({});
    console.log(`   Deleted ${result.deletedCount} keys\n`);
  }
  
  console.log(`📝 Creating ${count} key(s) per role type...`);
  
  const roleTypes = ['school', 'educator', 'learner', 'special'];
  const createdKeys = [];
  
  for (const roleType of roleTypes) {
    for (let i = 1; i <= count; i++) {
      try {
        const key = await createDeploymentKey(roleType, i, count);
        createdKeys.push(key);
        console.log(`   ✅ ${roleType.padEnd(10)} - ${key.keyName}`);
      } catch (error) {
        console.error(`   ❌ Failed to create ${roleType} key ${i}:`, error.message);
      }
    }
  }
  
  console.log(`\n✨ Successfully created ${createdKeys.length} deployment access keys`);
  
  // Display the keys
  displayKeys(createdKeys);
  
  await mongoose.connection.close();
  console.log('🔌 Database connection closed');
  console.log('\n🎉 Seeding complete!\n');
}

// Run the seeder
run().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});

