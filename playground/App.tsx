import { useState } from "react";

export default function App() {
  const [dark, setDark] = useState(false);

  function toggleDark() {
    const html = document.documentElement;
    if (dark) {
      html.classList.remove("dark");
    } else {
      html.classList.add("dark");
    }
    setDark(!dark);
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <h1 className="text-2xl font-semibold mb-6">Aikoz Playground</h1>

      <div className="flex flex-wrap gap-3 items-center">
        <button className="bg-primary text-primary-foreground rounded-lg px-4 py-2">
          Primary
        </button>
        <button className="bg-secondary text-secondary-foreground rounded-lg px-4 py-2">
          Secondary
        </button>
        <button className="bg-destructive text-destructive-foreground rounded-lg px-4 py-2">
          Destructive
        </button>
        <button
          onClick={toggleDark}
          className="border border-border text-foreground rounded-lg px-4 py-2"
        >
          {dark ? "Mode clair" : "Mode sombre"}
        </button>
      </div>

      <div className="mt-8 p-4 rounded-lg bg-muted text-muted-foreground text-sm">
        Bridge OK — les variables CSS du bridge sont consommées via Tailwind.
      </div>
    </div>
  );
}
