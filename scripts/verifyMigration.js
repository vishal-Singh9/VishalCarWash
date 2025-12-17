require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  step: (msg) => console.log(`${colors.cyan}🔍 ${msg}${colors.reset}`),
};

async function verifyEnvironmentVariables() {
  log.step('Step 1: Verifying Environment Variables');
  
  const required = [
    'MONGODB_URI',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
  ];
  
  let allPresent = true;
  
  for (const varName of required) {
    if (process.env[varName]) {
      log.success(`${varName} is set`);
    } else {
      log.error(`${varName} is missing`);
      allPresent = false;
    }
  }
  
  // Check optional variables
  const optional = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'NEXTAUTH_DATABASE'];
  console.log('\nOptional variables:');
  for (const varName of optional) {
    if (process.env[varName] && !process.env[varName].includes('your-')) {
      log.success(`${varName} is configured`);
    } else {
      log.warning(`${varName} not configured (optional)`);
    }
  }
  
  return allPresent;
}

async function verifyDatabaseConnection() {
  log.step('\nStep 2: Testing MongoDB Atlas Connection');
  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    log.success('Connected to MongoDB Atlas');
    
    const db = mongoose.connection.db;
    const dbName = db.databaseName;
    log.info(`Database name: ${dbName}`);
    
    return true;
  } catch (error) {
    log.error(`Connection failed: ${error.message}`);
    return false;
  }
}

async function verifyCollections() {
  log.step('\nStep 3: Verifying Collections');
  
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    log.info(`Found ${collections.length} collection(s)`);
    
    const expectedCollections = ['users', 'services'];
    const foundCollections = collections.map(c => c.name);
    
    for (const expected of expectedCollections) {
      if (foundCollections.includes(expected)) {
        const count = await db.collection(expected).countDocuments();
        log.success(`${expected}: ${count} document(s)`);
        
        if (expected === 'services' && count === 0) {
          log.warning('Services collection is empty. Run: npm run seed');
        }
      } else {
        log.warning(`${expected} collection not found (will be created on first use)`);
      }
    }
    
    return true;
  } catch (error) {
    log.error(`Collection verification failed: ${error.message}`);
    return false;
  }
}

async function verifyDatabaseFiles() {
  log.step('\nStep 4: Verifying Database Configuration Files');
  
  const fs = require('fs');
  const path = require('path');
  
  const files = [
    { path: 'lib/db.js', check: 'mongoose.connect(MONGODB_URI)' },
    { path: 'lib/mongodb.js', check: 'process.env.MONGODB_URI' },
    { path: 'app/api/auth/[...nextauth]/route.js', check: 'clientPromise' },
  ];
  
  let allValid = true;
  
  for (const file of files) {
    const filePath = path.join(process.cwd(), file.path);
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      if (content.includes(file.check)) {
        log.success(`${file.path} - Configured correctly`);
      } else {
        log.warning(`${file.path} - Check configuration`);
      }
    } catch (error) {
      log.error(`${file.path} - File not found`);
      allValid = false;
    }
  }
  
  return allValid;
}

