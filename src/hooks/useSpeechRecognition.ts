import { useState, useEffect, useRef } from "react";

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
    ) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => {
        setIsListening(false);
        setIsSpeaking(false);
      };
      recognition.onaudiostart = () => setIsListening(true);
      recognition.onaudioend = () => setIsSpeaking(false);
      recognition.onspeechstart = () => setIsSpeaking(true);
      recognition.onspeechend = () => setIsSpeaking(false);
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const text = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");
        setTranscript(text);
      };
    }
  }, []);

  const toggleVoiceTyping = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  return {
    isListening,
    isSpeaking,
    transcript,
    toggleVoiceTyping,
  };
}
