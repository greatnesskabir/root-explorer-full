import { motion, AnimatePresence } from "framer-motion";
import { type Root } from "@shared/schema";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface RecentSearchesProps {
  searches: Root[];
  onSelect: (query: string) => void;
}

export function RecentSearches({ searches, onSelect }: RecentSearchesProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!searches || searches.length === 0) {
    return null;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="mt-16 max-w-2xl mx-auto w-full px-4"
    >
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full mb-4 text-muted-foreground hover:text-primary transition-colors group"
      >
        <h3 className="font-inter text-[11px] uppercase tracking-widest">Recent Explorations</h3>
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-2 pb-4">
              {searches.slice(0, 10).map((search) => (
                <button
                  key={search.id}
                  onClick={() => onSelect(search.word)}
                  className="bg-white/50 border border-border/40 hover:border-black/10 hover:bg-white shadow-sm px-5 py-3 rounded-xl transition-all duration-300 flex items-center justify-between group w-full"
                >
                  <span className="font-noto text-lg text-primary group-hover:text-black transition-colors" dir="rtl">
                    {search.word}
                  </span>
                  <span className="font-inter text-[13px] text-muted-foreground truncate max-w-[250px]">
                    {search.shortDefinition}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
