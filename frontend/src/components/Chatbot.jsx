import { useState } from "react";
import "../styles/chatbot.css";

function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! I’m Allianz Assistant. How can I help you?" },
  ]);
  const [input, setInput] = useState("");

  const getBotResponse = (question) => {
    const q = question.toLowerCase();

    if (q.includes("claim") || q.includes("sinistre")) {
      return "You can submit a claim from your client dashboard using the 'Submit Claim' section.";
    }

    if (q.includes("payment") || q.includes("pay")) {
      return "Approved claims can be paid from the Payments page using Stripe secure checkout.";
    }

    if (q.includes("document") || q.includes("file")) {
      return "You can upload an image or PDF document when submitting a claim.";
    }

    if (q.includes("notification")) {
      return "You receive notifications when a claim is submitted, approved, rejected, or when a payment is completed.";
    }

    if (q.includes("account") || q.includes("register") || q.includes("login")) {
      return "You can create an account from the Register page and log in securely from the Login page.";
    }

    return "I can help with claims, payments, documents, notifications, and account access.";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    const botMessage = { sender: "bot", text: getBotResponse(input) };

    setMessages((prev) => [...prev, userMessage, botMessage]);
    setInput("");
  };

  return (
    <div className="chatbot-container">
      {open && (
        <div className="chatbot-box">
          <div className="chatbot-header">
            <h4>Allianz Assistant</h4>
            <button onClick={() => setOpen(false)}>×</button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-message ${msg.sender === "user" ? "user" : "bot"}`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Ask a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}

      <button className="chatbot-toggle" onClick={() => setOpen(!open)}>
        💬
      </button>
    </div>
  );
}

export default Chatbot;