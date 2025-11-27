import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

function Messages({ user }) {
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchConversations();
    
    // Check if there's a job and user in URL params
    const jobId = searchParams.get('job');
    const userId = searchParams.get('user');
    if (jobId && userId) {
      loadConversation(jobId, userId);
    }
  }, [searchParams]);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/messages/conversations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConversations(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const loadConversation = async (jobId, userId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/api/messages/job/${jobId}/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data);
      setSelectedConversation({ jobId, userId });
      
      // Update conversation list to mark as read
      fetchConversations();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load messages');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    setSending(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/messages', {
        jobId: selectedConversation.jobId,
        receiverId: selectedConversation.userId,
        message: newMessage
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setNewMessage('');
      loadConversation(selectedConversation.jobId, selectedConversation.userId);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const selectConversation = (conv) => {
    loadConversation(conv.job._id, conv.otherUser._id);
  };

  return (
    <div className="container">
      <h1>💬 Messages</h1>
      {error && <div className="error">{error}</div>}
      
      <div className="messages-container">
        {/* Conversations List */}
        <div className="conversations-list">
          <h3>Conversations</h3>
          {loading ? (
            <div className="loading"><div className="spinner"></div></div>
          ) : conversations.length === 0 ? (
            <p className="empty-state">No conversations yet</p>
          ) : (
            conversations.map((conv, idx) => (
              <div
                key={idx}
                className={`conversation-item ${selectedConversation?.jobId === conv.job._id && selectedConversation?.userId === conv.otherUser._id ? 'active' : ''}`}
                onClick={() => selectConversation(conv)}
              >
                <div className="conversation-header">
                  <strong>{conv.otherUser.name}</strong>
                  {conv.unreadCount > 0 && (
                    <span className="unread-badge">{conv.unreadCount}</span>
                  )}
                </div>
                <div className="conversation-job">{conv.job.title}</div>
                <div className="conversation-preview">{conv.lastMessage}</div>
              </div>
            ))
          )}
        </div>

        {/* Messages Area */}
        <div className="messages-area">
          {selectedConversation ? (
            <>
              <div className="messages-list">
                {messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`message ${msg.sender._id === user.id ? 'sent' : 'received'}`}
                  >
                    <div className="message-content">
                      <div className="message-sender">{msg.sender.name}</div>
                      <div className="message-text">{msg.message}</div>
                      <div className="message-time">
                        {new Date(msg.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <form onSubmit={handleSendMessage} className="message-input-form">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  disabled={sending}
                />
                <button type="submit" className="btn btn-primary" disabled={sending || !newMessage.trim()}>
                  {sending ? 'Sending...' : 'Send'}
                </button>
              </form>
            </>
          ) : (
            <div className="empty-state-large">
              <div className="empty-icon">💬</div>
              <p>Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Messages;
