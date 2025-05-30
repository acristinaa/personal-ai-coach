import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber } = await request.json();

    if (!phoneNumber) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    // Format phone number consistently
    const cleanNumber = phoneNumber.replace(/\s/g, "");
    const formattedPhoneNumber = cleanNumber.startsWith("+") ? cleanNumber : "+49" + cleanNumber;

    // Check if user exists
    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, phone_number, created_at')
      .eq('phone_number', formattedPhoneNumber)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: "Database error occurred" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      exists: !!user,
      user: user || null
    });

  } catch (error) {
    console.error("Error checking user:", error);
    return NextResponse.json(
      { error: "Failed to check user" },
      { status: 500 }
    );
  }
} 