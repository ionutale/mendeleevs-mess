const FOCUSABLE =
	'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function trapFocus(node: HTMLElement) {
	const previouslyFocused = document.activeElement as HTMLElement | null;

	function focusables(): HTMLElement[] {
		return [...node.querySelectorAll<HTMLElement>(FOCUSABLE)];
	}

	function onKeydown(event: KeyboardEvent): void {
		if (event.key !== 'Tab') return;
		const items = focusables();
		if (items.length === 0) return;

		const first = items[0];
		const last = items[items.length - 1];
		if (event.shiftKey && document.activeElement === first) {
			event.preventDefault();
			last.focus();
		} else if (!event.shiftKey && document.activeElement === last) {
			event.preventDefault();
			first.focus();
		}
	}

	node.addEventListener('keydown', onKeydown);
	queueMicrotask(() => focusables()[0]?.focus());

	return {
		destroy() {
			node.removeEventListener('keydown', onKeydown);
			if (previouslyFocused?.isConnected) previouslyFocused.focus();
		}
	};
}
