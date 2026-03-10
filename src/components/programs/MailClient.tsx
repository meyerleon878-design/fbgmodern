import { useState } from 'react';
import { Mail, Send, Star, Trash2, Inbox } from 'lucide-react';

const emails = [
  { id: 1, from: 'system@fbg-os.com', subject: 'Welcome to FBG_OS!', body: 'Welcome to your new operating system. Explore the Store to download apps!', time: '10:30 AM', starred: false, read: false },
  { id: 2, from: 'security@fbg-os.com', subject: 'Security Update Available', body: 'A new security patch is available. Please restart your system to apply.', time: '9:15 AM', starred: true, read: true },
  { id: 3, from: 'store@fbg-os.com', subject: 'New Apps Available!', body: 'Check out the latest apps in the FBG Store. Calculator Pro, Music Player, and more!', time: 'Yesterday', starred: false, read: true },
  { id: 4, from: 'admin@fbg-corp.com', subject: 'Meeting Tomorrow', body: 'Reminder: Team meeting at 2 PM tomorrow. Please prepare your reports.', time: 'Yesterday', starred: false, read: false },
  { id: 5, from: 'noreply@updates.com', subject: 'Your weekly digest', body: 'Here is your weekly summary of system activity and notifications.', time: 'Mon', starred: false, read: true },
];

const MailClient = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const [folder, setFolder] = useState('inbox');
  const [composing, setComposing] = useState(false);

  const mail = emails.find(e => e.id === selected);

  return (
    <div className="h-full flex bg-card">
      {/* Sidebar */}
      <div className="w-44 border-r border-border p-2 space-y-1">
        <button onClick={() => setComposing(true)} className="w-full px-3 py-2 bg-primary text-primary-foreground rounded text-sm flex items-center gap-2">
          <Send className="w-4 h-4" /> Compose
        </button>
        <button onClick={() => setFolder('inbox')} className={`w-full px-3 py-2 rounded text-sm text-left flex items-center gap-2 ${folder === 'inbox' ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'}`}>
          <Inbox className="w-4 h-4" /> Inbox <span className="ml-auto text-xs bg-primary text-primary-foreground px-1.5 rounded">{emails.filter(e => !e.read).length}</span>
        </button>
        <button onClick={() => setFolder('starred')} className={`w-full px-3 py-2 rounded text-sm text-left flex items-center gap-2 ${folder === 'starred' ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'}`}>
          <Star className="w-4 h-4" /> Starred
        </button>
        <button onClick={() => setFolder('trash')} className={`w-full px-3 py-2 rounded text-sm text-left flex items-center gap-2 ${folder === 'trash' ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'}`}>
          <Trash2 className="w-4 h-4" /> Trash
        </button>
      </div>

      {/* Email list */}
      <div className="w-64 border-r border-border overflow-auto">
        {emails.map(e => (
          <button
            key={e.id}
            onClick={() => { setSelected(e.id); setComposing(false); }}
            className={`w-full text-left p-3 border-b border-border ${
              selected === e.id ? 'bg-primary/10' : 'hover:bg-muted'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-xs ${e.read ? 'text-muted-foreground' : 'text-foreground font-semibold'}`}>{e.from.split('@')[0]}</span>
              <span className="text-xs text-muted-foreground">{e.time}</span>
            </div>
            <div className={`text-sm truncate ${e.read ? 'text-foreground' : 'text-foreground font-medium'}`}>{e.subject}</div>
            <div className="text-xs text-muted-foreground truncate">{e.body}</div>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-auto">
        {composing ? (
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-foreground">New Message</h3>
            <input placeholder="To:" className="w-full px-3 py-2 bg-input border border-border rounded text-foreground outline-none text-sm" />
            <input placeholder="Subject:" className="w-full px-3 py-2 bg-input border border-border rounded text-foreground outline-none text-sm" />
            <textarea placeholder="Write your message..." className="w-full px-3 py-2 bg-input border border-border rounded text-foreground outline-none text-sm h-48 resize-none" />
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded text-sm flex items-center gap-2">
              <Send className="w-4 h-4" /> Send
            </button>
          </div>
        ) : mail ? (
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-1">{mail.subject}</h2>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center"><Mail className="w-4 h-4 text-primary" /></div>
              <div>
                <div className="text-sm text-foreground">{mail.from}</div>
                <div className="text-xs text-muted-foreground">{mail.time}</div>
              </div>
            </div>
            <p className="text-sm text-foreground leading-relaxed">{mail.body}</p>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">Select an email to read</div>
        )}
      </div>
    </div>
  );
};

export default MailClient;
