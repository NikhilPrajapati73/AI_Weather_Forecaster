import React, { useState, useEffect } from 'react';
import { Send, Bot, Sparkles } from 'lucide-react';
import './AIAssistant.css';

const AIAssistant = ({ location, aiResponse }) => {
  const [messages, setMessages] = useState([
    { id: 1, type: 'ai', text: `Hello! I am your AI weather assistant for ${location || 'New York'}. How can I help you today?` }
  ]);
  const [input, setInput] = useState('');

  useEffect(() => {
    // When aiResponse changes, add it as a new AI message
    if (aiResponse) {
      setMessages(prev => [
        ...prev, 
        { id: Date.now(), type: 'ai', text: aiResponse }
      ]);
    }
  }, [aiResponse]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMsg = { id: Date.now(), type: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    try {
      // Import axios at the top if not present, but for now we'll just use fetch to avoid adding imports manually if not needed
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, location: location })
      });
      
      const data = await response.json();
      
      const aiMsg = { 
        id: Date.now() + 1, 
        type: 'ai', 
        text: data.response || "Unable to fetch weather right now." 
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { id: Date.now() + 1, type: 'ai', text: "Unable to fetch weather right now." }]);
    }
  };

  return (
    <div className="ai-assistant glass-panel animate-slide-up" style={{ animationDelay: '0.4s' }}>
      <div className="ai-header">
        <div className="ai-title-wrapper">
          <Bot size={24} className="text-gradient-accent" />
          <h3 className="font-primary text-gradient-accent">Aero Assistant</h3>
        </div>
        <Sparkles size={18} className="text-gradient-accent animate-pulse" />
      </div>

      <div className="chat-container">
        {messages.map(msg => (
          <div key={msg.id} className={`chat-message ${msg.type === 'ai' ? 'ai-msg' : 'user-msg'}`}>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>

      <form className="chat-input-container" onSubmit={handleSend}>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about the weather..." 
          className="chat-input"
        />
        <button type="submit" className="send-btn glass-pill">
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default AIAssistant;
