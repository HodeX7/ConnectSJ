import React, { useState, useEffect, useRef } from "react";

interface Message {
  sender: "user" | "bot";
  text: string;
}

interface ChatbotProps {
  token: string; // API Token
}

const Chatbot: React.FC<ChatbotProps> = ({ token }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isProduction = import.meta.env.VITE_MODE === "production";
  // console.log(isProduction);

  useEffect(() => {
    const saved = localStorage.getItem("chatHistory");
    if (saved) {
      setMessages(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || loading) return;

    const userMessage: Message = { sender: "user", text: inputText.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setLoading(true);

    try {
      const payload = {
        input_value: userMessage.text,
        output_type: "chat",
        input_type: "chat",
      };

      const apiUrl = isProduction
        ? "/api/chat"
        : "/chatapi/lf/c40fcb81-ad16-49ea-a621-5666e1bdafda/api/v1/run/24852f36-f1cc-40cf-8e3f-b879f3cfe0d2?stream=false";

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      // ✅ Correct parsing: dig into data.outputs[0].outputs[0].results.message.data.text
      const botText =
        data?.outputs?.[0]?.outputs?.[0]?.results?.message?.data?.text ||
        "Sorry, I could not understand the response.";

      const botMessage: Message = { sender: "bot", text: botText };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("API error", error);
      const errorMessage: Message = {
        sender: "bot",
        text: "Oops! Something went wrong.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 bg-gray-800 hover:bg-gray-700 text-white rounded-full p-4 shadow-lg"
          aria-label="Open Chat"
        >
          💬
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-20 right-4 w-[90%] max-w-md sm:w-80 md:w-96 bg-white border border-gray-300 rounded-lg shadow-lg flex flex-col h-[500px]">
          {/* Header */}
          <div className="bg-gray-100 text-gray-800 px-4 py-2 flex items-center justify-between rounded-t-lg">
            <span className="font-semibold">Chatbot</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-xl font-bold text-gray-600 hover:text-gray-900"
              aria-label="Close Chat"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`max-w-xs px-3 py-2 rounded-lg break-words whitespace-pre-wrap ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white self-end ml-auto"
                    : "bg-gray-200 text-gray-900 self-start mr-auto"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="max-w-xs px-3 py-2 rounded-lg bg-gray-200 text-gray-600 italic self-start">
                Typing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSend}
            className="flex items-center px-4 py-2 border-t border-gray-300 space-x-2"
          >
            <input
              ref={inputRef}
              type="text"
              className="flex-1 border border-gray-300 rounded px-3 py-1 focus:outline-none focus:border-blue-500"
              placeholder="Type a message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              className={`px-4 py-1 rounded-lg font-semibold text-white ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              disabled={loading}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
