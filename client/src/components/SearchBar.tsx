import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      onSearch(trimmed);
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative w-full max-w-2xl mx-auto group"
    >
      <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
        {isLoading ? (
          <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
        ) : (
          <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-300" />
        )}
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search an Arabic word or root..."
        disabled={isLoading}
        dir="auto"
        className="w-full bg-white pl-16 pr-6 py-5 rounded-[2rem] border border-border shadow-[0_8px_30px_rgb(0,0,0,0.04)] font-noto text-base md:text-lg text-foreground placeholder:text-muted-foreground placeholder:font-inter placeholder:text-[15px] outline-none transition-all duration-300 focus:shadow-[0_8px_30px_rgb(0,0,0,0.08)] focus:border-black/10 disabled:opacity-70"
      />
    </motion.form>
  );
}
