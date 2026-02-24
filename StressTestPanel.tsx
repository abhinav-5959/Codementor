import { motion } from "framer-motion";
import { Zap, Brain, ArrowRight, TrendingDown, Loader2, Download, Columns2, Code2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import CodeEditor from "./CodeEditor";
import type { OptimizationResult } from "@/lib/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface OptimizationPanelProps {
  result: OptimizationResult | null;
  isOptimizing: boolean;
  onOptimize: () => void;
  onApplyOptimized?: (code: string) => void;
  originalTime: number | null;
  optimizedTime: number | null;
  originalCode?: string;
}

const OptimizationPanel = ({
  result,
  isOptimizing,
  onOptimize,
  onApplyOptimized,
  originalTime,
  optimizedTime,
  originalCode,
}: OptimizationPanelProps) => {
  const [diffView, setDiffView] = useState<"side-by-side" | "optimized">("side-by-side");

  const chartData =
    originalTime && optimizedTime
      ? [
          { name: "Original", time: originalTime },
          { name: "Optimized", time: optimizedTime },
        ]
      : null;

  const downloadCode = () => {
    if (!result) return;
    const blob = new Blob([result.optimized_code], { type: "text/x-python" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "optimized_code.py";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-full flex-col overflow-auto">
      <div className="flex items-center gap-2 border-b border-border px-4 py-2">
        <Zap className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium text-foreground">AI Optimization</span>
      </div>
      <div className="flex gap-2 border-b border-border px-4 py-2">
        <Button size="sm" onClick={onOptimize} disabled={isOptimizing} className="text-xs">
          {isOptimizing ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <Brain className="mr-1 h-3 w-3" />}
          Optimize Code
        </Button>
        {result && (
          <>
            <Button size="sm" variant="outline" onClick={downloadCode} className="text-xs">
              <Download className="mr-1 h-3 w-3" />
              Download
            </Button>
            {onApplyOptimized && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onApplyOptimized(result.optimized_code)}
                className="text-xs border-primary/30 text-primary hover:bg-primary/10"
              >
                <Check className="mr-1 h-3 w-3" />
                Apply
              </Button>
            )}
            <div className="ml-auto flex rounded-md border border-border overflow-hidden">
              <button
                onClick={() => setDiffView("side-by-side")}
                className={`px-2 py-1 text-xs flex items-center gap-1 transition-colors ${
                  diffView === "side-by-side"
                    ? "bg-primary/20 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Columns2 className="h-3 w-3" />
                Diff
              </button>
              <button
                onClick={() => setDiffView("optimized")}
                className={`px-2 py-1 text-xs flex items-center gap-1 border-l border-border transition-colors ${
                  diffView === "optimized"
                    ? "bg-primary/20 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Code2 className="h-3 w-3" />
                Optimized
              </button>
            </div>
          </>
        )}
      </div>

      {!result && !isOptimizing && (
        <p className="p-4 text-center text-sm text-muted-foreground">
          Click "Optimize Code" to get AI-powered suggestions.
        </p>
      )}

      {isOptimizing && (
        <div className="flex flex-1 items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-3"
          >
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Analyzing and optimizing...</p>
          </motion.div>
        </div>
      )}

      {result && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 p-4">
          {/* Complexity Comparison */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-border bg-muted/50 p-3">
              <p className="mb-1 text-xs text-muted-foreground">Original</p>
              <p className="font-mono text-sm text-foreground">
                Time: {result.original_time_complexity}
              </p>
              <p className="font-mono text-sm text-foreground">
                Space: {result.original_space_complexity}
              </p>
            </div>
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
              <p className="mb-1 text-xs text-primary">Optimized</p>
              <p className="font-mono text-sm text-foreground">
                Time: {result.optimized_time_complexity}
              </p>
              <p className="font-mono text-sm text-foreground">
                Space: {result.optimized_space_complexity}
              </p>
            </div>
          </div>

          {/* Category & Patterns */}
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-accent/20 text-accent border-accent/30">{result.algorithm_category}</Badge>
            {result.inefficient_patterns?.map((p, i) => (
              <Badge key={i} variant="outline" className="text-xs text-warning border-warning/30">
                <TrendingDown className="mr-1 h-3 w-3" />
                {p}
              </Badge>
            ))}
          </div>

          {/* Performance Chart */}
          {chartData && (
            <div className="rounded-lg border border-border p-3">
              <p className="mb-2 text-xs font-medium text-muted-foreground">Execution Time (ms)</p>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={chartData} layout="vertical">
                  <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(215 14% 50%)" }} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={70}
                    tick={{ fontSize: 11, fill: "hsl(210 20% 92%)" }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(220 18% 10%)",
                      border: "1px solid hsl(220 14% 18%)",
                      borderRadius: "6px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="time" radius={[0, 4, 4, 0]}>
                    <Cell fill="hsl(0 72% 55%)" />
                    <Cell fill="hsl(174 72% 52%)" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Explanation */}
          <div className="rounded-lg border border-border p-3">
            <p className="mb-2 text-xs font-medium text-muted-foreground">Explanation</p>
            <p className="text-sm leading-relaxed text-foreground">{result.explanation}</p>
          </div>

          {/* Code Diff / Optimized View */}
          {diffView === "side-by-side" && originalCode ? (
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-border overflow-hidden">
                <div className="flex items-center gap-2 border-b border-border bg-destructive/5 px-3 py-1.5">
                  <span className="text-[10px] font-medium text-destructive">ORIGINAL</span>
                </div>
                <div className="h-[250px]">
                  <CodeEditor code={originalCode} onChange={() => {}} readOnly />
                </div>
              </div>
              <div className="rounded-lg border border-primary/30 overflow-hidden">
                <div className="flex items-center gap-2 border-b border-primary/20 bg-primary/5 px-3 py-1.5">
                  <span className="text-[10px] font-medium text-primary">OPTIMIZED</span>
                </div>
                <div className="h-[250px]">
                  <CodeEditor code={result.optimized_code} onChange={() => {}} readOnly />
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-primary/30 overflow-hidden">
              <div className="flex items-center gap-2 border-b border-primary/20 bg-primary/5 px-3 py-2">
                <ArrowRight className="h-3 w-3 text-primary" />
                <span className="text-xs font-medium text-primary">Optimized Code</span>
              </div>
              <div className="h-[200px]">
                <CodeEditor code={result.optimized_code} onChange={() => {}} readOnly />
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default OptimizationPanel;
