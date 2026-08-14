import Button from "@/components/ui/Button";

// Presentational only — `onLogout` is passed in by whoever wires up real
// auth (Phase 4+); Header itself has no auth logic.
export default function Header({ userName, onLogout }) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-neutral-st3 bg-neutral-bg1 px-6">
      <p className="text-body-2 tracking-body-2 text-neutral-fg1">Welcome {userName}</p>
      <p className="rounded-lg bg-neutral-bg2 px-4 py-2 text-body-2 tracking-body-2 font-semibold text-neutral-fg1">
        Arvancloud Challenge
      </p>
      <Button variant="secondary" onClick={onLogout}>
        Log out
      </Button>
    </header>
  );
}
