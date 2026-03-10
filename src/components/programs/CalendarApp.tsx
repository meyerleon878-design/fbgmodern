import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarApp = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState<Record<string, string[]>>({});
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [newEvent, setNewEvent] = useState('');

  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const key = (day: number) => `${year}-${month}-${day}`;

  const addEvent = () => {
    if (!newEvent.trim() || selectedDay === null) return;
    const k = key(selectedDay);
    setEvents(prev => ({ ...prev, [k]: [...(prev[k] || []), newEvent.trim()] }));
    setNewEvent('');
  };

  return (
    <div className="h-full flex bg-card">
      {/* Calendar */}
      <div className="flex-1 p-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setDate(new Date(year, month - 1))} className="p-1 hover:bg-muted rounded"><ChevronLeft className="w-5 h-5 text-foreground" /></button>
          <h2 className="text-lg font-semibold text-foreground">{monthNames[month]} {year}</h2>
          <button onClick={() => setDate(new Date(year, month + 1))} className="p-1 hover:bg-muted rounded"><ChevronRight className="w-5 h-5 text-foreground" /></button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
            <div key={d} className="text-center text-xs text-muted-foreground py-1 font-medium">{d}</div>
          ))}
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            const hasEvents = (events[key(day)] || []).length > 0;
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`aspect-square flex flex-col items-center justify-center rounded text-sm relative
                  ${isToday ? 'bg-primary text-primary-foreground font-bold' : ''}
                  ${selectedDay === day && !isToday ? 'bg-primary/20 text-foreground' : ''}
                  ${!isToday && selectedDay !== day ? 'text-foreground hover:bg-muted' : ''}
                `}
              >
                {day}
                {hasEvents && <div className="w-1 h-1 rounded-full bg-primary absolute bottom-1" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Events sidebar */}
      <div className="w-56 border-l border-border p-3">
        <h3 className="text-sm font-medium text-foreground mb-2">
          {selectedDay ? `${monthNames[month]} ${selectedDay}` : 'Select a day'}
        </h3>
        {selectedDay && (
          <>
            <div className="space-y-1 mb-3">
              {(events[key(selectedDay)] || []).map((ev, i) => (
                <div key={i} className="text-xs bg-primary/10 text-foreground p-2 rounded">{ev}</div>
              ))}
              {(events[key(selectedDay)] || []).length === 0 && (
                <p className="text-xs text-muted-foreground">No events</p>
              )}
            </div>
            <div className="flex gap-1">
              <input
                value={newEvent}
                onChange={e => setNewEvent(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addEvent()}
                placeholder="Add event..."
                className="flex-1 px-2 py-1 text-xs bg-input border border-border rounded text-foreground outline-none"
              />
              <button onClick={addEvent} className="px-2 py-1 bg-primary text-primary-foreground rounded text-xs">+</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CalendarApp;
