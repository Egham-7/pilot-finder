"use client";

import { Mic, MicOff } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface AIVoiceInputProps {
  onStart?: () => void;
  onStop?: (duration: number) => void;
  onTranscription?: (text: string) => void;
  onError?: (error: string) => void;
  visualizerBars?: number;
  demoMode?: boolean;
  demoInterval?: number;
  className?: string;
}

export function AIVoiceInput({
  onStart,
  onStop,
  onTranscription,
  onError,
  visualizerBars = 48,
  demoMode = false,
  demoInterval = 3000,
  className,
}: AIVoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [time, setTime] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [isDemo, setIsDemo] = useState(demoMode);
  const [permissionStatus, setPermissionStatus] = useState<
    "unknown" | "granted" | "denied"
  >("unknown");
  const [isProcessing, setIsProcessing] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsClient(true);
    // Check microphone permission status
    if (navigator.permissions) {
      navigator.permissions
        .query({ name: "microphone" as PermissionName })
        .then((result) => {
          setPermissionStatus(result.state as "granted" | "denied");
          result.onchange = () => {
            setPermissionStatus(result.state as "granted" | "denied");
          };
        });
    }
  }, []);

  useEffect(() => {
    if (!isDemo) return;

    let timeoutId: NodeJS.Timeout;
    const runAnimation = () => {
      setIsRecording(true);
      timeoutId = setTimeout(() => {
        setIsRecording(false);
        timeoutId = setTimeout(runAnimation, 1000);
      }, demoInterval);
    };

    const initialTimeout = setTimeout(runAnimation, 100);
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(initialTimeout);
    };
  }, [isDemo, demoInterval]);

  const transcribeAudio = useCallback(
    async (audioBlob: Blob) => {
      try {
        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.webm");

        const response = await fetch("/api/transcribe", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Transcription failed: ${response.statusText}`);
        }

        const result = await response.json();

        if (result.text) {
          onTranscription?.(result.text);
        } else {
          onError?.("No transcription received");
        }
      } catch (error) {
        console.error("Transcription error:", error);
        onError?.("Failed to transcribe audio");
      } finally {
        setIsProcessing(false);
        setTime(0);
      }
    },
    [onTranscription, onError],
  );

  const startRecording = useCallback(async () => {
    try {
      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      streamRef.current = stream;
      setPermissionStatus("granted");

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm;codecs=opus",
        });
        await transcribeAudio(audioBlob);

        // Clean up stream
        if (streamRef.current) {
          for (const track of streamRef.current.getTracks()) {
            track.stop();
          }
          streamRef.current = null;
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setTime(0);
      onStart?.();

      // Start timer
      timerRef.current = setInterval(() => {
        setTime((t) => t + 1);
      }, 1000);
    } catch (error) {
      console.error("Error starting recording:", error);
      setPermissionStatus("denied");
      onError?.("Failed to access microphone. Please check permissions.");
    }
  }, [onStart, onError, transcribeAudio]);

  const stopRecording = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setIsRecording(false);
    onStop?.(time);
    setIsProcessing(true);
  }, [time, onStop]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleClick = () => {
    if (isDemo) {
      setIsDemo(false);
      setIsRecording(false);
      return;
    }

    if (isProcessing) {
      return; // Don't allow clicks while processing
    }

    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const getStatusText = () => {
    if (isProcessing) return "Processing...";
    if (isRecording) return "Listening...";
    if (permissionStatus === "denied") return "Microphone access denied";
    return "Click to speak";
  };

  const isActive = isRecording || isProcessing;

  return (
    <div className={cn("w-full py-4", className)}>
      <div className="relative max-w-xl w-full mx-auto flex items-center flex-col gap-2">
        <button
          className={cn(
            "group w-16 h-16 rounded-xl flex items-center justify-center transition-colors",
            isActive
              ? "bg-none"
              : "bg-none hover:bg-black/10 dark:hover:bg-white/10",
            permissionStatus === "denied" && "opacity-50 cursor-not-allowed",
          )}
          type="button"
          onClick={handleClick}
          disabled={permissionStatus === "denied" || isProcessing}
        >
          {isProcessing ? (
            <div
              className="w-6 h-6 rounded-sm animate-spin bg-black dark:bg-white cursor-pointer pointer-events-auto"
              style={{ animationDuration: "1s" }}
            />
          ) : isRecording ? (
            <MicOff className="w-6 h-6 text-red-500 animate-pulse" />
          ) : (
            <Mic
              className={cn(
                "w-6 h-6",
                permissionStatus === "denied"
                  ? "text-red-500"
                  : "text-black/70 dark:text-white/70",
              )}
            />
          )}
        </button>

        <span
          className={cn(
            "font-mono text-sm transition-opacity duration-300",
            isActive
              ? "text-black/70 dark:text-white/70"
              : "text-black/30 dark:text-white/30",
          )}
        >
          {formatTime(time)}
        </span>

        <div className="h-4 w-64 flex items-center justify-center gap-0.5">
          {Array.from({ length: visualizerBars }, (_, i) => (
            <div
              key={`bar-${i}-${visualizerBars}`}
              className={cn(
                "w-0.5 rounded-full transition-all duration-300",
                isActive
                  ? "bg-black/50 dark:bg-white/50 animate-pulse"
                  : "bg-black/10 dark:bg-white/10 h-1",
              )}
              style={
                isActive && isClient
                  ? {
                      height: `${20 + Math.random() * 80}%`,
                      animationDelay: `${i * 0.05}s`,
                    }
                  : undefined
              }
            />
          ))}
        </div>

        <p className="h-4 text-xs text-black/70 dark:text-white/70 text-center">
          {getStatusText()}
        </p>
      </div>
    </div>
  );
}
