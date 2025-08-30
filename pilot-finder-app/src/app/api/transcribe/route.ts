import { elevenlabs } from "@ai-sdk/elevenlabs";
import { experimental_transcribe as transcribe } from "ai";
import { type NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio") as File;

    if (!audioFile) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 },
      );
    }

    // Convert File to Buffer for transcription
    const audioBuffer = Buffer.from(await audioFile.arrayBuffer());

    const result = await transcribe({
      model: elevenlabs.transcription("scribe_v1"),
      audio: audioBuffer,
      providerOptions: {
        elevenlabs: {
          languageCode: "en", // Can be made dynamic based on user preference
          tagAudioEvents: false, // Don't include (laughter), (footsteps) etc.
          timestampsGranularity: "none", // We just need the text
          diarize: false, // Single speaker assumed
        },
      },
    });

    return NextResponse.json({
      text: result.text,
      language: result.language,
      duration: result.durationInSeconds,
    });
  } catch (error) {
    console.error("Transcription error:", error);

    // Check if it's a specific AI SDK error
    if (error instanceof Error && error.name === "NoTranscriptGeneratedError") {
      return NextResponse.json(
        { error: "Failed to generate transcript", details: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error during transcription" },
      { status: 500 },
    );
  }
}
