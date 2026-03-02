import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchRoot, useRecentRoots } from "@/hooks/use-roots";
import { SearchBar } from "@/components/SearchBar";
import { RootCard } from "@/components/RootCard";
import { RecentSearches } from "@/components/RecentSearches";
import { AlertCircle } from "lucide-react";

export default function Home() {
  const [hasSearched, setHasSearched] = useState(false);
  
  const searchMutation = useSearchRoot();
  const { data: recentRoots, isLoading: isLoadingRecent } = useRecentRoots();

  const handleSearch = (query: string) => {
    setHasSearched(true);
    searchMutation.mutate(query);
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Decorative subtle background gradient */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-black/[0.02] to-transparent pointer-events-none" />

      {/* Header - Removed black dot */}
      <header className="py-8 px-6 md:px-12 flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-3">
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-4 md:px-8 pb-24 z-10 relative">
        <motion.div 
          className="w-full"
          animate={{ 
            marginTop: hasSearched ? "4vh" : "15vh" 
          }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="text-center mb-0.5 flex flex-col items-center">
            <h2 className="amiri-regular text-[72px] text-primary mb-0 leading-none">
              جذر
            </h2>
            <p className="font-inter text-[14px] font-bold tracking-[0.2em] text-foreground mb-1 uppercase">
              ARABIC ROOT EXPLORER
            </p>
          </div>

          <SearchBar 
            onSearch={handleSearch} 
            isLoading={searchMutation.isPending} 
          />

          <AnimatePresence mode="wait">
            {searchMutation.error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-8 flex items-center justify-center gap-2 text-destructive font-inter text-[15px] bg-destructive/5 py-3 px-6 rounded-xl w-fit mx-auto"
              >
                <AlertCircle className="w-4 h-4" />
                <span>{searchMutation.error.message}</span>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>

        <AnimatePresence mode="wait">
          {searchMutation.data && !searchMutation.isPending ? (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <RootCard root={searchMutation.data} />
            </motion.div>
          ) : !hasSearched ? (
            <motion.div
              key="recent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: 20 }}
              className="w-full"
            >
              {!isLoadingRecent && recentRoots && (
                <RecentSearches searches={recentRoots} onSelect={handleSearch} />
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>
    </div>
  );
}
