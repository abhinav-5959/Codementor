import { motion } from "framer-motion";
import { Flame, Loader2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface LineMetric {
  line: number;
  time_ms: number;
}

export interface ProfileResult {
  line_metrics: LineMetric[];
  total_time: number;
}

interface HeatmapPanelProps {
  result: ProfileResult | null;
  isProfiling: boolean;
  onProfile: () => void;
}

function getHeatColor(ratio: number): string {
  if (ratio > 0.5) return "bg-destructive/80 text-destructive-foreground";
  if (ratio > 0.25) return "bg-warning/60 text-warning-foreground";
  if (ratio > 0.1) return "bg-warning/30 text-foreground";
  return "bg-muted/50 text-muted-foreground";
}

const HeatmapPanel = ({ result, isProfiling, onProfile }: HeatmapPanelProps) => {
  const topLines = result
    ? [...result.line_metrics].sort((a, b) => b.time_ms - a.time_ms).slice(0, 5)
    : [];

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-border px-4 py-2">
        <Flame className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium text-foreground">Performance Heatmap</span>
      </div>
      <div className="flex gap-2 border-b border-border px-4 py-2">
        <Button size="sm" onClick={onProfile} disabled={isProfiling} className="text-xs">
          {isProfiling ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <Play className="mr-1 h-3 w-3" />}
          Profile Code
        </Button>
      </div>

      {!result && !isProfiling && (
        <p className="p-4 text-center text-sm text-muted-foreground">
          Click "Profile Code" to get line-by-line execution time analysis.
        </p>
      )}

      {isProfiling && (
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}

      {result && (
        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 p-4 overflow-auto">
          <div className="rounded-lg border border-border bg-muted/50 p-3 text-center">
            <p className="text-xs text-muted-foreground">Total Execution Time</p>
            <p className="mt-1 font-mono text-lg font-bold text-primary">{result.total_time.toFixed(1)} ms</p>
          </div>

          {topLines.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">🔥 Hottest Lines</p>
              <div className="space-y-1">
                {topLines.map((lm) => {
                  const ratio = result.total_time > 0 ? lm.time_ms / result.total_time : 0;
                  return (
                    <div
                      key={lm.line}
                      className={`flex items-center justify-between rounded px-3 py-1.5 ${getHeatColor(ratio)}`}
                    >
                      <span className="font-mono text-xs">Line {lm.line}</span>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 rounded-full bg-background/30 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-destructive"
                            style={{ width: `${Math.min(ratio * 100, 100)}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs font-bold">{lm.time_ms.toFixed(1)} ms</span>
                        <Badge variant="outline" className="text-[9px]">
                          {(ratio * 100).toFixed(0)}%
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {result.line_metrics.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">All Lines</p>
              <div className="max-h-60 space-y-0.5 overflow-auto rounded border border-border">
                {result.line_metrics
                  .filter((lm) => lm.time_ms > 0)
                  .sort((a, b) => a.line - b.line)
                  .map((lm) => {
                    const ratio = result.total_time > 0 ? lm.time_ms / result.total_time : 0;
                    return (
                      <div
                        key={lm.line}
                        className="flex items-center justify-between px-2 py-0.5 font-mono text-[11px]"
                        style={{
                          backgroundColor: `hsl(0 72% 50% / ${Math.min(ratio * 0.6, 0.6)})`,
                        }}
                      >
                        <span className="text-muted-foreground">L{lm.line}</span>
                        <span className="text-foreground">{lm.time_ms.toFixed(2)} ms</span>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default HeatmapPanel;
