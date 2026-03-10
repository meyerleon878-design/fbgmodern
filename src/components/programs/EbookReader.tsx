import { useState } from 'react';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

const books = [
  { title: 'The Art of Code', author: 'FBG Publishing', pages: ['Chapter 1: The Beginning\n\nIn the early days of computing, programmers wrote code on punch cards. Each card represented a single instruction, and a complex program could require thousands of cards stacked in precise order.\n\nThe beauty of these early systems was their simplicity. Every operation was explicit, every bit accounted for.', 'Chapter 2: The Digital Revolution\n\nAs computers evolved, so did the languages we used to communicate with them. Assembly gave way to FORTRAN, COBOL, and eventually C.\n\nEach new language brought higher levels of abstraction, allowing programmers to think in terms of problems rather than machine instructions.', 'Chapter 3: Modern Era\n\nToday we write code in languages like TypeScript, Python, and Rust. The abstractions are powerful, the tools are sophisticated, and the possibilities are endless.\n\nBut the fundamental joy of programming remains the same: solving problems, creating something from nothing, and watching your ideas come to life.'] },
  { title: 'Digital Philosophy', author: 'Matrix Press', pages: ['What is real?\n\nIn a world increasingly mediated by technology, the line between real and virtual grows thinner every day. We spend hours in digital spaces, forming connections and building identities that exist only as patterns of electrons.\n\nYet these digital experiences feel real to us.', 'The Nature of Consciousness\n\nCan a machine think? Can it feel? These questions, once confined to philosophy departments, now drive billions of dollars in AI research.\n\nThe answer may tell us as much about ourselves as about our creations.'] },
];

const EbookReader = () => {
  const [bookIdx, setBookIdx] = useState(0);
  const [page, setPage] = useState(0);
  const [fontSize, setFontSize] = useState(16);
  const [darkMode, setDarkMode] = useState(false);

  const book = books[bookIdx];
  const totalPages = book.pages.length;

  return (
    <div className={`h-full flex flex-col ${darkMode ? 'bg-[#1a1a1a]' : 'bg-[#f5f0e8]'}`}>
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-2 border-b ${darkMode ? 'border-gray-700' : 'border-[#ddd5c5]'}`}>
        <div className="flex items-center gap-2">
          <BookOpen className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-amber-700'}`} />
          <select
            value={bookIdx}
            onChange={e => { setBookIdx(+e.target.value); setPage(0); }}
            className={`text-sm border-none outline-none ${darkMode ? 'bg-[#1a1a1a] text-gray-300' : 'bg-[#f5f0e8] text-amber-900'}`}
          >
            {books.map((b, i) => <option key={i} value={i}>{b.title}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setFontSize(f => Math.max(12, f - 2))} className={`px-2 text-sm ${darkMode ? 'text-gray-400' : 'text-amber-700'}`}>A-</button>
          <button onClick={() => setFontSize(f => Math.min(24, f + 2))} className={`px-2 text-sm ${darkMode ? 'text-gray-400' : 'text-amber-700'}`}>A+</button>
          <button onClick={() => setDarkMode(!darkMode)} className={`px-2 text-sm ${darkMode ? 'text-gray-400' : 'text-amber-700'}`}>
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-12 py-8">
        <h2 className={`text-xl font-semibold mb-1 ${darkMode ? 'text-gray-200' : 'text-amber-900'}`}>{book.title}</h2>
        <p className={`text-xs mb-6 ${darkMode ? 'text-gray-500' : 'text-amber-700/60'}`}>by {book.author}</p>
        <div
          className={`leading-relaxed whitespace-pre-wrap ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}
          style={{ fontSize, fontFamily: 'Georgia, serif' }}
        >
          {book.pages[page]}
        </div>
      </div>

      {/* Navigation */}
      <div className={`flex items-center justify-between px-4 py-2 border-t ${darkMode ? 'border-gray-700' : 'border-[#ddd5c5]'}`}>
        <button
          onClick={() => setPage(p => Math.max(0, p - 1))}
          disabled={page === 0}
          className={`flex items-center gap-1 text-sm ${page === 0 ? 'opacity-30' : ''} ${darkMode ? 'text-gray-400' : 'text-amber-700'}`}
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>
        <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-amber-700/60'}`}>
          Page {page + 1} of {totalPages}
        </span>
        <button
          onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
          disabled={page === totalPages - 1}
          className={`flex items-center gap-1 text-sm ${page === totalPages - 1 ? 'opacity-30' : ''} ${darkMode ? 'text-gray-400' : 'text-amber-700'}`}
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default EbookReader;
