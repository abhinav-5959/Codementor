import { motion } from "framer-motion";
import { BarChart3, Loader2, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { AnalysisResult } from "@/lib/api";

interface AnalysisPanelProps {
  result: AnalysisResult | null;
  isAnalyzing: boolean;
  onAnalyze: () => void;
}

const AnalysisPanel = ({ result, isAnalyzing, onAnalyze }: AnalysisPanelProps) => {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-border px-4 py-2">
        <BarChart3 className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium text-foreground">Complexity Analysis</span>
      </div>
      <div className="flex gap-2 border-b border-border px-4 py-2">
        <Button size="sm" onClick={onAnalyze} disabled={isAnalyzing} className="text-xs">
          {isAnalyzing ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <Brain className="mr-1 h-3 w-3" />}
          Analyze
        </Button>
      </div>

      {!result && !isAnalyzing && (
        <p className="p-4 text-center text-sm text-muted-foreground">
          Click "Analyze" to get complexity and performance insights.
        </p>
      )}

      {isAnalyzing && (
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}

      {result && (
        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 p-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-border bg-muted/50 p-3 text-center">
              <p className="text-xs text-muted-foreground">Time</p>
              <p className="mt-1 font-mono text-lg font-bold text-primary">{result.time_complexity}</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/50 p-3 text-center">
              <p className="text-xs text-muted-foreground">Space</p>
              <p className="mt-1 font-mono text-lg font-bold text-accent">{result.space_complexity}</p>
            </div>
          </div>

          <div>
            <Badge className="bg-accent/20 text-accent border-accent/30">{result.algorithm_category}</Badge>
          </div>

          {result.inefficient_patterns && result.inefficient_patterns.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">Inefficient Patterns</p>
              <ul className="space-y-1">
                {result.inefficient_patterns.map((p, i) => (
                  <li key={i} className="rounded bg-destructive/10 px-2 py-1 text-xs text-destructive">
                    ⚠ {p}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">Suggestions</p>
            <ul className="space-y-1">
              {result.suggestions.map((s, i) => (
                <li key={i} className="rounded bg-primary/10 px-2 py-1 text-xs text-primary">
                  💡 {s}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">Explanation</p>
            <p className="text-sm leading-relaxed text-secondary-foreground">{result.explanation}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AnalysisPanel;
