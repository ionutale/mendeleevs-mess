import { describe, expect, it } from 'vitest';
import { ELEMENTS } from './elements';
import { TABLE_LAYOUT } from './tableLayout';

describe('TABLE_LAYOUT', () => {
	it('places all 118 elements once', () => {
		expect(Object.keys(TABLE_LAYOUT)).toHaveLength(118);
		for (const element of ELEMENTS) {
			expect(TABLE_LAYOUT[element.symbol]).toBeDefined();
		}
	});

	it('keeps every position inside the periodic grid', () => {
		for (const { col, row } of Object.values(TABLE_LAYOUT)) {
			expect(col).toBeGreaterThanOrEqual(1);
			expect(col).toBeLessThanOrEqual(18);
			expect(row).toBeGreaterThanOrEqual(1);
			expect(row).toBeLessThanOrEqual(9);
		}
	});

	it('puts lanthanides and actinides in the f-block rows', () => {
		expect(TABLE_LAYOUT.La.row).toBe(8);
		expect(TABLE_LAYOUT.Lu.row).toBe(8);
		expect(TABLE_LAYOUT.Ac.row).toBe(9);
		expect(TABLE_LAYOUT.Lr.row).toBe(9);
		expect(TABLE_LAYOUT.Hf.row).toBe(6);
		expect(TABLE_LAYOUT.Rf.row).toBe(7);
	});
});
