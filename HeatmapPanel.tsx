import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Clock, HardDrive, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export interface ComplexityEstimate {
  time_complexity: string;
  space_complexity: string;
  confidence: "High" | "Medium" | "Low";
  reasoning: string;
}

interface ComplexityBadgeProps {
  estimate: ComplexityEstimate | null;
  isAnalyzing: boolean;
}

const complexityRank: Record<string, number> = {
  "O(1)": 0,
  "O(log n)": 1,
  "O(n)": 2,
  "O(n log n)": 3,
  "O(n^2)": 4,
  "O(n^3)": 5,
  "O(2^n)": 6,
  "O(n!)": 7,
};

function isHighComplexity(tc: string): boolean {
  const rank = complexityRank[tc] ?? 4;
  return rank > 3; // worse than O(n log n)
}

const confidenceColors: Record<string, string> = {
  High: "bg-success/20 text-success border-success/30",
  Medium: "bg-warning/20 text-warning border-warning/30",
  Low: "bg-muted text-muted-foreground border-border",
};

const ComplexityBadge = ({ estimate, isAnalyzing }: ComplexityBadgeProps) => {
  if (isAnalyzing) {
    return (
      <div className="flex items-center gap-2 px-4 py-1.5 border-t border-border bg-muted/30">
        <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Estimating complexity…</span>
      </div>
    );
  }

  if (!estimate) return null;

  const warn = isHighComplexity(estimate.time_complexity);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={estimate.time_complexity + estimate.space_complexity}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="flex items-center gap-3 px-4 py-1.5 border-t border-border bg-muted/30"
      >
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3 w-3 text-primary" />
                <span className={`font-mono text-xs font-bold ${warn ? "text-destructive" : "text-primary"}`}>
                  {estimate.time_complexity}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs text-xs">
              <p className="font-medium">Time Complexity</p>
              <p className="text-muted-foreground">{estimate.reasoning}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="flex items-center gap-1.5">
          <HardDrive className="h-3 w-3 text-accent" />
          <span className="font-mono text-xs font-bold text-accent">{estimate.space_complexity}</span>
        </div>

        <Badge variant="outline" className={`text-[10px] ${confidenceColors[estimate.confidence] || ""}`}>
          {estimate.confidence}
        </Badge>

        {warn && (
          <div className="ml-auto flex items-center gap-1 text-destructive">
            <AlertTriangle className="h-3 w-3" />
            <span className="text-[10px] font-medium">High complexity</span>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default ComplexityBadge;
