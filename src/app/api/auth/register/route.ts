import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";
import { supabase } from "@/lib/supabase";

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, name } = await request.json();

    if (!phoneNumber) {
      return NextResponse.json(
        { error: "Telefonnummer ist erforderlich" },
        { status: 400 }
      );
    }

    if (!name?.trim()) {
      return NextResponse.json(
        { error: "Name ist erforderlich" },
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
    const formattedPhoneNumber = cleanNumber.startsWith("+") ? cleanNumber : "+49" + cleanNumber;
    const whatsappNumber = `whatsapp:${formattedPhoneNumber}`;

    // Check if user already exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('phone_number', formattedPhoneNumber)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Database error:', fetchError);
      return NextResponse.json(
        { error: "Database error occurred" },
        { status: 500 }
      );
    }

    if (existingUser) {
      return NextResponse.json(
        { error: "Diese Telefonnummer ist bereits registriert" },
        { status: 400 }
      );
    }

    // Insert new user into database
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        phone_number: formattedPhoneNumber,
        name: name.trim(),
        whatsapp_number: whatsappNumber
      })
      .select()
      .single();

    if (insertError) {
      console.error('Failed to insert user:', insertError);
      return NextResponse.json(
        { error: "Failed to register user" },
        { status: 500 }
      );
    }

    // Send welcome message via WhatsApp
    const welcomeMessage = `🤖 Willkommen bei Personal AI Coach, ${name}!

Ich bin Ihr persönlicher AI-Coach. Ich kann Ihnen helfen bei:
• Zielsetzung und Zielerreichung
• Motivation und Verantwortlichkeit
• Persönliche Entwicklung
• Gewohnheitsbildung
• Herausforderungen überwinden

Schreiben Sie mir einfach eine Nachricht und lassen Sie uns anfangen! 💪

Was möchten Sie heute erreichen?`;

    console.log(
      `Attempting to send message from: ${process.env.TWILIO_WHATSAPP_NUMBER} to: ${whatsappNumber}`
    );

    await twilioClient.messages.create({
      body: welcomeMessage,
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: whatsappNumber,
    });

    console.log(`Sent welcome message to ${whatsappNumber} for user ${newUser.id}`);

    return NextResponse.json({
      success: true,
      message: "Registrierung erfolgreich! Überprüfen Sie WhatsApp für Ihre Willkommensnachricht.",
      userId: newUser.id
    });

  } catch (error) {
    console.error("Error registering user:", error);

    // More specific error handling for Twilio errors
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === 63007
    ) {
      return NextResponse.json(
        {
          error: "WhatsApp-Konfigurationsfehler. Bitte kontaktieren Sie den Support.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}
