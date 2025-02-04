// frontend/src/pages/ChatPage.jsx
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';
import { FaPaperPlane } from 'react-icons/fa';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sellerOnline, setSellerOnline] = useState(false);
  const { id: sellerId } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const socket = useRef();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.current = io('http://localhost:5000', {
      withCredentials: true,
    });

    socket.current.emit('addUser', currentUser._id);
    socket.current.on('getOnlineUsers', (users) => {
      setSellerOnline(users.includes(sellerId));
    });

    socket.current.on('newMessage', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.current.disconnect();
    };
  }, [currentUser._id, sellerId]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`/api/messages/${sellerId}`);
        setMessages(res.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    fetchMessages();
  }, [sellerId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const res = await axios.post(`/api/messages/send/${sellerId}`, {
        message: newMessage,
      });
      setMessages([...messages, res.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Chat Header */}
        <div className="bg-amber-900 p-4">
          <h2 className="text-stone-100 text-xl font-semibold">
            Chat with Seller
          </h2>
          <p className="text-stone-300 text-sm mt-1">
            {sellerOnline ? 'Online now' : 'Offline'}
          </p>
        </div>

        {/* Messages Container */}
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message._id}
              className={`flex ${message.senderId === currentUser._id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs p-3 rounded-lg ${
                  message.senderId === currentUser._id
                    ? 'bg-amber-700 text-white'
                    : 'bg-stone-100'
                }`}
              >
                <p>{message.message}</p>
                <p className="text-xs mt-1 opacity-70">
                  {new Date(message.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form
          onSubmit={handleSubmit}
          className="border-t border-stone-200 p-4 flex gap-2"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target)}
            placeholder="Type your message..."
            className="flex-1 p-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            type="submit"
            className="bg-amber-700 text-white p-2 rounded-lg hover:bg-amber-800 transition-colors disabled:opacity-50"
            disabled={!newMessage.trim()}
          >
            <FaPaperPlane className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;