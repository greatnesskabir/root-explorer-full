import { motion } from "framer-motion";
import { type Root } from "@shared/schema";
import { Clock } from "lucide-react";

interface RecentSearchesProps {
  searches: Root[];
  onSelect: (query: string) => void;
}

export function RecentSearches({ searches, onSelect }: RecentSearchesProps) {
  if (!searches || searches.length === 0) {
    return null;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="mt-16 max-w-2xl mx-auto"
    >
      <div className="flex items-center gap-2 mb-6 text-muted-foreground justify-center md:justify-start">
        <Clock className="w-4 h-4" />
        <h3 className="font-inter text-[11px] uppercase tracking-widest">Recent Explorations</h3>
      </div>
      
      <div className="flex flex-wrap gap-3 justify-center md:justify-start">
        {searches.map((search) => (
          <button
            key={search.id}
            onClick={() => onSelect(search.word)}
            className="bg-white border border-border/60 hover:border-black/15 shadow-sm hover:shadow-md px-5 py-3 rounded-xl transition-all duration-300 flex items-center gap-3 group"
          >
            <span className="font-noto text-lg text-primary group-hover:text-black transition-colors" dir="rtl">
              {search.word}
            </span>
            <span className="font-inter text-sm text-muted-foreground">
              {search.shortDefinition}
            </span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
