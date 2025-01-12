import React, { useState, useEffect, useRef } from 'react';
import { FaComments, FaTimes, FaPaperPlane, FaSpinner } from 'react-icons/fa';
import WebSocketService from '../../services/WebSocketService';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

const CustomerChatBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatSession, setChatSession] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('chatUserId');
    if (storedUserId) {
      setUserId(parseInt(storedUserId));
    } else {
      const newUserId = Math.floor(Math.random() * 1000000) + 1;
      localStorage.setItem('chatUserId', newUserId.toString());
      setUserId(newUserId);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Khởi tạo chat khi mở form
  useEffect(() => {
    if (isOpen) {
      initializeChat();
    }
    return () => {
      if (chatSession) {
        WebSocketService.unsubscribe(`/topic/chat/${chatSession.id}`);
      }
      WebSocketService.disconnect();
    };
  }, [isOpen]);

  const initializeChat = async () => {
    try {
      if (!userId) {
        toast.error('Không thể xác định người dùng');
        setIsOpen(false);
        return;
      }

      // Gửi request với userId và idNhanVien là số nguyên
      const response = await fetch(`http://localhost:8080/chat/start?idNguoiDung=${userId}&idNhanVien=1`, {
        method: 'POST'
      });
      
      if (!response.ok) throw new Error('Failed to start chat session');
      
      const session = await response.json();
      setChatSession(session);

      // Kết nối WebSocket và subscribe
      WebSocketService.connect(() => {
        WebSocketService.subscribe(`/topic/chat/${session.id}`, (message) => {
          const parsedMessage = JSON.parse(message.body);
          setMessages(prev => [...prev, parsedMessage]);
        });
      });

      // Lấy lịch sử chat
      const historyResponse = await fetch(
        `http://localhost:8080/chat/${session.id}/messages`
      );
      if (historyResponse.ok) {
        const history = await historyResponse.json();
        setMessages(history);
      }
    } catch (error) {
      console.error('Error initializing chat:', error);
      toast.error('Không thể kết nối tới dịch vụ chat');
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !chatSession || isLoading || !userId) return;

    try {
      setIsLoading(true);
      
      const messageData = {
        idPhienChat: chatSession.id,
        idNguoiGui: userId, // Đã là số nguyên
        noiDung: newMessage,
        thoiGianGui: new Date().toISOString()
      };

      WebSocketService.sendMessage('/app/chat/send', JSON.stringify(messageData));
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Không thể gửi tin nhắn');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="relative">
      {/* Nút chat */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all duration-300 relative ${isOpen ? 'opacity-0' : 'opacity-100'}`}
      >
        <FaComments className="text-2xl" />
        <span className="absolute w-full h-full rounded-full animate-ping bg-blue-400 opacity-75"></span>
      </button>

      {/* Form chat */}
      <div className={`${
        isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'
      } transition-all duration-300 absolute bottom-0 right-0 w-[380px] bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden`}>
        {/* Header */}
        <div className="p-4 bg-blue-600 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaComments className="text-white text-xl" />
            <div>
              <h3 className="text-white font-semibold">Chat với nhân viên</h3>
              <p className="text-blue-100 text-sm">Trực tuyến</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Messages area */}
        <div className="flex-1 p-4 h-[450px] overflow-y-auto bg-gray-50">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-4">
              <div className="mb-2">👋 Xin chào!</div>
              <div>Chúng tôi có thể giúp gì cho bạn?</div>
            </div>
          )}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${message.idNguoiGui === userId ? 'text-right' : 'text-left'}`}
            >
              <div className="flex flex-col">
                <div
                  className={`inline-block max-w-[80%] p-3 rounded-lg ${
                    message.idNguoiGui === userId
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-800 shadow-sm'
                  }`}
                >
                  {message.noiDung}
                </div>
                <span className="text-xs text-gray-500 mt-1">
                  {formatTime(message.thoiGianGui)}
                </span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="text-center">
              <div className="inline-block px-4 py-2 bg-white rounded-lg shadow-sm">
                <FaSpinner className="animate-spin inline mr-2" />
                Đang gửi...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="p-4 bg-white border-t">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Nhập tin nhắn của bạn..."
              className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              disabled={!chatSession}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !newMessage.trim() || !chatSession || !userId}
              className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerChatBubble; 