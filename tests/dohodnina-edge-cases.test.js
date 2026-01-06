/**
 * Dodatni testi za robne primere, minimalno plačo in posebne scenarije
 * za izračun dohodnine v Sloveniji (upošteva zakonodajo o minimalni plači)
 */

import { DohodninaCalculator } from '../index.js';

describe('robni primeri, minimalna plača in posebni scenariji', () => {

    // Testi za minimalno plačo in okolico
    describe('minimalna plača in okolico', () => {
        const calc = new DohodninaCalculator(2025);

        test('minimalna plača 2025 (1277.72 EUR mesečno)', () => {
            const result = calc.calculate(1277.72, { period: 'monthly' });
            expect(result.tax).toBe(57.69); // Pri minimalni plači je davek zelo nizek
            expect(result.netIncome).toBe(887.70); // Neto okoli 887 EUR
            // Efektivna stopnja upošteva strošek delodajalca (skupne dajatve / skupni strošek delodajalca)
            expect(result.effectiveRate).toBe(40.67);
        });

        test('tik nad minimalno plačo (1280 EUR mesečno)', () => {
            const result = calc.calculate(1280, { period: 'monthly' });
            expect(result.tax).toBe(58.40);
            expect(result.netIncome).toBe(888.75);
            // Efektivna stopnja upošteva strošek delodajalca
            expect(result.effectiveRate).toBe(40.71);
        });

        test('minimalna plača letno 2025 (15332.64 EUR)', () => {
            const result = calc.calculate(15332.64);
            expect(result.tax).toBe(692.27);
            expect(result.netIncome).toBe(10652.48);
        });

        test('blizu minimalne plače (1300 EUR mesečno)', () => {
            const result = calc.calculate(1300, { period: 'monthly' });
            expect(result.tax).toBe(64.61);
            expect(result.netIncome).toBe(897.92); // Neto okoli 898 EUR
            // Efektivna stopnja upošteva strošek delodajalca
            expect(result.effectiveRate).toBe(41.02);
        });

        test('napaka pri plači pod minimalno (prenizka plača)', () => {
            expect(() => {
                calc.calculate(100, { period: 'monthly' });
            }).toThrow('ne sme biti manjša od minimalne plače');
        });

        test('napaka pri letni plači pod minimalno', () => {
            expect(() => {
                calc.calculate(1000, { period: 'annual' });
            }).toThrow('ne sme biti manjša od minimalne plače');
        });
    });

    // Testi za različne olajšave
    describe('posebne olajšave', () => {
        const calc = new DohodninaCalculator(2025);

        test('olajšava za študenta', () => {
            const result = calc.calculate(24000, { isStudent: true });
            const resultBrez = calc.calculate(24000, { isStudent: false });
            expect(result.tax).toBeLessThan(resultBrez.tax);
        });

        test('validacija za različna leta - 2020', () => {
            const calc2020 = new DohodninaCalculator(2020);
            // Minimalna plača 2020 je 11286.96 € letno, torej mora 10000 € letno vrniti napako
            expect(() => {
                calc2020.calculate(10000, { period: 'annual' });
            }).toThrow('ne sme biti manjša od minimalne plače');
            // 12000 € letno mora biti OK
            expect(() => {
                calc2020.calculate(12000, { period: 'annual' });
            }).not.toThrow();
        });

        test('olajšava za mladega zaposlenega', () => {
            const result = calc.calculate(24000, { isYoungEmployee: true });
            const resultBrez = calc.calculate(24000, { isYoungEmployee: false });
            expect(result.tax).toBeLessThan(resultBrez.tax);
        });

        test('olajšava za vzdrževanega družinskega člana', () => {
            const result = calc.calculate(24000, { dependentFamilyMembers: 1 });
            const resultBrez = calc.calculate(24000, { dependentFamilyMembers: 0 });
            expect(result.tax).toBeLessThan(resultBrez.tax);
        });

        test('olajšava za 100% invalidnost', () => {
            const result = calc.calculate(24000, { hasDisability100: true });
            const resultBrez = calc.calculate(24000, { hasDisability100: false });
            expect(result.tax).toBeLessThan(resultBrez.tax);
        });

        test('olajšava za starejše od 70 let', () => {
            const result = calc.calculate(24000, { isOver70: true });
            const resultBrez = calc.calculate(24000, { isOver70: false });
            expect(result.tax).toBeLessThan(resultBrez.tax);
        });

        test('kombinacija olajšav', () => {
            const result = calc.calculate(24000, {
                numberOfChildren: 2,
                isYoungEmployee: true
            });
            const resultBrez = calc.calculate(24000);
            expect(result.tax).toBeLessThan(resultBrez.tax);
        });
    });

    // Testi za zelo visoke dohodke (nad 5. razredom)
    describe('zelo visoki dohodki', () => {
        const calc = new DohodninaCalculator(2025);

        test('100.000 EUR', () => {
            const result = calc.calculate(100000);
            expect(result.tax).toBeGreaterThan(20000);
            expect(result.effectiveRate).toBeGreaterThan(50);
        });

        test('200.000 EUR letno (nad 5. razredom)', () => {
            const result = calc.calculate(200000, { period: 'annual' });
            expect(result.tax).toBeGreaterThan(50000); // Visoka davek
            expect(result.effectiveRate).toBeGreaterThan(25); // Visoka efektivna stopnja
        });

        test('500.000 EUR letno', () => {
            const result = calc.calculate(500000, { period: 'annual' });
            expect(result.tax).toBeGreaterThan(150000);
            expect(result.effectiveRate).toBeGreaterThan(30);
        });
    });

    // Testi za mejne vrednosti davčnih razredov
    describe('mejne vrednosti davčnih razredov 2025', () => {
        const calc = new DohodninaCalculator(2025);

        test('primerjava davkov pri različnih dohodkih', () => {
            const result1 = calc.calculate(16000, { period: 'annual' });
            const result2 = calc.calculate(20000, { period: 'annual' });

            // Preverimo, da se davek povečuje z dohodkom
            expect(result2.tax).toBeGreaterThan(result1.tax);
        });

        test('na spodnji meji 2. razreda (9210.26 EUR)', () => {
            const result = calc.calculate(16000); // Dovolj visoko da preseže 1. razred
            expect(result.taxBase).toBeGreaterThan(0);
        });

        test('na meji 2. in 3. razreda (približno 27089 EUR letno)', () => {
            const result1 = calc.calculate(26000, { period: 'annual' });
            const result2 = calc.calculate(28000, { period: 'annual' });

            expect(result2.tax).toBeGreaterThan(result1.tax);
            expect(result2.effectiveRate).toBeGreaterThan(result1.effectiveRate);
        });
    });

    // Testi za več otrok
    describe('več otrok', () => {
        const calc = new DohodninaCalculator(2025);

        test('3 otroci - letni izračun', () => {
            const result = calc.calculate(30000, {
                period: 'annual',
                numberOfChildren: 3
            });

            expect(result.reliefs.children).toBeGreaterThan(8000); // Visoka olajšava za otroke
            expect(result.tax).toBeLessThan(2000); // Nizek davek zaradi olajšav
        });

        test('5 otrok - mesečni izračun', () => {
            const result = calc.calculate(2500, {
                period: 'monthly',
                numberOfChildren: 5
            });

            expect(result.reliefs.children).toBeGreaterThan(1000);
            expect(result.netIncome).toBeGreaterThan(1800); // Neto zaradi olajšav za otroke
        });
    });

    // Testi za mesečne izračune z različnimi meseci (2025 specifično)
    describe('mesečne spremembe 2025', () => {
        const calc = new DohodninaCalculator(2025);

        test('januar 2025 - pred DO in pred spremembo OZP', () => {
            const result = calc.calculate(2000, { period: 'monthly', month: 1 });
            expect(result.healthInsuranceFee).toBe(35.00); // Stara vrednost OZP
            expect(result.contributions.employee.longTermCare).toBeUndefined(); // Ni DO pred julijem
        });

        test('februar 2025 - pred DO in pred spremembo OZP', () => {
            const result = calc.calculate(2000, { period: 'monthly', month: 2 });
            expect(result.healthInsuranceFee).toBe(35.00);
            expect(result.contributions.employee.longTermCare).toBeUndefined();
        });

        test('marec 2025 - po spremembi OZP, pred DO', () => {
            const result = calc.calculate(2000, { period: 'monthly', month: 3 });
            expect(result.healthInsuranceFee).toBe(37.17); // Nova vrednost OZP
            expect(result.contributions.employee.longTermCare).toBeUndefined();
        });

        test('junij 2025 - pred DO', () => {
            const result = calc.calculate(2000, { period: 'monthly', month: 6 });
            expect(result.healthInsuranceFee).toBe(37.17);
            expect(result.contributions.employee.longTermCare).toBeUndefined();
        });

        test('julij 2025 - z DO', () => {
            const result = calc.calculate(2000, { period: 'monthly', month: 7 });
            expect(result.healthInsuranceFee).toBe(37.17);
            expect(result.contributions.employee.longTermCare).toBe(20.00); // 1% DO
            expect(result.contributions.employer.longTermCare).toBe(20.00);
        });

        test('december 2025 - z DO', () => {
            const result = calc.calculate(2000, { period: 'monthly', month: 12 });
            expect(result.healthInsuranceFee).toBe(37.17);
            expect(result.contributions.employee.longTermCare).toBe(20.00);
        });
    });

    // Testi za kombinacijo olajšav
    describe('kombinacija olajšav', () => {
        const calc = new DohodninaCalculator(2025);

        test('študent z 1 otrokom', () => {
            const result = calc.calculate(1500, {
                period: 'monthly',
                numberOfChildren: 1,
                isStudent: true
            });

            expect(result.reliefs.total).toBeGreaterThan(500); // Študentska + otroška olajšava
        });

        test('negativna bruto plača vrže napako', () => {
            expect(() => calc.calculate(-1000)).toThrow();
        });

        test('mladi delavec z invalidnostjo', () => {
            const result = calc.calculate(1800, {
                period: 'monthly',
                isYoungEmployee: true,
                hasDisability100: true
            });

            expect(result.reliefs.total).toBeGreaterThan(1000); // Mladi delavec + invalidnost
        });

        test('vse olajšave skupaj', () => {
            const result = calc.calculate(2000, {
                period: 'monthly',
                numberOfChildren: 2,
                isStudent: true,
                isYoungEmployee: true,
                hasDisability100: true,
                isOver70: true,
                dependentFamilyMembers: 1
            });

            expect(result.reliefs.total).toBeGreaterThan(2000); // Vse olajšave skupaj
            expect(result.tax).toBeLessThan(50); // Zelo nizek davek
        });

        test('neveljavno leto vrže napako', () => {
            expect(() => new DohodninaCalculator(2015)).toThrow(/Davčna lestvica za leto 2015 ni na voljo/);
        });

        test('neveljaven mesec vrže napako', () => {
            expect(() => calc.calculate(2000, { period: 'monthly', month: 13 })).toThrow(/Parameter "month" mora biti celo število med 1 in 12/);
        });

        test('mesec 0 vrže napako', () => {
            expect(() => calc.calculate(2000, { period: 'monthly', month: 0 })).toThrow(/Parameter "month" mora biti celo število med 1 in 12/);
        });
    });

    // Testi za prispevke
    describe('prispevki delodajalca', () => {
        const calc = new DohodninaCalculator(2025);

        test('primerjava prispevkov delojemalca in delodajalca', () => {
            const result = calc.calculate(2000, { period: 'monthly' });

            expect(result.contributions.employee.total).toBeGreaterThan(400); // Prispevki delojemalca
            expect(result.contributions.employer.total).toBeGreaterThan(300); // Prispevki delodajalca
            expect(result.totalCostForEmployer).toBeGreaterThan(2300); // Skupaj višji od bruto
        });
    });

    // Testi za različna leta
    describe('podpora za leta 2020-2025', () => {
        const years = [2020, 2021, 2022, 2023, 2024, 2025];

        years.forEach(year => {
            test(`leto ${year} deluje`, () => {
                const calc = new DohodninaCalculator(year);
                const minWage = calc.wages.min;
                const result = calc.calculate(minWage);
                expect(result.tax).toBeGreaterThan(0);
                expect(result.netIncome).toBeGreaterThan(0);
                expect(result.year).toBe(year);
            });
        });
    });

    // Testi za efektivno davčno stopnjo (upošteva strošek delodajalca)
    describe('efektivna davčna stopnja', () => {
        test('efektivna stopnja pri minimalni plači', () => {
            const calc = new DohodninaCalculator(2025);
            const result = calc.calculate(1277.72, { period: 'monthly' }); // Minimalna plača 2025

            // Efektivna stopnja upošteva strošek delodajalca (skupne dajatve / skupni strošek delodajalca)
            expect(result.effectiveRate).toBe(40.67);
        });

        test('visoka efektivna stopnja pri visokih dohodkih', () => {
            const calc = new DohodninaCalculator(2025);
            const result = calc.calculate(100000, { period: 'annual' });

            // Efektivna stopnja upošteva strošek delodajalca
            expect(result.effectiveRate).toBeGreaterThan(50); // Visoka efektivna stopnja
                // Testi za veliko število otrok
        });
    });

    describe('veliko število otrok', () => {
        const calc = new DohodninaCalculator(2025);

        test('5 otrok', () => {
            const result = calc.calculate(48000, { numberOfChildren: 5 });
            expect(result.reliefs.children).toBeGreaterThan(result.reliefs.general);
        });

        test('olajšava za otroke narašča progresivno', () => {
            const relief1 = calc.calculateChildRelief(1);
            const relief2 = calc.calculateChildRelief(2);
            const relief3 = calc.calculateChildRelief(3);

            // Vsak naslednji otrok prinaša večjo olajšavo
            const increment1to2 = relief2 - relief1;
            const increment2to3 = relief3 - relief2;
            expect(increment2to3).toBeGreaterThan(increment1to2);
        });
    });

    // Testi za prispevke delodajalca
    describe('prispevki delodajalca', () => {
        const calc = new DohodninaCalculator(2025);
        test('prispevki delodajalca so pravilno izračunani', () => {
            const result = calc.calculate(2000, { period: 'monthly' });

            // Preveri vsako komponento
            expect(result.contributions.employer.pension).toBe(177.00); // 8.85%
            expect(result.contributions.employer.health).toBe(131.20); // 6.56%
            expect(result.contributions.employer.unemployment).toBe(1.20); // 0.06%
            expect(result.contributions.employer.parentalCare).toBe(2.00); // 0.1%
            expect(result.contributions.employer.workInjury).toBe(10.60); // 0.53%
            expect(result.contributions.employer.longTermCare).toBe(20.00); // 1%

            // Skupaj
            const expectedTotal = 177.00 + 131.20 + 1.20 + 2.00 + 10.60 + 20.00;
            expect(result.contributions.employer.total).toBe(expectedTotal);
        });

        test('strošek delodajalca je bruto + prispevki delodajalca', () => {
            const result = calc.calculate(2000, { period: 'monthly' });
            expect(result.totalCostForEmployer).toBe(2000 + result.contributions.employer.total);
        });
    });
});

// Testi za zgodovinsko primerjavo
describe('zgodovinska primerjava', () => {
    const testIncome = 2500; // Mesečni bruto

    [2020, 2021, 2022, 2023, 2024, 2025].forEach(year => {
        test(`${year} - zgodovinski izračun`, () => {
            const calc = new DohodninaCalculator(year);
            const result = calc.calculate(testIncome, {
                period: 'monthly',
                numberOfChildren: 1
            });

            expect(result.netIncome).toBeGreaterThan(1500); // Neto vedno višja od polovice bruto
            expect(result.netIncome).toBeLessThan(testIncome); // Neto vedno nižja od bruto
        });
    });
});
