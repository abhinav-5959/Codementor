import { motion } from "framer-motion";
import { Bomb, Loader2, Play, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface StressTestCase {
  input: string;
  category: string;
  reason: string;
  result?: {
    passed: boolean;
    execution_time: number;
    output: string;
    error?: string;
    tle?: boolean;
    mle?: boolean;
  };
}

export interface StressTestResult {
  test_cases: StressTestCase[];
}

interface StressTestPanelProps {
  testCases: StressTestCase[];
  isGenerating: boolean;
  isRunning: boolean;
  onGenerate: () => void;
  onRunStressTests: () => void;
}

const categoryColors: Record<string, string> = {
  "Large Input": "bg-destructive/20 text-destructive border-destructive/30",
  "Boundary": "bg-warning/20 text-warning border-warning/30",
  "Empty Input": "bg-muted text-muted-foreground border-border",
  "Adversarial": "bg-accent/20 text-accent border-accent/30",
  "Duplicates": "bg-primary/20 text-primary border-primary/30",
  "Worst Case": "bg-destructive/20 text-destructive border-destructive/30",
};

const StressTestPanel = ({
  testCases,
  isGenerating,
  isRunning,
  onGenerate,
  onRunStressTests,
}: StressTestPanelProps) => {
  const hasResults = testCases.some((tc) => tc.result);
  const tleCount = testCases.filter((tc) => tc.result?.tle).length;
  const mleCount = testCases.filter((tc) => tc.result?.mle).length;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-border px-4 py-2">
        <Bomb className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium text-foreground">Stress Test</span>
        {hasResults && (tleCount > 0 || mleCount > 0) && (
          <div className="ml-auto flex items-center gap-1 text-destructive">
            <AlertTriangle className="h-3 w-3" />
            <span className="text-xs">
              {tleCount > 0 && `${tleCount} TLE`}
              {tleCount > 0 && mleCount > 0 && " · "}
              {mleCount > 0 && `${mleCount} MLE`}
            </span>
          </div>
        )}
      </div>
      <div className="flex gap-2 border-b border-border px-4 py-2">
        <Button size="sm" variant="outline" onClick={onGenerate} disabled={isGenerating} className="text-xs">
          {isGenerating ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <Bomb className="mr-1 h-3 w-3" />}
          Generate Stress Tests
        </Button>
        {testCases.length > 0 && (
          <Button size="sm" onClick={onRunStressTests} disabled={isRunning} className="text-xs">
            {isRunning ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <Play className="mr-1 h-3 w-3" />}
            Run All
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-auto p-2">
        {testCases.length === 0 && !isGenerating && (
          <p className="p-4 text-center text-sm text-muted-foreground">
            Generate worst-case and edge-case tests to stress test your code.
          </p>
        )}

        {isGenerating && (
          <div className="flex flex-1 items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}

        {testCases.length > 0 && (
          <div className="space-y-2">
            {testCases.map((tc, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-md border border-border bg-card p-3"
              >
                <div className="mb-2 flex items-center gap-2">
                  {tc.result && (
                    <>
                      {tc.result.tle || tc.result.mle || !tc.result.passed ? (
                        <XCircle className="h-4 w-4 text-destructive" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      )}
                    </>
                  )}
                  <Badge
                    variant="outline"
                    className={`text-[10px] ${categoryColors[tc.category] || "bg-muted text-muted-foreground"}`}
                  >
                    {tc.category}
                  </Badge>
                  {tc.result && (
                    <span className="ml-auto font-mono text-xs text-muted-foreground">
                      {tc.result.execution_time}ms
                    </span>
                  )}
                  {tc.result?.tle && (
                    <Badge className="bg-destructive/20 text-destructive border-destructive/30 text-[9px]">TLE</Badge>
                  )}
                  {tc.result?.mle && (
                    <Badge className="bg-destructive/20 text-destructive border-destructive/30 text-[9px]">MLE</Badge>
                  )}
                </div>
                <p className="mb-1 text-xs text-muted-foreground">{tc.reason}</p>
                <div className="font-mono text-[11px] text-foreground">
                  <span className="text-muted-foreground">Input: </span>
                  <span className="break-all">
                    {tc.input.length > 200 ? tc.input.slice(0, 200) + "…" : tc.input}
                  </span>
                </div>
                {tc.result?.error && (
                  <p className="mt-1 text-xs text-destructive">{tc.result.error}</p>
                )}
                {tc.result && !tc.result.error && tc.result.output && (
                  <div className="mt-1 font-mono text-[11px]">
                    <span className="text-muted-foreground">Output: </span>
                    <span className="text-foreground">
                      {tc.result.output.length > 200 ? tc.result.output.slice(0, 200) + "…" : tc.result.output}
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StressTestPanel;
