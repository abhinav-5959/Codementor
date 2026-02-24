import { motion } from "framer-motion";
import { Terminal, AlertCircle, CheckCircle2, Clock } from "lucide-react";

interface OutputPanelProps {
  output: string;
  stderr: string;
  exitCode: number | null;
  executionTime: number | null;
  isRunning: boolean;
  memory?: number | null;
  errorType?: string | null;
}

const OutputPanel = ({ output, stderr, exitCode, executionTime, isRunning, memory, errorType }: OutputPanelProps) => {
  const hasError = exitCode !== null && exitCode !== 0;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-border px-4 py-2">
        <Terminal className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium text-foreground">Output</span>
        {executionTime !== null && (
          <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {executionTime}ms
          </span>
        )}
        {memory !== null && memory !== undefined && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            {(memory / 1024).toFixed(1)}MB
          </span>
        )}
        {errorType && (
          <span className="flex items-center gap-1 text-xs text-destructive font-mono">
            {errorType}
          </span>
        )}
        {exitCode !== null && !errorType && (
          <span className={`flex items-center gap-1 text-xs ${hasError ? "text-destructive" : "text-success"}`}>
            {hasError ? <AlertCircle className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
            Exit: {exitCode}
          </span>
        )}
      </div>
      <div className="flex-1 overflow-auto p-4">
        {isRunning ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            Running...
          </motion.div>
        ) : (
          <pre className="whitespace-pre-wrap font-mono text-sm">
            {stderr && <span className="text-destructive">{stderr}</span>}
            {output && <span className="text-foreground">{output}</span>}
            {!output && !stderr && exitCode === null && (
              <span className="text-muted-foreground">Run your code to see output here.</span>
            )}
          </pre>
        )}
      </div>
    </div>
  );
};

export default OutputPanel;
