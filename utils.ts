@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800&display=swap');

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 220 20% 10%;

    --card: 220 14% 96%;
    --card-foreground: 220 20% 10%;

    --popover: 0 0% 100%;
    --popover-foreground: 220 20% 10%;

    --primary: 174 72% 40%;
    --primary-foreground: 0 0% 100%;

    --secondary: 220 14% 92%;
    --secondary-foreground: 220 20% 20%;

    --muted: 220 14% 94%;
    --muted-foreground: 215 14% 45%;

    --accent: 265 60% 55%;
    --accent-foreground: 0 0% 100%;

    --destructive: 0 72% 50%;
    --destructive-foreground: 0 0% 100%;

    --border: 220 14% 88%;
    --input: 220 14% 88%;
    --ring: 174 72% 40%;

    --radius: 0.5rem;

    --success: 142 60% 40%;
    --success-foreground: 0 0% 100%;
    --warning: 38 92% 50%;
    --warning-foreground: 220 20% 10%;

    --sidebar-background: 220 14% 96%;
    --sidebar-foreground: 220 20% 20%;
    --sidebar-primary: 174 72% 40%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 220 14% 92%;
    --sidebar-accent-foreground: 220 20% 20%;
    --sidebar-border: 220 14% 88%;
    --sidebar-ring: 174 72% 40%;

    --glow-primary: 174 72% 40%;
    --glow-accent: 265 60% 55%;
  }

  .dark {
    --background: 220 20% 7%;
    --foreground: 210 20% 92%;

    --card: 220 18% 10%;
    --card-foreground: 210 20% 92%;

    --popover: 220 18% 10%;
    --popover-foreground: 210 20% 92%;

    --primary: 174 72% 52%;
    --primary-foreground: 220 20% 7%;

    --secondary: 220 16% 16%;
    --secondary-foreground: 210 20% 85%;

    --muted: 220 14% 14%;
    --muted-foreground: 215 14% 50%;

    --accent: 265 60% 60%;
    --accent-foreground: 210 20% 95%;

    --destructive: 0 72% 55%;
    --destructive-foreground: 210 40% 98%;

    --border: 220 14% 18%;
    --input: 220 14% 18%;
    --ring: 174 72% 52%;

    --radius: 0.5rem;

    --success: 142 60% 45%;
    --success-foreground: 220 20% 7%;
    --warning: 38 92% 55%;
    --warning-foreground: 220 20% 7%;

    --sidebar-background: 220 18% 10%;
    --sidebar-foreground: 210 20% 85%;
    --sidebar-primary: 174 72% 52%;
    --sidebar-primary-foreground: 220 20% 7%;
    --sidebar-accent: 220 14% 14%;
    --sidebar-accent-foreground: 210 20% 85%;
    --sidebar-border: 220 14% 18%;
    --sidebar-ring: 174 72% 52%;

    --glow-primary: 174 72% 52%;
    --glow-accent: 265 60% 60%;
  }
}

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground font-sans;
    font-feature-settings: "rlig" 1, "calt" 1;
  }

  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  ::-webkit-scrollbar-track {
    background: hsl(var(--background));
  }
  ::-webkit-scrollbar-thumb {
    background: hsl(var(--border));
    border-radius: 3px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: hsl(var(--muted-foreground));
  }
}

@layer utilities {
  .glow-primary {
    box-shadow: 0 0 20px -5px hsl(var(--glow-primary) / 0.3);
  }
  .glow-accent {
    box-shadow: 0 0 20px -5px hsl(var(--glow-accent) / 0.3);
  }
  .glass {
    background: hsl(var(--card) / 0.6);
    backdrop-filter: blur(12px);
    border: 1px solid hsl(var(--border) / 0.5);
  }
  .gradient-text {
    background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}