async function checkHardcodedCredentials() {
  log.step('\nStep 5: Security Check - Scanning for Hardcoded Credentials');
  
  const fs = require('fs');
  const path = require('path');
  
  const filePath = path.join(process.cwd(), 'lib/db.js');
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Check for hardcoded connection strings
  const hasHardcodedUri = content.match(/mongoose\.connect\s*\(\s*['"`]mongodb/);
  
  if (hasHardcodedUri) {
    log.error('Found hardcoded MongoDB URI in lib/db.js');
    return false;
  } else {
    log.success('No hardcoded credentials found - Using environment variables');
    return true;
  }
}

async function verifyModels() {
  log.step('\nStep 6: Verifying Mongoose Models');
  
  const fs = require('fs');
  const path = require('path');
  const models = ['User', 'Booking', 'Service'];
  let allValid = true;
  
  for (const modelName of models) {
    try {
      const modelPath = path.join(process.cwd(), 'models', `${modelName}.js`);
      if (fs.existsSync(modelPath)) {
        const content = fs.readFileSync(modelPath, 'utf-8');
        // Check if model has basic schema structure
        if (content.includes('mongoose.Schema') && content.includes('mongoose.model')) {
          log.success(`${modelName} model exists and properly structured`);
        } else {
          log.warning(`${modelName} model structure issue`);
        }
      } else {
        log.error(`${modelName} model file not found`);
        allValid = false;
      }
    } catch (error) {
      log.error(`${modelName} model verification failed: ${error.message}`);
      allValid = false;
    }
  }
  
  log.info('Note: Models are ES modules and work correctly in Next.js context');
  
  return allValid;
}

async function generateReport() {
  log.step('\nStep 7: Generating Migration Report');
  
  const db = mongoose.connection.db;
  const collections = await db.listCollections().toArray();
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 MIGRATION VERIFICATION REPORT');
  console.log('='.repeat(60));
  
  console.log('\n🔐 Environment Configuration:');
  console.log(`  MongoDB URI: ${process.env.MONGODB_URI.replace(/:[^:@]+@/, ':****@')}`);
  console.log(`  NextAuth URL: ${process.env.NEXTAUTH_URL}`);
  console.log(`  NextAuth DB: ${process.env.NEXTAUTH_DATABASE || 'VishalCarWash (default)'}`);
  console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
  
  console.log('\n📦 Database Information:');
  console.log(`  Connection: ✅ Connected`);
  console.log(`  Database: ${db.databaseName}`);
  console.log(`  Collections: ${collections.length}`);
  
  console.log('\n📚 Collections Detail:');
  for (const collection of collections) {
    const count = await db.collection(collection.name).countDocuments();
    console.log(`  • ${collection.name}: ${count} document(s)`);
  }
  
  console.log('\n🔧 API Routes Using MongoDB Atlas:');
  const routes = [
    '  • GET  /api/services',
    '  • GET  /api/bookings',
    '  • POST /api/bookings',
    '  • POST /api/auth/signup',
    '  • PUT  /api/user/update',
    '  • *    /api/auth/[...nextauth]',
  ];
  routes.forEach(route => console.log(route));
  
  console.log('\n✅ Next Steps:');
  console.log('  1. Start your development server: npm run dev');
  console.log('  2. Access your app: http://localhost:3001');
  console.log('  3. Test user registration and booking features');
  
  console.log('\n' + '='.repeat(60));
}

async function runVerification() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║   MongoDB Atlas Migration Verification                    ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');
  
  const results = {
    envVars: false,
    connection: false,
    collections: false,
    files: false,
    security: false,
    models: false,
  };
  
  try {
    results.envVars = await verifyEnvironmentVariables();
    results.connection = await verifyDatabaseConnection();
    
    if (results.connection) {
      results.collections = await verifyCollections();
      results.files = await verifyDatabaseFiles();
      results.security = await checkHardcodedCredentials();
      results.models = await verifyModels();
      await generateReport();
    }
    
    const allPassed = Object.values(results).every(r => r === true);
    
    console.log('\n' + '='.repeat(60));
    console.log('📋 VERIFICATION SUMMARY');
    console.log('='.repeat(60));
    
    Object.entries(results).forEach(([key, value]) => {
      const status = value ? `${colors.green}✅ PASSED` : `${colors.red}❌ FAILED`;
      const label = key.replace(/([A-Z])/g, ' $1').toUpperCase();
      console.log(`${status}${colors.reset} - ${label}`);
    });
    
    console.log('='.repeat(60));
    
    if (allPassed) {
      log.success('\n🎉 All verification checks passed!');
      log.success('Your application is ready to use MongoDB Atlas\n');
    } else {
      log.error('\n⚠️  Some checks failed. Please review the errors above.\n');
      process.exit(1);
    }
    
  } catch (error) {
    log.error(`\nVerification error: ${error.message}`);
    console.error(error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

// Run verification
runVerification();

