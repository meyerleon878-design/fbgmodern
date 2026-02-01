import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, User, MapPin, Activity, Calendar, AlertTriangle } from 'lucide-react';
import { Subject } from '@/types/os';

// Generate fake subjects
const generateSubjects = (): Subject[] => {
  const names = ['John Smith', 'Maria Garcia', 'Alex Chen', 'Sarah Johnson', 'Michael Brown', 'Emma Wilson', 'David Lee', 'Lisa Anderson'];
  const locations = ['New York, USA', 'Los Angeles, USA', 'London, UK', 'Tokyo, Japan', 'Berlin, Germany', 'Sydney, Australia', 'Paris, France', 'Toronto, Canada'];
  const statuses = ['ACTIVE', 'MONITORING', 'SURVEILLANCE', 'FLAGGED', 'UNDER INVESTIGATION'];
  
  return Array.from({ length: 8 }, (_, i) => ({
    id: `SUBJECT_${1000 + Math.floor(Math.random() * 9000)}`,
    name: names[i],
    age: 25 + Math.floor(Math.random() * 30),
    location: locations[i],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    notes: `Subject has been under observation since ${2020 + Math.floor(Math.random() * 4)}. ${Math.random() > 0.5 ? 'High priority target.' : 'Standard monitoring protocol.'} Last known activity: ${['Online communications', 'Physical movement', 'Financial transactions', 'Social interactions'][Math.floor(Math.random() * 4)]}.`,
  }));
};

const subjects = generateSubjects();

const Subjects = () => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSubjects = subjects.filter(s => 
    s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex">
      {/* Subject List */}
      <div className="w-72 border-r border-border flex flex-col">
        <div className="p-3 border-b border-border">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search subjects..."
            className="w-full px-3 py-2 bg-input border border-border rounded text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
          />
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {filteredSubjects.map(subject => (
            <motion.button
              key={subject.id}
              whileHover={{ backgroundColor: 'hsl(var(--muted))' }}
              onClick={() => setSelectedSubject(subject)}
              className={`w-full p-3 text-left border-b border-border ${
                selectedSubject?.id === subject.id ? 'bg-primary/10 border-l-2 border-l-primary' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                <span className="text-sm text-foreground font-mono">{subject.id}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1 truncate">{subject.name}</div>
              <div className={`text-xs mt-1 ${
                subject.status === 'FLAGGED' || subject.status === 'UNDER INVESTIGATION' 
                  ? 'text-destructive' 
                  : 'text-muted-foreground'
              }`}>
                {subject.status}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Subject Details */}
      <div className="flex-1 p-6 overflow-y-auto">
        {selectedSubject ? (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground text-glow font-mono">
                  {selectedSubject.id}
                </h2>
                <p className="text-muted-foreground">{selectedSubject.name}</p>
              </div>
              <div className={`px-3 py-1 rounded text-xs font-semibold ${
                selectedSubject.status === 'FLAGGED' || selectedSubject.status === 'UNDER INVESTIGATION'
                  ? 'bg-destructive/20 text-destructive'
                  : selectedSubject.status === 'ACTIVE'
                  ? 'bg-primary/20 text-primary'
                  : 'bg-muted text-muted-foreground'
              }`}>
                {selectedSubject.status}
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass p-4 rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <User className="w-4 h-4" />
                  <span className="text-xs">AGE</span>
                </div>
                <p className="text-xl font-bold text-foreground">{selectedSubject.age}</p>
              </div>
              
              <div className="glass p-4 rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-xs">LOCATION</span>
                </div>
                <p className="text-sm font-semibold text-foreground">{selectedSubject.location}</p>
              </div>
              
              <div className="glass p-4 rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Activity className="w-4 h-4" />
                  <span className="text-xs">STATUS</span>
                </div>
                <p className="text-sm font-semibold text-foreground">{selectedSubject.status}</p>
              </div>
              
              <div className="glass p-4 rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs">LAST UPDATE</span>
                </div>
                <p className="text-sm font-semibold text-foreground">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Notes */}
            <div className="glass p-4 rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground mb-3">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-xs font-semibold">INTELLIGENCE NOTES</span>
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                {selectedSubject.notes}
              </p>
            </div>

            {/* Classification */}
            <div className="border border-destructive/50 bg-destructive/10 p-4 rounded-lg">
              <p className="text-xs text-destructive font-mono text-center">
                ⚠ CLASSIFIED INFORMATION - AUTHORIZED ACCESS ONLY ⚠
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Select a subject to view details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Subjects;
