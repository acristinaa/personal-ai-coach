import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Store registered users (use a database in production)
const registeredUsers = new Set<string>();

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, name } = await request.json();

    if (!phoneNumber) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    // Verify Twilio configuration
    if (!process.env.TWILIO_WHATSAPP_NUMBER) {
      console.error("TWILIO_WHATSAPP_NUMBER environment variable is not set");
      return NextResponse.json(
        { error: "WhatsApp configuration error" },
        { status: 500 }
      );
    }

    // Format phone number for WhatsApp
    const cleanNumber = phoneNumber.replace(/\s/g, "");
    const whatsappNumber = `whatsapp:${cleanNumber.startsWith('+') ? cleanNumber : '+49' + cleanNumber}`;

    // Add user to registered users
    registeredUsers.add(whatsappNumber);

    // Add this debug code before the message creation
    console.log('Debug - Twilio Account Info:');
    console.log('Account SID:', process.env.TWILIO_ACCOUNT_SID);
    console.log('WhatsApp Number:', process.env.TWILIO_WHATSAPP_NUMBER);
    
    // Test if we can access the account
    try {
      if (process.env.TWILIO_ACCOUNT_SID) {
        const account = await twilioClient.api.accounts(process.env.TWILIO_ACCOUNT_SID).fetch();
        console.log('Account status:', account.status);
      } else {
        console.log('TWILIO_ACCOUNT_SID not set');
      }
    } catch (err) {
      console.log('Account access error:', err);
    }

    // Send welcome message via WhatsApp
    const welcomeMessage = `🤖 Willkommen bei Personal AI Coach, ${name || 'there'}!

Ich bin Alex, Ihr persönlicher KI-Coach. Ich helfe Ihnen bei:
• Zielsetzung und Zielerreichung
• Motivation und Verantwortlichkeit
• Persönliche Entwicklung
• Gewohnheitsbildung
• Herausforderungen überwinden

Schreiben Sie mir einfach eine Nachricht und lassen Sie uns anfangen! 💪

Was möchten Sie heute erreichen?`;

    console.log(`Attempting to send message from: ${process.env.TWILIO_WHATSAPP_NUMBER} to: ${whatsappNumber}`);

    await twilioClient.messages.create({
      body: welcomeMessage,
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: whatsappNumber,
    });

    console.log(`Sent welcome message to ${whatsappNumber}`);

    return NextResponse.json({ 
      success: true,
      message: "Registration successful! Check WhatsApp for your welcome message."
    });
  } catch (error) {
    console.error("Error registering user:", error);
    
    // More specific error handling for Twilio errors
    if (error && typeof error === 'object' && 'code' in error && error.code === 63007) {
      return NextResponse.json(
        { error: "WhatsApp configuration error. Please contact support." },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
} 