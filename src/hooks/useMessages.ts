import { useState } from "react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

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

  const addMessage = (text: string, sender: "user" | "bot") => {
    const newMessage: Message = {
      id: Date.now(),
      text: text.trim(),
      sender,
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  return {
    messages,
    editingMessageId,
    editText,
    setEditText,
    handleEditMessage,
    handleSaveEdit,
    addMessage,
  };
}
