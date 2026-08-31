import React, { useState } from 'react';
import { Filter, Clock } from 'lucide-react';
import TimelineEvent from './TimelineEvent';

const categories = ['All Events', 'Messages', 'Transactions', 'Emails', 'Calls', 'Important Events'];

const Timeline = ({ events = [] }) => {
  const [activeCategory, setActiveCategory] = useState('All Events');

  const filteredEvents = activeCategory === 'All Events'
    ? events
    : events.filter(e => e.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="space-y-6">
      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <Filter className="w-4 h-4 text-cyan-400 flex-shrink-0 mr-1" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-xl font-mono text-xs whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-semibold shadow-cyan-glow'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Events List */}
      {filteredEvents.length > 0 ? (
        <div className="pt-2">
          {filteredEvents.map((event, idx) => (
            <TimelineEvent
              key={event.id || idx}
              event={event}
              isLast={idx === filteredEvents.length - 1}
            />
          ))}
        </div>
      ) : (
        <div className="p-8 text-center glass-panel rounded-xl border border-slate-800 font-mono text-xs text-slate-400">
          No timeline events match the filter &quot;{activeCategory}&quot;.
        </div>
      )}
    </div>
  );
};

export default Timeline;
