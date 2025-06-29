interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Dialog({ isOpen, onClose, title, children }: DialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="fixed inset-0 backdrop-blur-sm bg-[var(--primary)]/20 animate-in fade-in duration-200" onClick={onClose}></div>

      {/* Dialog */}
      <div className="relative bg-[var(--background-secondary)]/95 backdrop-blur-md rounded-2xl shadow-2xl border border-[var(--primary)]/20 w-full max-w-lg mx-4 p-8 animate-in zoom-in-95 duration-300 ease-out">
        {/* Header with gradient accent */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-[var(--primary)]/10">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">{title}</h2>
            <div className="w-12 h-1 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-full mt-2"></div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-[var(--background)] hover:bg-[var(--background)]/70 flex items-center justify-center transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--secondary)]"
          >
            <svg className="w-5 h-5 text-[var(--secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="relative">{children}</div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[var(--background)] to-[var(--background-secondary)] rounded-full opacity-30 -translate-y-16 translate-x-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[var(--background)] to-[var(--background-secondary)] rounded-full opacity-20 translate-y-12 -translate-x-12 pointer-events-none"></div>
      </div>
    </div>
  );
}
