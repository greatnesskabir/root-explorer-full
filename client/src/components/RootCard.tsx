import { motion } from "framer-motion";
import { type Root } from "@shared/schema";

interface RootCardProps {
  root: Root;
}

const Label = ({ children }: { children: React.ReactNode }) => (
  <h3 className="font-inter text-[11px] uppercase tracking-widest text-muted-foreground mb-2 mt-8 select-none">
    {children}
  </h3>
);

const BodyText = ({ children }: { children: React.ReactNode }) => (
  <p className="font-inter text-[15px] leading-relaxed text-foreground/90">
    {children}
  </p>
);

const DerivedFormItem = ({ text }: { text: string }) => {
  // Split text to fade out the parts in parentheses, e.g., "كَاتِب (noun)" -> fades "(noun)"
  const parts = text.split(/(\([^)]+\))/g);
  
  return (
    <li className="font-noto text-[16px] flex items-center gap-2 mb-3">
      <span className="w-1.5 h-1.5 rounded-full bg-primary/20 block shrink-0" />
      <span>
        {parts.map((part, i) => (
          <span
            key={i}
            className={part.startsWith("(") ? "opacity-50 font-inter text-[14px] ml-2" : ""}
            dir={part.startsWith("(") ? "ltr" : "rtl"}
          >
            {part}
          </span>
        ))}
      </span>
    </li>
  );
};

export function RootCard({ root }: RootCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white rounded-[2rem] p-8 md:p-12 shadow-[0_8px_40px_rgb(0,0,0,0.03)] border border-border/50 mt-12 w-full max-w-4xl mx-auto"
    >
      <div className="flex flex-col md:flex-row gap-12 md:gap-20">
        
        {/* Main Content (Left) */}
        <div className="flex-1 order-2 md:order-1">
          <div className="mb-2">
            <Label>Word</Label>
            <div className="font-amiri text-4xl text-primary font-medium mb-3" dir="rtl">
              {root.word}
            </div>
            <BodyText>{root.shortDefinition}</BodyText>
          </div>

          <Label>Core</Label>
          <BodyText>{root.coreMeaning}</BodyText>

          <Label>Why</Label>
          <BodyText>{root.why}</BodyText>

          <Label>Contrast</Label>
          <BodyText>{root.contrast}</BodyText>

          <Label>Derived Forms</Label>
          <ul className="mt-4">
            {root.derivedForms.map((form, idx) => (
              <DerivedFormItem key={idx} text={form} />
            ))}
          </ul>
        </div>

        {/* Root Display (Right) */}
        <div className="md:w-64 shrink-0 flex flex-col items-start md:items-end order-1 md:order-2 md:border-l md:border-border/50 md:pl-12">
          <Label>Root</Label>
          <div 
            className="amiri-regular text-[48px] text-primary leading-none"
            dir="rtl"
          >
            {root.root}
          </div>
        </div>
        
      </div>
    </motion.div>
  );
}
