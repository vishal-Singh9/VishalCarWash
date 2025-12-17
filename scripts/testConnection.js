require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function testConnection() {
  console.log('🔍 Testing MongoDB Atlas connection...\n');
  
  const MONGODB_URI = process.env.MONGODB_URI;
  
  if (!MONGODB_URI) {
    console.error('❌ Error: MONGODB_URI not found in environment variables');
    process.exit(1);
  }
  
  console.log('📝 Connection String:', MONGODB_URI.replace(/:[^:@]+@/, ':****@'));
  
  try {
    // Test connection
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Successfully connected to MongoDB Atlas!');
    
    // Get database info
    const db = mongoose.connection.db;
    const dbName = db.databaseName;
    console.log(`📊 Database Name: ${dbName}`);
    
    // List collections
    const collections = await db.listCollections().toArray();
    console.log(`\n📚 Collections found (${collections.length}):`);
    
    if (collections.length === 0) {
      console.log('   - No collections yet (will be created on first use)');
    } else {
      for (const collection of collections) {
        const count = await db.collection(collection.name).countDocuments();
        console.log(`   - ${collection.name}: ${count} document(s)`);
      }
    }
    
    console.log('\n✅ Connection test completed successfully!');
    console.log('🚀 Your application is ready to use MongoDB Atlas\n');
    
  } catch (error) {
    console.error('\n❌ Connection failed:', error.message);
    console.error('\n📋 Troubleshooting steps:');
    console.error('   1. Check your MongoDB Atlas credentials');
    console.error('   2. Ensure your IP is whitelisted in MongoDB Atlas');
    console.error('   3. Verify the database name is correct');
    console.error('   4. Check your network connection\n');
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

testConnection();

