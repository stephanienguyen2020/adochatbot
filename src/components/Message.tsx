import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Copy, Pencil } from "lucide-react";

export interface MessageProps {
  message: {
    id: number;
    text: string;
    sender: "user" | "bot";
  };
  isEditing: boolean;
  editText: string;
  onEditChange: (text: string) => void;
  onSaveEdit: (id: number) => void;
  onEditMessage: (id: number) => void;
  onCopyMessage: (text: string) => void;
}

export function Message({
  message,
  isEditing,
  editText,
  onEditChange,
  onSaveEdit,
  onEditMessage,
  onCopyMessage,
}: MessageProps) {
  const wordCount = message.text.trim().split(/\s+/).length;
  const isShortMessage = wordCount < 7;

  const messageClasses = `max-w-[65%] ${
    isShortMessage ? "min-w-[100%]" : "min-w-[60px]"
  } break-normal whitespace-normal rounded-lg px-4 py-2 mb-8 relative ${
    message.sender === "user"
      ? "bg-[#DAFF2F] text-black ml-auto"
      : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white ml-0"
  }`;

  const containerClasses = `flex ${
    message.sender === "user" ? "justify-end" : "justify-start"
  }`;

  if (isEditing) {
    return (
      <div className={containerClasses}>
        <div className="group relative">
          <div className="flex items-center gap-2">
            <Input
              value={editText}
              onChange={(e) => onEditChange(e.target.value)}
              className="min-w-[200px] dark:bg-gray-800 dark:border-gray-700"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  onSaveEdit(message.id);
                }
              }}
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onSaveEdit(message.id)}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <div className="group relative">
        <div className={messageClasses}>
          {message.text}
          {message.sender === "user" && (
            <div className="absolute bottom-0 right-0 flex -mb-6 opacity-0 transition-opacity group-hover:opacity-100 bg-background/50 dark:bg-background/50 rounded-full">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => onCopyMessage(message.text)}
              >
                <Copy className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => onEditMessage(message.id)}
              >
                <Pencil className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
