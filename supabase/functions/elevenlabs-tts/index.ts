import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Security: Input validation constants
const MAX_TEXT_LENGTH = 5000;
const ALLOWED_LANGUAGES = ["cherokee", "maori", "navajo", "welsh", "basque", "hawaiian", "ainu", "tibetan", "odia", "buryat", "khmer", "dzongkha"];
const ALLOWED_VOICES = ["elder-male", "elder-female", "young-male", "young-female"];

// Voice mappings for different voice types
const voiceMap: Record<string, string> = {
  "elder-male": "JBFqnCBsd6RMkjVDRZzb", // George - mature male
  "elder-female": "XrExE9yKIg1WjnnlVkGX", // Matilda - warm female
  "young-male": "TX3LPaxmHKxFdv7VOQHJ", // Liam - young male
  "young-female": "EXAVITQu4vr4xnSDxMaL", // Sarah - young female
};

// Language names for translation
const languageNames: Record<string, string> = {
  "cherokee": "Cherokee",
  "maori": "Māori",
  "navajo": "Navajo",
  "welsh": "Welsh",
  "basque": "Basque",
  "hawaiian": "Hawaiian",
  "ainu": "Ainu",
  "tibetan": "Tibetan",
  "odia": "Odia",
  "buryat": "Buryat",
  "khmer": "Khmer",
  "dzongkha": "Dzongkha",
};

async function translateText(text: string, targetLanguage: string, apiKey: string): Promise<string> {
  const languageName = languageNames[targetLanguage] || targetLanguage;
  
  console.log(`Translating text to ${languageName}...`);
  
  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        {
          role: "system",
          content: `You are a translator specializing in endangered and indigenous languages. Translate the given text into ${languageName}. 
          
Important rules:
- Only output the translated text, nothing else
- If you cannot translate a word, transliterate it phonetically for that language
- Maintain the meaning and tone of the original text
- For greetings and common phrases, use authentic ${languageName} expressions
- Do not include any explanations, notes, or the original text`
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Translation API error:", response.status, errorText);
    throw new Error(`Translation failed: ${response.status}`);
  }

  const data = await response.json();
  const translatedText = data.choices?.[0]?.message?.content?.trim();
  
  if (!translatedText) {
    throw new Error("No translation received");
  }
  
  console.log(`Translation complete: "${translatedText}"`);
  return translatedText;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Security: Authentication check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      console.error("Missing or invalid Authorization header");
      return new Response(
        JSON.stringify({ error: "Unauthorized: Missing authentication" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      console.error("JWT validation failed:", claimsError);
      return new Response(
        JSON.stringify({ error: "Unauthorized: Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = claimsData.claims.sub;
    console.log(`Authenticated user: ${userId}`);

    const { text, voiceType, speed, language } = await req.json();
    const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!ELEVENLABS_API_KEY) {
      throw new Error("ELEVENLABS_API_KEY is not configured");
    }

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Security: Input validation
    if (!text || typeof text !== "string") {
      return new Response(
        JSON.stringify({ error: "Text is required and must be a string" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (text.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Text cannot be empty" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (text.length > MAX_TEXT_LENGTH) {
      return new Response(
        JSON.stringify({ error: `Text too long. Maximum ${MAX_TEXT_LENGTH} characters allowed.` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!language || typeof language !== "string") {
      return new Response(
        JSON.stringify({ error: "Language is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!ALLOWED_LANGUAGES.includes(language.toLowerCase())) {
      return new Response(
        JSON.stringify({ error: `Invalid language. Allowed: ${ALLOWED_LANGUAGES.join(", ")}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (voiceType && !ALLOWED_VOICES.includes(voiceType)) {
      return new Response(
        JSON.stringify({ error: `Invalid voice type. Allowed: ${ALLOWED_VOICES.join(", ")}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate speed if provided
    const validatedSpeed = speed ? Math.min(Math.max(parseFloat(speed) || 1.0, 0.7), 1.2) : 1.0;

    // Step 1: Translate the text to the target language
    console.log(`Processing TTS request: text="${text.substring(0, 50)}...", language="${language}", voice="${voiceType}", user="${userId}"`);
    const translatedText = await translateText(text, language.toLowerCase(), LOVABLE_API_KEY);

    // Step 2: Generate speech from the translated text
    const voiceId = voiceMap[voiceType] || "JBFqnCBsd6RMkjVDRZzb";
    
    console.log(`Generating speech with ElevenLabs voice ${voiceId}...`);
    
    const ttsResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: translatedText,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.3,
            use_speaker_boost: true,
            speed: validatedSpeed,
          },
        }),
      }
    );

    if (!ttsResponse.ok) {
      const errorText = await ttsResponse.text();
      console.error("ElevenLabs API error:", ttsResponse.status, errorText);
      throw new Error(`ElevenLabs API error: ${ttsResponse.status}`);
    }

    const audioBuffer = await ttsResponse.arrayBuffer();
    console.log(`Audio generated successfully, size: ${audioBuffer.byteLength} bytes`);

    return new Response(audioBuffer, {
      headers: {
        ...corsHeaders,
        "Content-Type": "audio/mpeg",
        "X-Translated-Text": encodeURIComponent(translatedText),
      },
    });
  } catch (error) {
    console.error("TTS error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});