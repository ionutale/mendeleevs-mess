# Issue 10 — Element card, slot, and tray

- **Status:** open
- **Labels:** `ui`, `mendeleevs-mess`
- **Depends on:** [Issue 09](09-app-shell.md)
- **Plan:** [Task 10](../docs/superpowers/plans/2026-11-07-mendeleevs-mess.md)
- **Spec:** [Design doc](../docs/superpowers/specs/2026-11-07-mendeleevs-mess-design.md)

> Local implementation issue. The plan task is the source of truth; this file is the ticket.

## Goal

Element cards, forge slots, and a sortable, filterable, searchable tray.

## Work

**Files:**

- Create: `src/components/ElementCard.tsx`, `src/components/Slot.tsx`, `src/components/Tray.tsx`, `src/components/cards.test.tsx`, `src/styles/cards.css`

**Interfaces:**

- Consumes: `ElementRecord`, `CATEGORIES`
- Produces:
  - `ElementCard({ element, selected?, onClick?, variant? })`
  - `Slot({ symbol, index, onClear })`
  - `Tray({ elements, onPick, disabled? })` with internal sort (`number` | `name` | `category`), category filter, and search

- [ ] **Step 1: Write the failing component tests**

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ElementCard } from './ElementCard';
import { Slot } from './Slot';
import { Tray } from './Tray';
import { tinyElements } from '../test/fixtures';

describe('cards', () => {
	it('labels a card with symbol, name, and number', () => {
		render(<ElementCard element={tinyElements[1]} />);
		expect(screen.getByText('He')).toBeInTheDocument();
		expect(screen.getByText('Helium')).toBeInTheDocument();
		expect(screen.getByText('2')).toBeInTheDocument();
	});

	it('clears a filled slot', async () => {
		const onClear = vi.fn();
		render(<Slot symbol="H" index={1} onClear={onClear} />);
		await userEvent.click(screen.getByRole('button', { name: /clear slot 1/i }));
		expect(onClear).toHaveBeenCalled();
	});

	it('filters and searches the tray', async () => {
		render(<Tray elements={tinyElements} onPick={vi.fn()} />);
		expect(screen.getByRole('button', { name: /hydrogen/i })).toBeInTheDocument();
		await userEvent.type(screen.getByRole('searchbox'), 'hel');
		expect(screen.getAllByRole('button', { name: /helium/i })).toHaveLength(1);
		expect(screen.queryByRole('button', { name: /hydrogen/i })).not.toBeInTheDocument();
	});

	it('calls onPick when a tray card is tapped', async () => {
		const onPick = vi.fn();
		render(<Tray elements={tinyElements} onPick={onPick} />);
		await userEvent.click(screen.getByRole('button', { name: /hydrogen/i }));
		expect(onPick).toHaveBeenCalledWith('H');
	});
});
```

- [ ] **Step 2: Run and confirm failure**

Run: `pnpm vitest run src/components/cards.test.tsx`
Expected: FAIL — modules not found.

- [ ] **Step 3: Implement the components**

- `ElementCard`: category stripe (`CATEGORIES[category].color`), number, symbol, name; `aria-label="{name}, element {number}, {category label}"`; selected state adds `data-selected`.
- `Slot`: dashed drop zone; empty copy "Drop an element"; filled shows an `ElementCard` plus a clear button labelled `Clear slot {index}`; the slot element carries `data-testid="slot-{index}"`.
- `Tray`: horizontal scroll on phones; sort `<select>`; category `<select>`; `<input type="search">`; cards are buttons; 44 px minimum; disabled prop dims and blocks picks.

- [ ] **Step 4: Verify and commit**

Run: `pnpm vitest run src/components/cards.test.tsx`
Expected: pass.

```bash
git add -A
git commit -m "feat: add element card, forge slot, and searchable tray"
```

## Definition of done

- [ ] Every step above is checked.
- [ ] The task's verification commands pass.
- [ ] Changes are committed with the message given in the plan.
- [ ] `Status` above is changed to `done`.
