"use client";

import { useState, useEffect, useRef } from "react";
import {
  X,
  Sparkles,
  Send,
  Maximize2,
  Minimize2,
  Minus,
  Paperclip,
  Mic,
  Moon,
  Sun,
  ExternalLink,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "./ui/card";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { Message } from "./Message";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

export function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setIsDark(true);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
    ) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      if (recognitionRef.current) {
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;

        recognitionRef.current.onstart = () => {
          setIsListening(true);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
          setIsSpeaking(false);
        };

        recognitionRef.current.onaudiostart = () => {
          setIsListening(true);
        };

        recognitionRef.current.onaudioend = () => {
          setIsSpeaking(false);
        };

        recognitionRef.current.onspeechstart = () => {
          setIsSpeaking(true);
        };

        recognitionRef.current.onspeechend = () => {
          setIsSpeaking(false);
        };

        recognitionRef.current.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map((result) => result[0].transcript)
            .join("");
          setInputText(transcript);
        };
      }
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
  };

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const handleEditMessage = (messageId: number) => {
    const message = messages.find((m) => m.id === messageId);
    if (message) {
      setEditingMessageId(messageId);
      setEditText(message.text);
    }
  };

  const handleSaveEdit = (messageId: number) => {
    if (editText.trim()) {
      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          message.id === messageId
            ? { ...message, text: editText.trim() }
            : message
        )
      );
      setEditingMessageId(null);
      setEditText("");
    }
  };

  const handleCopyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const suggestedQuestions = [
    "What is MarginFi?",
    "What makes MarginFi different?",
    "Is my crypto safe on MarginFi?",
  ];

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      console.log(`File selected: ${file.name}`);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputText.trim(),
      sender: "user",
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");

    const botMessageId = Date.now() + 1;
    const botMessage: Message = {
      id: botMessageId,
      text: "",
      sender: "bot",
    };
    setMessages((prev) => [...prev, botMessage]);
    setIsStreaming(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage.text }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split("\n");

        lines.forEach((line) => {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(5));
              setMessages((prevMessages) =>
                prevMessages.map((msg) =>
                  msg.id === botMessageId
                    ? { ...msg, text: data.message.content.parts[0] }
                    : msg
                )
              );
            } catch (e) {
              console.error("Error parsing SSE data:", e);
            }
          }
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === botMessageId
            ? {
                ...msg,
                text: "Sorry, I encountered an error. Please try again later.",
              }
            : msg
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  const toggleVoiceTyping = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const renderMessage = (message: Message) => {
    const isEditing = message.id === editingMessageId;
    const isThinking =
      message.sender === "bot" && message.text === "" && isStreaming;

    return (
      <Message
        key={message.id}
        message={message}
        isEditing={isEditing}
        editText={editText}
        onEditChange={setEditText}
        onSaveEdit={handleSaveEdit}
        onEditMessage={handleEditMessage}
        onCopyMessage={handleCopyMessage}
        isThinking={isThinking}
      />
    );
  };

  const renderInputSection = () => (
    <div className="relative w-full flex items-center">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full absolute left-2 dark:hover:bg-gray-800"
        onClick={handleFileButtonClick}
      >
        <Paperclip className="h-4 w-4" />
      </Button>
      <Input
        placeholder="Ask me anything..."
        className="pl-12 pr-20 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
          }
        }}
        disabled={isStreaming}
      />
      <div className="absolute right-0 top-0 h-full flex items-center">
        <Button
          size="icon"
          variant="ghost"
          className={cn(
            "h-full px-3 dark:hover:bg-gray-800 transition-colors duration-150",
            {
              "text-[#DAFF2F]": isSpeaking,
              "text-muted-foreground": !isSpeaking && isListening,
            }
          )}
          onClick={toggleVoiceTyping}
        >
          <Mic className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-full px-3 dark:hover:bg-gray-800"
          onClick={handleSendMessage}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const clearChatHistory = () => {
    setMessages([]);
    setInputText("");
    setSelectedFile(null);
    setIsMinimized(true);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <style jsx global>{`
        .chatbot-content::-webkit-scrollbar {
          width: 10px;
        }
        .chatbot-content::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .chatbot-content::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 5px;
        }
        .chatbot-content::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
        .dark .chatbot-content::-webkit-scrollbar-track {
          background: #2d2d2d;
        }
        .dark .chatbot-content::-webkit-scrollbar-thumb {
          background: #666;
        }
        .dark .chatbot-content::-webkit-scrollbar-thumb:hover {
          background: #888;
        }
      `}</style>
      {isOpen && !isMinimized ? (
        <Card
          className={`${
            isExpanded ? "fixed inset-4" : "w-[400px]"
          } shadow-lg animate-in slide-in-from-bottom-2 dark:bg-gray-900 dark:border-gray-800 flex flex-col`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#DAFF2F]" />
              <h4 className="font-semibold text-lg dark:text-white">
                AI Assist
              </h4>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={toggleDarkMode}
              >
                {isDark ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsMinimized(true)}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={clearChatHistory}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent
            className={`chatbot-content space-y-4 ${
              isExpanded
                ? "flex-grow overflow-auto"
                : "h-[400px] overflow-y-auto"
            }`}
          >
            {messages.length === 0 ? (
              <>
                <div className="flex justify-center py-8">
                  <div className="w-16 h-16 rounded-full bg-[#DAFF2F] animate-pulse shadow-lg shadow-[#DAFF2F]/50" />
                </div>
                <p className="text-center text-muted-foreground dark:text-gray-400">
                  Tell me about MarginFi
                </p>
                <div className="flex flex-col items-end w-full space-y-2">
                  {suggestedQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="max-w-[300px] justify-start text-left h-auto py-2 px-4 hover:bg-[#DAFF2F]/10 dark:border-gray-700 dark:text-white dark:hover:bg-[#DAFF2F]/5"
                      onClick={() => {
                        setInputText(question);
                        handleSendMessage();
                      }}
                    >
                      {question}
                    </Button>
                  ))}
                  <a
                    href="https://docs.marginfi.com/faqs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground dark:text-gray-400 dark:hover:text-white flex items-center gap-2 text-sm mt-2 cursor-pointer"
                  >
                    Show more
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => renderMessage(message))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </CardContent>
          {isExpanded ? (
            <CardFooter className="mt-auto">
              {renderInputSection()}
              {selectedFile && (
                <div className="text-sm text-muted-foreground dark:text-gray-400 mt-2">
                  File selected: {selectedFile.name}
                </div>
              )}
            </CardFooter>
          ) : (
            <CardFooter className="flex flex-col gap-4">
              {renderInputSection()}
              {selectedFile && (
                <div className="text-sm text-muted-foreground dark:text-gray-400">
                  File selected: {selectedFile.name}
                </div>
              )}
            </CardFooter>
          )}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
        </Card>
      ) : (
        <>
          {(!isOpen || isMinimized) && (
            <Button
              size="icon"
              className="h-12 w-12 rounded-full bg-[#DAFF2F] hover:bg-[#DAFF2F]/90 shadow-lg text-black"
              onClick={() => {
                setIsOpen(true);
                setIsMinimized(false);
              }}
            >
              <Sparkles className="h-6 w-6" />
            </Button>
          )}
        </>
      )}
    </div>
  );
}
