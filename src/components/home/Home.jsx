import HeroSection from "./HeroSection";
import ComboOffers from "./ComboOffers";
import ProductGrid from "./ProductGrid";

export default function Home() {
  // const [isChatOpen, setIsChatOpen] = useState(false);
  // const [messages, setMessages] = useState([
  //   {
  //     id: 1,
  //     text: "Chào bạn! Tôi là AI Assistant. Tôi có thể giúp gì cho bạn về các sản phẩm detox?",
  //     sender: "ai",
  //   },
  // ]);
  // const [inputMessage, setInputMessage] = useState("");

  // const toggleChat = () => {
  //   setIsChatOpen((prev) => !prev);
  // };

  // const sendMessage = () => {
  //   if (inputMessage.trim()) {
  //     setMessages((prev) => [
  //       ...prev,
  //       { id: Date.now(), text: inputMessage, sender: "user" },
  //     ]);
  //     setInputMessage("");

  //     // Fake AI reply
  //     setTimeout(() => {
  //       setMessages((prev) => [
  //         ...prev,
  //         {
  //           id: Date.now(),
  //           text:
  //             "Cảm ơn bạn đã hỏi! Tôi sẽ giúp bạn tìm hiểu về sản phẩm detox phù hợp.",
  //           sender: "ai",
  //         },
  //       ]);
  //     }, 1000);
  //   }
  // };

  // const handleKeyPress = (e) => {
  //   if (e.key === "Enter") {
  //     sendMessage();
  //   }
  // };

  return (
    <div className="relative min-h-screen bg-green-50">
     
      {/* Main Content */}
      <div className="container mx-auto py-8 flex flex-col items-center">
        <div className="w-full max-w-6xl">
          <HeroSection />
          <ComboOffers />
          <ProductGrid />
        </div>
      </div>
    </div>
  );
}
