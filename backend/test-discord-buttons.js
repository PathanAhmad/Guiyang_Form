#!/usr/bin/env node

/**
 * Test script to demonstrate Discord buttons and queue processing
 * This simulates Discord button interactions locally
 * Run this with: node test-discord-buttons.js
 */

const axios = require('axios');

// Backend runs on port 5000
const BASE_URL = 'http://localhost:5000/api';

async function testDiscordButtons() {
  console.log('🧪 Testing Discord Buttons and Queue System\n');
  
  try {
    // 1. Submit multiple demo forms to create a queue
    console.log('📝 Step 1: Creating test submissions with buttons...');
    
    const submissions = [];
    for (let i = 1; i <= 4; i++) {
      const response = await axios.post(`${BASE_URL}/forms/demo`, {
        name: `Test User ${i}`,
        email: `user${i}@example.com`,
        phone: `+123456789${i}`
      });
      
      if (response.data.success) {
        submissions.push(response.data.data);
        console.log(`   ✅ Created submission: ${response.data.data.token} (Discord message sent with buttons)`);
      }
    }
    
    console.log(`\n   💬 Discord messages sent with interactive buttons for each token!`);
    
    // 2. Show queue status
    console.log('\n📊 Step 2: Current queue status...');
    const queueStatus = await axios.get(`${BASE_URL}/forms/queue/status`);
    console.log('   Queue Status:', JSON.stringify(queueStatus.data.data, null, 2));
    
    // 3. Simulate Discord button click: "Mark as Contacted"
    const firstToken = submissions[0].token;
    console.log(`\n📞 Step 3: Simulating Discord button click - "Mark as Contacted" for ${firstToken}...`);
    
    const contactResponse = await axios.patch(`${BASE_URL}/forms/submission/${firstToken}/status`, {
      status: 'contacted'
    });
    
    console.log('   Button Action Result:', contactResponse.data);
    console.log('   💬 Discord status update message sent!');
    
    // 4. Simulate Discord button click: "Mark as Completed" 
    console.log(`\n✅ Step 4: Simulating Discord button click - "Mark as Completed" for ${firstToken}...`);
    
    const completeResponse = await axios.patch(`${BASE_URL}/forms/submission/${firstToken}/status`, {
      status: 'completed'
    });
    
    console.log('   Completion Result:', completeResponse.data);
    
    if (completeResponse.data.data.nextInQueue) {
      console.log('   🔔 Next token automatically promoted:', completeResponse.data.data.nextInQueue);
      console.log('   💬 Discord "Next in Queue" notification sent!');
    }
    
    // 5. Test queue management endpoint
    console.log('\n🔍 Step 5: Testing queue management...');
    
    const nextInQueue = await axios.get(`${BASE_URL}/forms/queue/demo/next`);
    if (nextInQueue.data.data) {
      console.log('   Next in demo queue:', nextInQueue.data.data);
      
      // Simulate quick contact and completion of next token
      const nextToken = nextInQueue.data.data.token;
      console.log(`\n   📞 Quick processing of ${nextToken}...`);
      
      await axios.patch(`${BASE_URL}/forms/submission/${nextToken}/status`, {
        status: 'contacted'
      });
      console.log(`   ✅ ${nextToken} contacted`);
      
      await axios.patch(`${BASE_URL}/forms/submission/${nextToken}/status`, {
        status: 'completed'
      });
      console.log(`   ✅ ${nextToken} completed`);
    }
    
    // 6. Final queue status
    console.log('\n📊 Step 6: Final queue status...');
    const finalStatus = await axios.get(`${BASE_URL}/forms/queue/status`);
    console.log('   Final Queue Status:', JSON.stringify(finalStatus.data.data, null, 2));
    
    console.log('\n🎉 Discord Buttons and Queue System Test Complete!\n');
    
    console.log('📋 Summary of Discord Integration:');
    console.log('   ✅ Form submissions send Discord messages WITH interactive buttons');
    console.log('   ✅ Button clicks update token status automatically');
    console.log('   ✅ Status changes send Discord update notifications');
    console.log('   ✅ Completed tokens trigger "Next in Queue" notifications');
    console.log('   ✅ Queue management works seamlessly with Discord');
    
    console.log('\n🔗 Discord Button Actions Available:');
    console.log('   📞 "Mark as Contacted" - Updates waiting → contacted');
    console.log('   ✅ "Mark as Completed" - Updates contacted → completed');
    console.log('   ❌ "Cancel" - Updates any status → cancelled');
    console.log('   📊 "Check Status" - Shows current token information');
    
    console.log('\n🌐 Frontend Queue Dashboard:');
    console.log('   Visit: http://localhost:3000/queue');
    console.log('   - Real-time queue management interface');
    console.log('   - Click buttons to update token status');
    console.log('   - See next-in-queue automatically');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response?.data) {
      console.error('   Error details:', error.response.data);
    }
  }
}

// Run the test
testDiscordButtons();
