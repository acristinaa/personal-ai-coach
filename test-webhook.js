// Simple test script to simulate Twilio webhook calls
// Run with: node test-webhook.js

import fetch from 'node:fetch';

async function testWebhook() {
  const webhookUrl = 'http://localhost:3000/api/webhook/whatsapp';
  
  // Simulate Twilio webhook data
  const formData = new URLSearchParams({
    'From': 'whatsapp:+1234567890',
    'Body': 'Hello! I want to start working out regularly.',
    'ProfileName': 'Test User'
  });

  try {
    console.log('Testing webhook...');
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData
    });

    console.log('Status:', response.status);
    console.log('Response:', await response.text());
    
    if (response.ok) {
      console.log('✅ Webhook test successful!');
    } else {
      console.log('❌ Webhook test failed');
    }
  } catch (error) {
    console.error('❌ Error testing webhook:', error.message);
    console.log('\nMake sure:');
    console.log('1. Your dev server is running (npm run dev)');
    console.log('2. Your .env.local file has valid credentials');
    console.log('3. You have OpenAI credits available');
  }
}

testWebhook(); 