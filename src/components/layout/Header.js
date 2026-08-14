import Button from "@/components/ui/Button";
import { MenuIcon } from "@/components/ui/icons";

// Presentational only — `onLogout`/`onMenuClick` are passed in by whoever
// wires up real auth/drawer state; Header itself owns no logic.
//
// Below `lg` (Phase 9): the hamburger appears (hidden at `lg`+, where the
// Sidebar is always visible so there's nothing for it to open), the
// "Arvancloud Challenge" pill is dropped entirely (decorative, not load-
// bearing information), and a long username truncates instead of forcing
// the Logout button off-screen.
export default function Header({ userName, onLogout, onMenuClick }) {
  return (
    <header className="flex h-16 items-center justify-between gap-3 border-b border-neutral-st3 bg-neutral-bg1 px-4 lg:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Button
          variant="secondary"
          layout="icon"
          aria-label="Open menu"
          onClick={onMenuClick}
          className="lg:hidden"
        >
          <MenuIcon className="size-4" />
        </Button>
        <p className="truncate text-body-2 tracking-body-2 text-neutral-fg1">
          Welcome {userName}
        </p>
      </div>

      <p className="hidden shrink-0 rounded-lg bg-neutral-bg2 px-4 py-2 text-body-2 tracking-body-2 font-semibold text-neutral-fg1 lg:block">
        Arvancloud Challenge
      </p>

      <Button variant="secondary" onClick={onLogout} className="shrink-0">
        Log out
      </Button>
    </header>
  );
}
