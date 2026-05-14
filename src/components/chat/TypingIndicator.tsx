export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-1">
      <span
        className="h-2 w-2 rounded-full bg-gray-400 animate-typing-dot"
        style={{ animationDelay: '0ms' }}
      />
      <span
        className="h-2 w-2 rounded-full bg-gray-400 animate-typing-dot"
        style={{ animationDelay: '150ms' }}
      />
      <span
        className="h-2 w-2 rounded-full bg-gray-400 animate-typing-dot"
        style={{ animationDelay: '300ms' }}
      />
    </div>
  );
}
