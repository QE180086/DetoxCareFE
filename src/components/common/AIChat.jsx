import { useState } from "react";

export default function AIChat() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Chào bạn! Tôi là AI Assistant. Tôi có thể giúp gì cho bạn về các sản phẩm detox?",
      sender: "ai",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  const sendMessage = () => {
    if (inputMessage.trim()) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), text: inputMessage, sender: "user" },
      ]);
      setInputMessage("");

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            text:
              "Cảm ơn bạn đã hỏi! Tôi sẽ giúp bạn tìm hiểu về sản phẩm detox phù hợp.",
            sender: "ai",
          },
        ]);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-full shadow-xl hover:scale-110 transition-all duration-300 z-50 "
      >
        {isChatOpen ? (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="w-6 h-6 animate-wave"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        )}
      </button>

      {/* Chat Box */}
      <div
        className={`fixed bottom-24 right-6 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 transition-all duration-300 ease-in-out z-50 flex flex-col ${
          isChatOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-6 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-lg">AI Assistant</h3>
              <p className="text-green-100 text-sm">Đang hoạt động</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="h-80 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs px-4 py-3 rounded-2xl text-sm ${
                  msg.sender === "user"
                    ? "bg-green-500 text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none border border-gray-200 shadow-sm"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-3 bg-white border-t border-gray-200 rounded-b-2xl">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập tin nhắn..."
              className="flex-1 p-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            />
            <button
              onClick={sendMessage}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50"
              disabled={!inputMessage.trim()}
            >
              Gửi
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
