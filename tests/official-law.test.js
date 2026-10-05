import { DohodninaCalculator } from '../index.js';

/**
 * Uradni zneski iz pravilnikov in obvestil FURS.
 * Otroški zneski so letne olajšave po vrstnem redu otroka, ne kumulativa.
 */
const CHILD_AMOUNTS = {
    2020: [2436.92, 2649.24, 4418.54, 6187.85, 7957.14],
    2022: [2510.03, 2728.72, 4551.10, 6373.48, 8195.86],
    2024: [2698.00, 2933.00, 4892.00, 6851.00, 8810.00],
    2025: [2838.30, 3085.52, 5146.39, 7207.26, 9268.12],
    2026: [2995.83, 3256.77, 5432.02, 7607.27, 9782.51]
};

const SPECIAL_CARE = {
    2020: 8830.00,
    2022: 9094.90,
    2024: 9777.00,
    2025: 10285.40,
    2026: 10856.24
};

describe('uradni parametri dohodnine', () => {
    test.each(Object.entries(CHILD_AMOUNTS))('otroci %s', (year, amounts) => {
        const calc = new DohodninaCalculator(Number(year));
        amounts.forEach((amount, index) => {
            expect(calc.childAmount(index + 1)).toBe(amount);
        });
    });

    test.each(Object.entries(SPECIAL_CARE))('posebna nega %s', (year, amount) => {
        const calc = new DohodninaCalculator(Number(year));
        expect(calc.calculateSpecialCareRelief(1)).toBe(amount);
    });

    test('2024 splošna olajšava pri minimalni plači (FURS / ZSSS)', () => {
        const calc = new DohodninaCalculator(2024);
        expect(calc.calculateGeneralRelief(15046.80)).toBe(6117.67);
        const result = calc.calculate(15046.80, { numberOfChildren: 1 });
        expect(result.reliefs.children).toBe(2698.00);
        expect(result.taxBase).toBe(2485.78);
        expect(result.tax).toBe(397.72);
    });

    test('2025 in 2026 splošna olajšava nad pragom', () => {
        expect(new DohodninaCalculator(2025).calculateGeneralRelief(20000)).toBe(5260.00);
        expect(new DohodninaCalculator(2026).calculateGeneralRelief(20000)).toBe(5551.93);
    });

    test('2026 lestvica na meji drugega razreda', () => {
        const calc = new DohodninaCalculator(2026);
        expect(calc.calculateTax(9721.43)).toBe(1555.43);
        expect(calc.calculateTax(810.12, 'monthly')).toBe(129.62);
    });

    test('mesečna olajšava za dva otroka 2025 je vsota zaokroženih 1/12', () => {
        const calc = new DohodninaCalculator(2025);
        expect(calc.calculateChildRelief(2, true)).toBe(493.66);
    });

    test('novi rezident 2026 zmanjša dohodnino za 7 % plače', () => {
        const calc = new DohodninaCalculator(2026);
        const gross = 6000;
        const plain = calc.calculate(gross, { period: 'monthly' });
        const resident = calc.calculate(gross, { period: 'monthly', isNewResident: true });
        expect(resident.newResidentReduction).toBe(420.00);
        expect(resident.tax).toBeCloseTo(plain.tax - 420.00, 2);
        expect(resident.netIncome).toBeCloseTo(plain.netIncome + 420.00, 2);
    });

    test('zimski regres 2026 do polovice minimalne plače ni obdavčen', () => {
        const calc = new DohodninaCalculator(2026);
        const plain = calc.calculate(2000, { period: 'monthly' });
        const withBonus = calc.calculate(2000, { period: 'monthly', winterBonus: 740.94 });
        expect(withBonus.winterBonus.exempt).toBe(740.94);
        expect(withBonus.winterBonus.taxable).toBe(0);
        expect(withBonus.tax).toBe(plain.tax);
        expect(withBonus.contributions.employee.total).toBe(plain.contributions.employee.total);
        expect(withBonus.netIncome).toBeCloseTo(plain.netIncome + 740.94, 2);
    });

    test('presežek zimskega regresa se prišteje k obdavčljivi plači', () => {
        const calc = new DohodninaCalculator(2025);
        const result = calc.calculate(2000, { period: 'monthly', winterBonus: 1000 });
        expect(result.winterBonus.exempt).toBe(638.86);
        expect(result.winterBonus.taxable).toBe(361.14);
        expect(result.taxableGross).toBe(2361.14);
    });
});
