import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Search, Phone, Video, MoreVertical, Smile, Paperclip, Users } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'away' | 'offline';
  lastMessage: string;
  lastSeen: string;
  unread: number;
}

interface Message {
  id: string;
  sender: string;
  text: string;
  time: string;
  isMe: boolean;
}

const Chattigs = () => {
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [contacts] = useState<Contact[]>([
    { id: '1', name: 'Agent_X', avatar: '🕵️', status: 'online', lastMessage: 'Status report received', lastSeen: 'now', unread: 2 },
    { id: '2', name: 'HQ_Control', avatar: '🏢', status: 'online', lastMessage: 'Acknowledged', lastSeen: '2m ago', unread: 0 },
    { id: '3', name: 'Field_Ops', avatar: '🎯', status: 'away', lastMessage: 'Moving to position', lastSeen: '15m ago', unread: 0 },
    { id: '4', name: 'Tech_Support', avatar: '💻', status: 'offline', lastMessage: 'Issue resolved', lastSeen: '1h ago', unread: 0 },
    { id: '5', name: 'Shadow_Team', avatar: '👥', status: 'online', lastMessage: 'Ready for extraction', lastSeen: 'now', unread: 5 },
  ]);

  const [messages, setMessages] = useState<Record<string, Message[]>>({
    '1': [
      { id: '1', sender: 'Agent_X', text: 'Target acquired. Awaiting further instructions.', time: '10:30', isMe: false },
      { id: '2', sender: 'You', text: 'Maintain surveillance. Do not engage.', time: '10:32', isMe: true },
      { id: '3', sender: 'Agent_X', text: 'Copy that. Status report received', time: '10:35', isMe: false },
    ],
    '2': [
      { id: '1', sender: 'HQ_Control', text: 'All systems operational.', time: '09:00', isMe: false },
      { id: '2', sender: 'You', text: 'Confirmed. Beginning daily sweep.', time: '09:05', isMe: true },
      { id: '3', sender: 'HQ_Control', text: 'Acknowledged', time: '09:06', isMe: false },
    ],
    '5': [
      { id: '1', sender: 'Shadow_Team', text: 'Team in position.', time: '11:00', isMe: false },
      { id: '2', sender: 'Shadow_Team', text: 'Ready for extraction', time: '11:02', isMe: false },
    ],
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedContact]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedContact) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'You',
      text: messageInput,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      isMe: true,
    };

    setMessages((prev) => ({
      ...prev,
      [selectedContact]: [...(prev[selectedContact] || []), newMessage],
    }));
    setMessageInput('');

    // Simulate response
    setTimeout(() => {
      const contact = contacts.find((c) => c.id === selectedContact);
      if (contact) {
        const responses = [
          'Copy that.',
          'Understood.',
          'Affirmative.',
          'Message received.',
          'Roger.',
          'Standing by.',
        ];
        const response: Message = {
          id: Date.now().toString(),
          sender: contact.name,
          text: responses[Math.floor(Math.random() * responses.length)],
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
          isMe: false,
        };
        setMessages((prev) => ({
          ...prev,
          [selectedContact]: [...(prev[selectedContact] || []), response],
        }));
      }
    }, 1500);
  };

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedContactData = contacts.find((c) => c.id === selectedContact);

  const getStatusColor = (status: Contact['status']) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="h-full flex">
      {/* Contacts Sidebar */}
      <div className="w-72 border-r border-border flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-bold text-foreground">Chattigs</h1>
            <button className="p-2 hover:bg-muted rounded-lg">
              <Users className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search contacts..."
              className="w-full pl-9 pr-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Contact List */}
        <div className="flex-1 overflow-y-auto">
          {filteredContacts.map((contact) => (
            <motion.button
              key={contact.id}
              whileHover={{ backgroundColor: 'hsl(var(--muted))' }}
              onClick={() => setSelectedContact(contact.id)}
              className={`w-full flex items-center gap-3 p-3 text-left transition-colors ${
                selectedContact === contact.id ? 'bg-muted' : ''
              }`}
            >
              <div className="relative">
                <div className="w-10 h-10 bg-card border border-border rounded-full flex items-center justify-center text-xl">
                  {contact.avatar}
                </div>
                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(contact.status)}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground truncate">{contact.name}</span>
                  <span className="text-xs text-muted-foreground">{contact.lastSeen}</span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{contact.lastMessage}</p>
              </div>
              {contact.unread > 0 && (
                <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-xs text-primary-foreground">{contact.unread}</span>
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {selectedContact && selectedContactData ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-3 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-card border border-border rounded-full flex items-center justify-center text-xl">
                  {selectedContactData.avatar}
                </div>
                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(selectedContactData.status)}`} />
              </div>
              <div>
                <h3 className="font-medium text-foreground">{selectedContactData.name}</h3>
                <p className="text-xs text-muted-foreground capitalize">{selectedContactData.status}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-2 hover:bg-muted rounded-lg">
                <Phone className="w-4 h-4 text-muted-foreground" />
              </button>
              <button className="p-2 hover:bg-muted rounded-lg">
                <Video className="w-4 h-4 text-muted-foreground" />
              </button>
              <button className="p-2 hover:bg-muted rounded-lg">
                <MoreVertical className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {(messages[selectedContact] || []).map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                    msg.isMe
                      ? 'bg-primary text-primary-foreground rounded-br-sm'
                      : 'bg-muted text-foreground rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                    {msg.time}
                  </p>
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <form onSubmit={sendMessage} className="p-3 border-t border-border flex items-center gap-2">
            <button type="button" className="p-2 hover:bg-muted rounded-lg">
              <Paperclip className="w-5 h-5 text-muted-foreground" />
            </button>
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 bg-input border border-border rounded-full text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            />
            <button type="button" className="p-2 hover:bg-muted rounded-lg">
              <Smile className="w-5 h-5 text-muted-foreground" />
            </button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-primary rounded-full"
            >
              <Send className="w-5 h-5 text-primary-foreground" />
            </motion.button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">💬</div>
            <h2 className="text-xl font-bold text-foreground mb-2">Welcome to Chattigs</h2>
            <p className="text-muted-foreground">Select a contact to start messaging</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chattigs;
