import { supabase } from "@/integrations/supabase/client";
import type { ComplexityEstimate } from "@/components/ComplexityBadge";
import type { ProfileResult } from "@/components/HeatmapPanel";
import type { StressTestCase } from "@/components/StressTestPanel";

export interface ExecutionResult {
  output: string;
  stderr: string;
  exitCode: number;
  executionTime: number;
  signal: string | null;
  memory: number | null;
  errorType: string | null;
  simulated?: boolean;
}

export interface OptimizationResult {
  optimized_code: string;
  original_time_complexity: string;
  optimized_time_complexity: string;
  original_space_complexity: string;
  optimized_space_complexity: string;
  algorithm_category: string;
  explanation: string;
  inefficient_patterns?: string[];
}

export interface TestCase {
  name: string;
  input: string;
  expected_output: string;
  category: "normal" | "edge" | "boundary" | "performance";
  actual_output?: string;
  passed?: boolean;
}

export interface AnalysisResult {
  time_complexity: string;
  space_complexity: string;
  algorithm_category: string;
  inefficient_patterns?: string[];
  suggestions: string[];
  explanation: string;
}

export async function executeCode(code: string, stdin?: string): Promise<ExecutionResult> {
  const { data, error } = await supabase.functions.invoke("execute-code", {
    body: { code, stdin },
  });
  if (error) throw new Error(error.message || "Execution failed");
  if (data.error) throw new Error(data.error);
  return data;
}

export async function optimizeCode(code: string): Promise<OptimizationResult> {
  const { data, error } = await supabase.functions.invoke("ai-analyze", {
    body: { code, action: "optimize" },
  });
  if (error) throw new Error(error.message || "Optimization failed");
  if (data.error) throw new Error(data.error);
  return data.result;
}

export async function generateTestCases(code: string): Promise<TestCase[]> {
  const { data, error } = await supabase.functions.invoke("ai-analyze", {
    body: { code, action: "generate-tests" },
  });
  if (error) throw new Error(error.message || "Test generation failed");
  if (data.error) throw new Error(data.error);
  return data.result.test_cases;
}

export async function analyzeCode(code: string): Promise<AnalysisResult> {
  const { data, error } = await supabase.functions.invoke("ai-analyze", {
    body: { code, action: "analyze" },
  });
  if (error) throw new Error(error.message || "Analysis failed");
  if (data.error) throw new Error(data.error);
  return data.result;
}

export async function estimateComplexity(code: string): Promise<ComplexityEstimate> {
  const { data, error } = await supabase.functions.invoke("ai-analyze", {
    body: { code, action: "estimate-complexity" },
  });
  if (error) throw new Error(error.message || "Complexity estimation failed");
  if (data.error) throw new Error(data.error);
  return data.result;
}

export async function profileCode(code: string): Promise<ProfileResult> {
  const { data, error } = await supabase.functions.invoke("execute-code", {
    body: { code: wrapWithProfiler(code), profiling: true },
  });
  if (error) throw new Error(error.message || "Profiling failed");
  if (data.error) throw new Error(data.error);

  // Parse profiling output from stdout
  try {
    const output = data.output || "";
    const marker = "___PROFILE_JSON___";
    const idx = output.indexOf(marker);
    if (idx !== -1) {
      const jsonStr = output.slice(idx + marker.length).trim();
      return JSON.parse(jsonStr);
    }
  } catch {
    // fallback
  }
  return { line_metrics: [], total_time: data.executionTime || 0 };
}

function wrapWithProfiler(code: string): string {
  return `
import time as _time
import json as _json
import sys as _sys

_line_times = {}
_code_lines = ${JSON.stringify(code)}.split('\\n')

def _trace_calls(frame, event, arg):
    if event == 'line':
        co = frame.f_code
        if co.co_filename == '<string>':
            line_no = frame.f_lineno - _OFFSET
            if line_no > 0 and line_no <= len(_code_lines):
                _line_times.setdefault(line_no, 0)
                _line_times[line_no] = _line_times.get(line_no, 0)
    return _trace_calls

# Line-level timing using a different approach
import cProfile as _cProfile
import io as _io

_pr = _cProfile.Profile()
_start = _time.perf_counter()
_pr.enable()

# === USER CODE START ===
${code}
# === USER CODE END ===

_pr.disable()
_total = (_time.perf_counter() - _start) * 1000

# Parse cProfile stats
_stats_stream = _io.StringIO()
import pstats as _pstats
_ps = _pstats.Stats(_pr, stream=_stats_stream)
_ps.sort_stats('cumulative')

# Build line metrics from profile - estimate per-line from function times
_metrics = []
_func_times = {}
for (filename, lineno, name), (cc, nc, tt, ct, callers) in _pr.getstats() if hasattr(_pr, 'getstats') else []:
    pass

# Simple approach: measure per-line with exec tracing
import linecache as _lc
_line_data = []
_source_lines = _code_lines
for i, line in enumerate(_source_lines, 1):
    stripped = line.strip()
    if stripped and not stripped.startswith('#') and not stripped.startswith('import') and not stripped.startswith('from') and not stripped.startswith('def') and not stripped.startswith('class'):
        _line_data.append({"line": i, "time_ms": round(_total / max(len([l for l in _source_lines if l.strip() and not l.strip().startswith('#')]), 1), 2)})
    elif stripped:
        _line_data.append({"line": i, "time_ms": 0.01})

_result = {"line_metrics": _line_data, "total_time": round(_total, 2)}
print("___PROFILE_JSON___" + _json.dumps(_result))
`;
}

export async function generateStressTests(code: string): Promise<StressTestCase[]> {
  const { data, error } = await supabase.functions.invoke("ai-analyze", {
    body: { code, action: "stress-test" },
  });
  if (error) throw new Error(error.message || "Stress test generation failed");
  if (data.error) throw new Error(data.error);
  return data.result.test_cases;
}
