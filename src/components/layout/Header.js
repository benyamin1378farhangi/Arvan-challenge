import Button from "@/components/ui/Button";
import { MenuIcon } from "@/components/ui/icons";

// Presentational only — `onLogout`/`onMenuClick` are passed in by whoever
// wires up real auth/drawer state; Header itself owns no logic.
//
// A 3-column grid (not `flex justify-between`) so the "Arvancloud
// Challenge" pill sits at the true horizontal center of the header —
// `justify-between` centers it only when the left/right content happen to
// be equal width, which they aren't (username text vs. Logout button).
// The two `1fr` side columns absorb the size difference instead.
//
// Below `lg` (Phase 9): the hamburger appears (hidden at `lg`+, where the
// Sidebar is always visible so there's nothing for it to open), the pill
// is dropped entirely (decorative, not load-bearing information), and a
// long username truncates instead of forcing the Logout button off-screen.
export default function Header({ userName, onLogout, onMenuClick }) {
  return (
    <header className="grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-3 border-b border-neutral-st3 bg-neutral-bg1 px-4 lg:px-6">
      <div className="flex min-w-0 items-center gap-3">
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

      <p className="hidden shrink-0 whitespace-nowrap rounded-lg bg-neutral-bg2 px-4 py-2 text-body-2 tracking-body-2 font-semibold text-neutral-fg1 lg:block">
        Arvancloud Challenge
      </p>

      <div className="flex justify-end">
        <Button variant="secondary" onClick={onLogout} className="shrink-0">
          Log out
        </Button>
      </div>
    </header>
  );
}
