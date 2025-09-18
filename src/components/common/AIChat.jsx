import { useState } from "react";
import { productApi } from "../../utils/api/product.api";

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
  const [isLoading, setIsLoading] = useState(false);

  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  // Function to format markdown-like text to JSX
  const formatMessage = (text) => {
    if (!text) return text;

    // Split by lines for processing
    const lines = text.split('\n');
    const formattedElements = [];
    let currentList = [];
    let isInList = false;

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      // Skip empty lines
      if (!trimmedLine && !isInList) {
        formattedElements.push(<br key={`br-${index}`} />);
        return;
      }

      // Handle headers (** text **)
      if (trimmedLine.match(/^\*\*(.*)\*\*$/)) {
        if (isInList) {
          formattedElements.push(
            <ul key={`list-${formattedElements.length}`} className="list-disc list-inside ml-4 space-y-1">
              {currentList}
            </ul>
          );
          currentList = [];
          isInList = false;
        }
        
        const headerText = trimmedLine.replace(/^\*\*(.*)\*\*$/, '$1');
        formattedElements.push(
          <h4 key={`header-${index}`} className="font-bold text-gray-800 mt-3 mb-2">
            {headerText}
          </h4>
        );
        return;
      }

      // Handle list items (* text)
      if (trimmedLine.startsWith('*   ')) {
        const listText = trimmedLine.substring(4);
        
        // Check if this is a bold item (**text:**)
        if (listText.match(/^\*\*(.*?):\*\*/)) {
          const boldText = listText.replace(/^\*\*(.*?):\*\*(.*)/, '$1:');
          const normalText = listText.replace(/^\*\*(.*?):\*\*(.*)/, '$2');
          
          currentList.push(
            <li key={`list-item-${index}`} className="mb-2">
              <span className="font-semibold text-green-600">{boldText}</span>
              <span>{normalText}</span>
            </li>
          );
        } else {
          currentList.push(
            <li key={`list-item-${index}`} className="mb-1">
              {formatInlineText(listText)}
            </li>
          );
        }
        isInList = true;
        return;
      }

      // If we were in a list and now we're not, close the list
      if (isInList && !trimmedLine.startsWith('*   ')) {
        formattedElements.push(
          <ul key={`list-${formattedElements.length}`} className="list-disc list-inside ml-4 space-y-1 mb-3">
            {currentList}
          </ul>
        );
        currentList = [];
        isInList = false;
      }

      // Handle regular paragraphs
      if (trimmedLine) {
        formattedElements.push(
          <p key={`p-${index}`} className="mb-2 leading-relaxed">
            {formatInlineText(trimmedLine)}
          </p>
        );
      }
    });

    // Close any remaining list
    if (isInList && currentList.length > 0) {
      formattedElements.push(
        <ul key={`list-final`} className="list-disc list-inside ml-4 space-y-1">
          {currentList}
        </ul>
      );
    }

    return <div className="space-y-1">{formattedElements}</div>;
  };

  // Function to format inline text (bold, links)
  const formatInlineText = (text) => {
    if (!text) return text;

    // Split by potential markdown patterns
    const parts = [];
    let remainingText = text;
    let key = 0;

    while (remainingText.length > 0) {
      // Check for bold text **text**
      const boldMatch = remainingText.match(/^(.*?)\*\*(.*?)\*\*(.*)/);
      if (boldMatch) {
        if (boldMatch[1]) parts.push(<span key={key++}>{boldMatch[1]}</span>);
        parts.push(<strong key={key++} className="font-semibold text-gray-800">{boldMatch[2]}</strong>);
        remainingText = boldMatch[3];
        continue;
      }

      // Check for links [text](url)
      const linkMatch = remainingText.match(/^(.*?)\[(.*?)\]\((.*?)\)(.*)/);
      if (linkMatch) {
        if (linkMatch[1]) parts.push(<span key={key++}>{linkMatch[1]}</span>);
        parts.push(
          <a 
            key={key++} 
            href={linkMatch[3]} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-green-600 hover:text-green-700 underline font-medium"
          >
            {linkMatch[2]}
          </a>
        );
        remainingText = linkMatch[4];
        continue;
      }

      // Check for raw product URLs and convert to clickable links
      const urlMatch = remainingText.match(/^(.*?)(http:\/\/localhost:3000\/product\/[a-f0-9-]+)(.*)/);
      if (urlMatch) {
        if (urlMatch[1]) parts.push(<span key={key++}>{urlMatch[1]}</span>);
        
        // Extract product ID from URL for better link text
        const productId = urlMatch[2].split('/').pop();
        const linkText = "🔗 Xem sản phẩm";
        
        parts.push(
          <a 
            key={key++} 
            href={urlMatch[2]} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800 px-2 py-1 rounded-md text-xs font-medium transition-colors duration-200"
          >
            {linkText}
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        );
        remainingText = urlMatch[3];
        continue;
      }

      // No more patterns found, add the rest
      if (remainingText) {
        parts.push(<span key={key++}>{remainingText}</span>);
      }
      break;
    }

    return parts.length > 0 ? parts : text;
  };

  const sendMessage = async () => {
    if (inputMessage.trim()) {
      // Add user message to chat
      const userMessage = { id: Date.now(), text: inputMessage, sender: "user" };
      setMessages((prev) => [...prev, userMessage]);
      setInputMessage("");
      setIsLoading(true);

      try {
        // Call the askGemini API without access token
        const response = await productApi.askGemini({ question: inputMessage });
        
        // Extract the actual message content from the API response
        let messageContent = "Xin lỗi, tôi không thể trả lời câu hỏi này lúc này.";
        
        if (response.data && response.success) {
          messageContent = response.data;
        } else if (response.data && response.data.data) {
          messageContent = response.data.data;
        }
        
        // Add AI response to chat
        const aiMessage = {
          id: Date.now() + 1,
          text: messageContent,
          sender: "ai",
          isFormatted: true // Flag to indicate this message should be formatted
        };
        setMessages((prev) => [...prev, aiMessage]);
      } catch (error) {
        console.error('API Error:', error);
        // Handle error case
        const errorMessage = {
          id: Date.now() + 1,
          text: "Xin lỗi, có lỗi xảy ra khi xử lý yêu cầu của bạn. Vui lòng thử lại.",
          sender: "ai",
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
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
        className="fixed bottom-6 right-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-full shadow-xl hover:scale-110 transition-all duration-300 z-50"
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
                {msg.isFormatted ? formatMessage(msg.text) : msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-xs px-4 py-3 rounded-2xl text-sm bg-white text-gray-800 rounded-bl-none border border-gray-200 shadow-sm">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            </div>
          )}
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
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50"
              disabled={!inputMessage.trim() || isLoading}
            >
              {isLoading ? "Đang gửi..." : "Gửi"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}