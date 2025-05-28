import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";
import OpenAI from "openai";

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Enhanced AI Coach system prompt
const COACH_SYSTEM_PROMPT = `You are Alex, a personal AI coach speaking German. You help people with:
- Goal setting and achievement (Zielsetzung und Zielerreichung)
- Motivation and accountability (Motivation und Verantwortlichkeit)
- Personal development (Persönliche Entwicklung)
- Habit formation (Gewohnheitsbildung)
- Overcoming challenges (Herausforderungen überwinden)

Guidelines:
- Always respond in German
- Keep responses encouraging and supportive
- Be concise (under 200 characters when possible for WhatsApp)
- Provide actionable advice
- Ask follow-up questions to understand their goals better
- Use emojis sparingly but effectively
- Maintain a professional yet friendly coaching tone
- Remember previous conversations to provide personalized advice

If someone is starting a conversation, welcome them warmly and ask about their goals.`;

// Store conversation history (in production, use a database)
const conversationHistory = new Map<
  string,
  Array<{ role: "user" | "assistant" | "system"; content: string }>
>();

// Store user profiles (in production, use a database)
const userProfiles = new Map<
  string,
  { name?: string; goals?: string[]; joinDate: Date }
>();

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const body = Object.fromEntries(formData);

    const from = body.From as string;
    const messageBody = body.Body as string;
    const profileName = (body.ProfileName as string) || "there";

    console.log(
      `Received message from ${profileName} (${from}): ${messageBody}`
    );

    // Initialize user profile if new
    if (!userProfiles.has(from)) {
      userProfiles.set(from, {
        name: profileName !== "there" ? profileName : undefined,
        goals: [],
        joinDate: new Date(),
      });
    }

    // Get or initialize conversation history
    if (!conversationHistory.has(from)) {
      conversationHistory.set(from, []);
    }

    const history = conversationHistory.get(from)!;
    const userProfile = userProfiles.get(from)!;

    // Add user message to history
    history.push({ role: "user" as const, content: messageBody });

    // Keep only last 15 messages to manage token usage but maintain context
    if (history.length > 15) {
      history.splice(0, history.length - 15);
    }

    // Create context-aware prompt
    const contextPrompt = `User profile: ${
      userProfile.name ? `Name: ${userProfile.name}` : "Name unknown"
    }, Goals: ${
      userProfile.goals?.join(", ") || "Not set yet"
    }, Member since: ${userProfile.joinDate.toLocaleDateString("de-DE")}`;

    // Generate AI response
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Cost-effective model
      messages: [
        { role: "system", content: COACH_SYSTEM_PROMPT },
        { role: "system", content: contextPrompt },
        ...history,
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    const aiResponse =
      completion.choices[0]?.message?.content ||
      "Ich bin hier, um zu helfen! Erzählen Sie mir mehr über Ihre Ziele.";

    // Add AI response to history
    history.push({ role: "assistant" as const, content: aiResponse });

    // Extract and store goals if mentioned (simple keyword detection)
    const goalKeywords = ["ziel", "goal", "möchte", "will", "plane", "vorhabe"];
    if (
      goalKeywords.some((keyword) =>
        messageBody.toLowerCase().includes(keyword)
      )
    ) {
      // This is a simplified goal extraction - in production, use more sophisticated NLP
      if (!userProfile.goals?.includes(messageBody)) {
        userProfile.goals = userProfile.goals || [];
        userProfile.goals.push(messageBody);
      }
    }

    // Send response via Twilio
    await twilioClient.messages.create({
      body: aiResponse,
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: from,
    });

    console.log(`Sent response to ${from}: ${aiResponse}`);

    // Return TwiML response (required by Twilio)
    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?>
       <Response></Response>`,
      {
        status: 200,
        headers: {
          "Content-Type": "text/xml",
        },
      }
    );
  } catch (error) {
    console.error("Webhook error:", error);

    // Send error message to user
    try {
      const formData = await request.formData();
      const body = Object.fromEntries(formData);

      await twilioClient.messages.create({
        body: "Entschuldigung, ich hatte ein technisches Problem. Bitte versuchen Sie es erneut.",
        from: process.env.TWILIO_WHATSAPP_NUMBER,
        to: body.From as string,
      });
    } catch (twilioError) {
      console.error("Failed to send error message:", twilioError);
    }

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Handle GET requests (for webhook verification)
export async function GET() {
  return new NextResponse("WhatsApp AI Coach Webhook is running! 🤖", {
    status: 200,
  });
}
