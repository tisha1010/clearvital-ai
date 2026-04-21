import { useState } from "react";
import { sendChatMessage } from "../lib/api";
import Button from "./Button";
import GlassCard from "./GlassCard";

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Ask about report values, reference ranges, or your recent saved history.",
    },
  ]);
  const [isSending, setIsSending] = useState(false);

  async function handleSend() {
    const message = input.trim();

    if (!message || isSending) {
      return;
    }

    setMessages((current) => [...current, { role: "user", text: message }]);
    setInput("");
    setIsSending(true);

    try {
      const response = await sendChatMessage({ message });
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text:
            response.reply ||
            "I could not generate a reply right now. Please try again.",
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text:
            error.response?.data?.error ||
            "Chat is unavailable right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="chatbot-shell">
      {isOpen ? (
        <GlassCard className="chatbot-panel overflow-hidden p-0">
          <div className="chatbot-header">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Health Chat
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Dynamic answers from your backend AI route
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="icon-button"
              aria-label="Close chatbot"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
                <path
                  d="M6 6 18 18M18 6 6 18"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                />
              </svg>
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`chatbot-bubble ${
                  message.role === "user" ? "user" : "assistant"
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>

          <div className="chatbot-compose">
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask a question about your report..."
              className="input-field"
            />
            <Button type="button" onClick={handleSend} disabled={isSending} className="px-4 py-3">
              {isSending ? "..." : "Send"}
            </Button>
          </div>
        </GlassCard>
      ) : null}

      <Button
        type="button"
        variant="secondary"
        onClick={() => setIsOpen((current) => !current)}
        className="chatbot-toggle px-5 py-3.5"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
          <path
            d="M8 10h8M8 14h5M5 6.5h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H11l-4.5 3v-3H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
        </svg>
        <span>Chat</span>
      </Button>
    </div>
  );
}

export default Chatbot;
