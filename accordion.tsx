import { motion } from "framer-motion";
import { TestTube2, CheckCircle2, XCircle, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { TestCase } from "@/lib/api";

interface TestPanelProps {
  testCases: TestCase[];
  isGenerating: boolean;
  isRunning: boolean;
  onGenerate: () => void;
  onRunTests: () => void;
}

const categoryColors: Record<string, string> = {
  normal: "bg-primary/20 text-primary border-primary/30",
  edge: "bg-accent/20 text-accent border-accent/30",
  boundary: "bg-warning/20 text-warning border-warning/30",
  performance: "bg-destructive/20 text-destructive border-destructive/30",
};

const TestPanel = ({ testCases, isGenerating, isRunning, onGenerate, onRunTests }: TestPanelProps) => {
  const passed = testCases.filter((t) => t.passed === true).length;
  const failed = testCases.filter((t) => t.passed === false).length;
  const total = testCases.length;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-border px-4 py-2">
        <TestTube2 className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium text-foreground">Test Cases</span>
        {total > 0 && (
          <span className="ml-auto text-xs text-muted-foreground">
            {passed}/{total} passed
          </span>
        )}
      </div>
      <div className="flex gap-2 border-b border-border px-4 py-2">
        <Button size="sm" variant="outline" onClick={onGenerate} disabled={isGenerating} className="text-xs">
          {isGenerating ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <Sparkles className="mr-1 h-3 w-3" />}
          Generate Tests
        </Button>
        {total > 0 && (
          <Button size="sm" onClick={onRunTests} disabled={isRunning} className="text-xs">
            {isRunning ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <TestTube2 className="mr-1 h-3 w-3" />}
            Run All
          </Button>
        )}
      </div>
      <div className="flex-1 overflow-auto p-2">
        {testCases.length === 0 ? (
          <p className="p-4 text-center text-sm text-muted-foreground">
            Click "Generate Tests" to create AI-powered test cases.
          </p>
        ) : (
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
                  {tc.passed === true && <CheckCircle2 className="h-4 w-4 text-success" />}
                  {tc.passed === false && <XCircle className="h-4 w-4 text-destructive" />}
                  <span className="text-sm font-medium text-foreground">{tc.name}</span>
                  <Badge variant="outline" className={`ml-auto text-[10px] ${categoryColors[tc.category] || ""}`}>
                    {tc.category}
                  </Badge>
                </div>
                <div className="space-y-1 font-mono text-xs">
                  <div className="text-muted-foreground">
                    Input: <span className="text-foreground">{tc.input}</span>
                  </div>
                  <div className="text-muted-foreground">
                    Expected: <span className="text-foreground">{tc.expected_output}</span>
                  </div>
                  {tc.actual_output !== undefined && (
                    <div className="text-muted-foreground">
                      Actual:{" "}
                      <span className={tc.passed ? "text-success" : "text-destructive"}>{tc.actual_output}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestPanel;
