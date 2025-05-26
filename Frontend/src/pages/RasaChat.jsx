import React, { useState } from "react";

const RasaChat = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    // Add user's message to the chat
    const newMessages = [...messages, { sender: "user", text: userInput }];
    setMessages(newMessages);
    setUserInput("");

    try {
      const response = await fetch("http://localhost:5006/webhooks/rest/webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          sender: "user",
          message: userInput
        })
      });

      const data = await response.json();
      const botMessages = data.map((entry) => ({
        sender: "bot",
        text: entry.text
      }));

      setMessages((prev) => [...prev, ...botMessages]);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
  <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg mt-10 border border-gray-200">
    {/* Back Button */}
    <button
      onClick={() => window.history.back()}
      className="mb-4 flex items-center text-cyan-600 hover:text-cyan-800 font-semibold transition"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 mr-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
      </svg>
      Back
    </button>

    {/* Title */}
    <h2 className="text-2xl font-bold text-cyan-600 mb-4 text-center">RidePro Chatbot</h2>

    {/* Chat messages box */}
    <div className="h-72 overflow-y-auto p-4 mb-4 bg-slate-100 rounded-lg shadow-inner border border-gray-300">
      {messages.map((msg, index) => (
        <p key={index} className="mb-2">
          <strong className={msg.sender === "user" ? "text-cyan-700" : "text-slate-700"}>
            {msg.sender === "user" ? "You" : "Bot"}:
          </strong>{" "}
          <span className="text-gray-800">{msg.text}</span>
        </p>
      ))}
    </div>

    {/* Input and send button */}
    <div className="flex items-center">
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Type a message..."
        className="flex-grow px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 mr-2"
      />
      <button
        onClick={sendMessage}
        className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-4 py-2 rounded-lg shadow"
      >
        Send
      </button>
    </div>
  </div>
);

};

export default RasaChat;
