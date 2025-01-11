import React, { useState } from 'react';
import { FaRobot, FaTimes, FaPaperPlane } from 'react-icons/fa';
import { GoogleGenerativeAI } from "@google/generative-ai";

const AIChatBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      setIsLoading(true);
      // Thêm tin nhắn người dùng
      setMessages(prev => [...prev, { text: newMessage, sender: 'user' }]);
      
      // Tạo prompt yêu cầu AI trả lời bằng tiếng Việt
      const prompt = `
        Hãy trả lời câu hỏi sau bằng tiếng Việt một cách thân thiện và chuyên nghiệp:
        ${newMessage}
      `;
      
      // Gọi API AI
      const genAI = new GoogleGenerativeAI("AIzaSyAbOQYZebC94G5yi24cfzVArmHBV9B0Nyg");
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const response = result.response.text();
      
      // Thêm phản hồi của AI
      setMessages(prev => [...prev, { text: response, sender: 'ai' }]);
      setNewMessage('');
    } catch (error) {
      console.error('Lỗi khi tạo phản hồi:', error);
      setMessages(prev => [...prev, { 
        text: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.', 
        sender: 'ai' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Nút chat */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-all duration-300 ${isOpen ? 'scale-0' : 'scale-100'}`}
      >
        <FaRobot className="text-2xl" />
      </button>

      {/* Cửa sổ chat */}
      <div className={`${isOpen ? 'scale-100' : 'scale-0'} origin-bottom-right transition-transform duration-300 absolute bottom-0 right-0 w-96 h-[500px] bg-white rounded-lg shadow-xl flex flex-col`}>
        {/* Phần header */}
        <div className="p-4 bg-indigo-600 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaRobot className="text-white text-xl" />
            <h3 className="text-white font-semibold">Trợ lý AI</h3>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* Phần tin nhắn */}
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-4">
              Xin chào! Tôi có thể giúp gì cho bạn?
            </div>
          )}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
            >
              <div
                className={`inline-block max-w-[80%] p-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="text-center">
              <div className="inline-block px-4 py-2 bg-gray-100 rounded-lg">
                Đang suy nghĩ...
              </div>
            </div>
          )}
        </div>

        {/* Phần nhập tin nhắn */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Nhập tin nhắn của bạn..."
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !newMessage.trim()}
              className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatBubble; 