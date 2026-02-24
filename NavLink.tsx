import { Code2, Zap } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const Header = () => {
  return (
    <header className="flex items-center justify-between border-b border-border px-6 py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 glow-primary">
          <Code2 className="h-5 w-5 text-primary" />
        </div>
        <h1 className="text-lg font-bold text-foreground">
          Code<span className="text-primary">mentor</span>
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Zap className="h-3 w-3 text-primary" />
          AI-Powered Code Optimization
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
