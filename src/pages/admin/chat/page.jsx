import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaSpinner } from 'react-icons/fa';
import WebSocketService from '../../../services/WebSocketService';
import { toast } from 'react-toastify';
import NavbarAdmin from '../Navbar/NavbarAdmin';

const AdminChatPage = () => {
  const [activeChats, setActiveChats] = useState([]); // Danh sách phiên chat đang hoạt động
  const [selectedChat, setSelectedChat] = useState(null); // Phiên chat được chọn
  const [messages, setMessages] = useState([]); // Tin nhắn của phiên chat hiện tại
  const [newMessage, setNewMessage] = useState(''); // Tin nhắn mới
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Cuộn xuống tin nhắn mới nhất
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Lấy danh sách phiên chat đang hoạt động
  useEffect(() => {
    fetchActiveChats();
    const interval = setInterval(fetchActiveChats, 10000); // Cập nhật mỗi 10 giây
    return () => clearInterval(interval);
  }, []);

  // Kết nối WebSocket khi component mount
  useEffect(() => {
    WebSocketService.connect(() => {
      console.log('WebSocket connected');
    });

    return () => {
      WebSocketService.disconnect();
    };
  }, []);

  // Lấy tin nhắn khi chọn phiên chat
  useEffect(() => {
    if (selectedChat) {
      fetchChatMessages(selectedChat.id);
      
      WebSocketService.subscribe(`/topic/chat/${selectedChat.id}`, (message) => {
        try {
          const parsedMessage = JSON.parse(message.body);
          console.log('Received message:', parsedMessage); // Debug log
          setMessages(prev => [...prev, parsedMessage]);
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      });
    }

    return () => {
      if (selectedChat) {
        WebSocketService.unsubscribe(`/topic/chat/${selectedChat.id}`);
      }
    };
  }, [selectedChat]);

  const fetchActiveChats = async () => {
    try {
      const response = await fetch('http://localhost:8080/chat/sessions');
      if (response.ok) {
        const chats = await response.json();
        const activeChats = chats.filter(chat => chat.trangThai === "Active");
        console.log('Active chats:', activeChats);
        setActiveChats(activeChats);
      } else {
        console.error('Failed to fetch active chats:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching active chats:', error);
    }
  };

  const fetchChatMessages = async (chatId) => {
    try {
      const response = await fetch(`http://localhost:8080/chat/${chatId}/messages`);
      if (response.ok) {
        const history = await response.json();
        console.log('Chat history:', history); // Debug log
        
        // Xử lý định dạng thời gian cho tin nhắn
        const formattedHistory = history.map(msg => {
          if (Array.isArray(msg.thoiGianGui)) {
            const [year, month, day, hour, minute, second] = msg.thoiGianGui;
            msg.thoiGianGui = new Date(year, month - 1, day, hour, minute, second).toISOString();
          }
          return msg;
        });
        
        setMessages(formattedHistory);
      } else {
        console.error('Failed to fetch messages:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching chat messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || isLoading) return;

    try {
      setIsLoading(true);
      
      const messageData = {
        idPhienChat: selectedChat.id,
        idNguoiGui: 1, // ID của nhân viên
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
    if (Array.isArray(timestamp)) {
      const [year, month, day, hour, minute, second] = timestamp;
      return new Date(year, month - 1, day, hour, minute, second)
        .toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit'
        });
    }
    return new Date(timestamp).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex">
      <NavbarAdmin />
      <div className="flex flex-1 h-screen bg-gray-100">
        {/* Danh sách phiên chat */}
        <div className="w-1/4 bg-white border-r">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Danh sách chat</h2>
          </div>
          <div className="overflow-y-auto h-[calc(100vh-64px)]">
            {activeChats.length > 0 ? (
              activeChats.map(chat => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                    selectedChat?.id === chat.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="font-medium">Khách hàng #{chat.idKhachHang}</div>
                  <div className="text-sm text-gray-500">
                    {Array.isArray(chat.createdAt) 
                      ? formatTime(chat.createdAt)
                      : new Date(chat.createdAt).toLocaleString()}
                  </div>
                  <div className="text-xs text-green-500">
                    {chat.trangThai}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                Không có cuộc trò chuyện nào đang hoạt động
              </div>
            )}
          </div>
        </div>

        {/* Khu vực chat */}
        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <>
              {/* Header */}
              <div className="p-4 bg-white border-b">
                <h3 className="font-semibold">
                  Chat với Khách hàng #{selectedChat.idKhachHang}
                </h3>
              </div>

              {/* Messages area */}
              <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`mb-4 ${message.idNguoiGui === 1 ? 'text-right' : 'text-left'}`}
                  >
                    <div className="flex flex-col">
                      <div
                        className={`inline-block max-w-[80%] p-3 rounded-lg ${
                          message.idNguoiGui === 1
                            ? 'bg-blue-600 text-white ml-auto'
                            : 'bg-white text-gray-800 shadow-sm mr-auto'
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
                    placeholder="Nhập tin nhắn..."
                    className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isLoading || !newMessage.trim()}
                    className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Chọn một cuộc trò chuyện để bắt đầu
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminChatPage;
