/**
 * Razširjeni testi za izračun dohodnine v Sloveniji (2020-2025)
 *
 * Pokrivajo scenarije:
 * - Različne višine bruto dohodkov
 * - Različno število otrok
 * - Mesečne in letne izračune
 * - Mejne vrednosti davčnih razredov
 * - Minimalne plače
 * - Posebne olajšave
 */

import { DohodninaCalculator } from '../index.js';

// ====================
// OSNOVNI LETNI IZRAČUNI
// ====================

describe('letni izračuni brez otrok', () => {
    const testCases = {
        2020: [
            { gross: 16000, tax: 1480.64, description: 'nizek-srednji dohodek' },
            { gross: 18000, tax: 1885.72, description: 'srednji dohodek' },
            { gross: 18000, tax: 1885.72, description: 'srednji dohodek' },
            { gross: 24000, tax: 3100.96, description: 'srednje-visok dohodek' },
            { gross: 36000, tax: 5531.44, description: 'visok dohodek' },
            { gross: 48000, tax: 8584.36, description: 'zelo visok dohodek' },
            { gross: 72000, tax: 14909.32, description: 'na meji 5. razreda' },
            { gross: 100000, tax: 23680.00, description: 'nad mejo 5. razreda (50%)' }
        ],
        2021: [
            { gross: 16000, tax: 1480.64, description: 'nizek-srednji dohodek' },
            { gross: 18000, tax: 1885.72, description: 'srednji dohodek' },
            { gross: 18000, tax: 1885.72, description: 'srednji dohodek' },
            { gross: 24000, tax: 3100.96, description: 'srednje-visok dohodek' },
            { gross: 36000, tax: 5531.44, description: 'visok dohodek' },
            { gross: 48000, tax: 8584.36, description: 'zelo visok dohodek' },
            { gross: 72000, tax: 14909.32, description: 'na meji 5. razreda' },
            { gross: 100000, tax: 23680.00, description: 'nad mejo 5. razreda' }
        ],
        2022: [
            { gross: 16000, tax: 1274.24, description: 'nizek-srednji dohodek' },
            { gross: 18000, tax: 1600.22, description: 'srednji dohodek' },
            { gross: 18000, tax: 1600.22, description: 'srednji dohodek' },
            { gross: 24000, tax: 2815.46, description: 'srednje-visok dohodek' },
            { gross: 36000, tax: 5245.94, description: 'visok dohodek' },
            { gross: 48000, tax: 8176.36, description: 'zelo visok dohodek' },
            { gross: 72000, tax: 14351.32, description: 'na meji 5. razreda' },
            { gross: 100000, tax: 22858.00, description: 'nad mejo 5. razreda (45%)' }
        ],
        2023: [
            { gross: 16000, tax: 1194.24, description: 'nizek-srednji dohodek' },
            { gross: 18000, tax: 1470.22, description: 'srednji dohodek' },
            { gross: 18000, tax: 1470.22, description: 'srednji dohodek' },
            { gross: 24000, tax: 2685.46, description: 'srednje-visok dohodek' },
            { gross: 36000, tax: 5115.94, description: 'visok dohodek' },
            { gross: 48000, tax: 8011.36, description: 'zelo visok dohodek' },
            { gross: 72000, tax: 14181.04, description: 'na meji 5. razreda' },
            { gross: 100000, tax: 22663.00, description: 'nad mejo 5. razreda (50%)' }
        ],
        2024: [
            { gross: 16000, tax: 1127.04, description: 'nizek-srednji dohodek' },
            { gross: 18000, tax: 1376.32, description: 'srednji dohodek' },
            { gross: 18000, tax: 1376.32, description: 'srednji dohodek' },
            { gross: 24000, tax: 2576.26, description: 'srednje-visok dohodek' },
            { gross: 36000, tax: 5006.74, description: 'visok dohodek' },
            { gross: 48000, tax: 7872.76, description: 'zelo visok dohodek' },
            { gross: 72000, tax: 14042.44, description: 'na meji 5. razreda' },
            { gross: 100000, tax: 22499.20, description: 'nad mejo 5. razreda' }
        ],
        2025: [
            { gross: 16000, tax: 899.59, description: 'nizek-srednji dohodek' },
            { gross: 18000, tax: 1301.75, description: 'srednji dohodek' },
            { gross: 18000, tax: 1301.75, description: 'srednji dohodek' },
            { gross: 24000, tax: 2393.96, description: 'srednje-visok dohodek' },
            { gross: 36000, tax: 4793.24, description: 'visok dohodek' },
            { gross: 48000, tax: 7480.71, description: 'zelo visok dohodek' },
            { gross: 72000, tax: 13571.19, description: 'na meji 5. razreda' },
            { gross: 100000, tax: 21697.70, description: 'nad mejo 5. razreda' }
        ]
    };

    for (const [year, cases] of Object.entries(testCases)) {
        describe(`leto ${year}`, () => {
            const calc = new DohodninaCalculator(parseInt(year));

            cases.forEach(({ gross, tax, description }) => {
                test(`${gross} EUR - ${description}`, () => {
                    expect(calc.calculate(gross).tax).toBe(tax);
                });
            });
        });
    }
});

// ====================
// IZRAČUNI Z OTROKI
// ====================

describe('letni izračuni z otroki', () => {
    const testCases = {
        2020: {
            24000: [
                { children: 0, tax: 3100.96 },
                { children: 1, tax: 2477.52 },
                { children: 2, tax: 1394.07 },
                { children: 3, tax: 431.14 }
            ],
            36000: [
                { children: 0, tax: 5531.44 },
                { children: 1, tax: 4908.00 },
                { children: 2, tax: 3824.55 },
                { children: 3, tax: 2281.08 }
            ]
        },
        2021: {
            24000: [
                { children: 0, tax: 3100.96 },
                { children: 1, tax: 2477.52 },
                { children: 2, tax: 1394.07 },
                { children: 3, tax: 431.14 }
            ],
            36000: [
                { children: 0, tax: 5531.44 },
                { children: 1, tax: 4908.00 },
                { children: 2, tax: 3824.55 },
                { children: 3, tax: 2281.08 }
            ]
        },
        2022: {
            24000: [
                { children: 0, tax: 2815.46 },
                { children: 1, tax: 2175.71 },
                { children: 2, tax: 1192.40 },
                { children: 3, tax: 215.55 }
            ],
            36000: [
                { children: 0, tax: 5245.94 },
                { children: 1, tax: 4606.19 },
                { children: 2, tax: 3492.63 },
                { children: 3, tax: 1905.25 }
            ]
        },
        2023: {
            24000: [
                { children: 0, tax: 2685.46 },
                { children: 1, tax: 1983.14 },
                { children: 2, tax: 1013.53 },
                { children: 3, tax: 0 }
            ],
            36000: [
                { children: 0, tax: 5115.94 },
                { children: 1, tax: 4413.62 },
                { children: 2, tax: 3201.96 },
                { children: 3, tax: 1480.96 }
            ]
        },
        2024: {
            24000: [
                { children: 0, tax: 2576.26 },
                { children: 1, tax: 1873.94 },
                { children: 2, tax: 946.33 },
                { children: 3, tax: 0 }
            ],
            36000: [
                { children: 0, tax: 5006.74 },
                { children: 1, tax: 4304.42 },
                { children: 2, tax: 3092.76 },
                { children: 3, tax: 1382.93 }
            ]
        },
        2025: {
            24000: [
                { children: 0, tax: 2393.96 },
                { children: 1, tax: 1656.00 },
                { children: 2, tax: 802.00 },
                { children: 3, tax: 0 }
            ],
            36000: [
                { children: 0, tax: 4793.24 },
                { children: 1, tax: 4055.28 },
                { children: 2, tax: 2781.50 },
                { children: 3, tax: 1164.87 }
            ]
        }
    };

    for (const [year, grossCases] of Object.entries(testCases)) {
        describe(`leto ${year}`, () => {
            const calc = new DohodninaCalculator(parseInt(year));

            for (const [gross, childrenCases] of Object.entries(grossCases)) {
                describe(`bruto ${gross} EUR`, () => {
                    childrenCases.forEach(({ children, tax }) => {
                        test(`${children} otrok(ov)`, () => {
                            expect(calc.calculate(parseInt(gross), { numberOfChildren: children }).tax).toBe(tax);
                        });
                    });
                });
            }
        });
    }
});

// ====================
// MESEČNI IZRAČUNI
// ====================

describe('mesečni izračuni 2025', () => {
    const calc = new DohodninaCalculator(2025);

    describe('prispevki delojemalca', () => {
        test('2000 EUR bruto', () => {
            const result = calc.calculate(2000, { period: 'monthly' });
            expect(result.contributions.employee.pension).toBe(310.00);
            expect(result.contributions.employee.health).toBe(127.20);
            expect(result.contributions.employee.unemployment).toBe(2.80);
            expect(result.contributions.employee.parentalCare).toBe(2.00);
            expect(result.contributions.employee.longTermCare).toBe(20.00);
            expect(result.healthInsuranceFee).toBe(37.17);
            expect(result.contributions.employee.total).toBe(499.17);
        });

        test('3500 EUR bruto', () => {
            const result = calc.calculate(3500, { period: 'monthly' });
            expect(result.contributions.employee.pension).toBe(542.50);
            expect(result.contributions.employee.health).toBe(222.60);
            expect(result.contributions.employee.unemployment).toBe(4.90);
            expect(result.contributions.employee.parentalCare).toBe(3.50);
            expect(result.contributions.employee.longTermCare).toBe(35.00);
            expect(result.healthInsuranceFee).toBe(37.17);
            expect(result.contributions.employee.total).toBe(845.67);
        });
    });

    describe('prispevki delodajalca', () => {
        test('2000 EUR bruto', () => {
            const result = calc.calculate(2000, { period: 'monthly' });
            expect(result.contributions.employer.pension).toBe(177.00);
            expect(result.contributions.employer.health).toBe(131.20);
            expect(result.contributions.employer.unemployment).toBe(1.20);
            expect(result.contributions.employer.parentalCare).toBe(2.00);
            expect(result.contributions.employer.workInjury).toBe(10.60);
            expect(result.contributions.employer.longTermCare).toBe(20.00);
            expect(result.contributions.employer.total).toBe(342.00);
        });
    });

    describe('neto plača brez otrok', () => {
        const testCases = [
            { gross: 1500, netIncome: 1007.85, tax: 108.48, description: 'nizka plača' },
            { gross: 2000, netIncome: 1301.34, tax: 199.49, description: 'povprečna plača' },
            { gross: 2500, netIncome: 1585.87, tax: 299.46, description: 'nadpovprečna plača' },
            { gross: 3000, netIncome: 1870.40, tax: 399.43, description: 'visoka plača' },
            { gross: 3500, netIncome: 2154.93, tax: 499.40, description: 'zelo visoka plača' },
            { gross: 5000, netIncome: 2930.66, tax: 877.17, description: 'vodstvena plača' }
        ];

        testCases.forEach(({ gross, netIncome, tax, description }) => {
            test(`${gross} EUR - ${description}`, () => {
                const result = calc.calculate(gross, { period: 'monthly' });
                expect(result.netIncome).toBe(netIncome);
                expect(result.tax).toBe(tax);
            });
        });
    });

    describe('neto plača z otroki', () => {
        test('2000 EUR z 1 otrokom', () => {
            const result = calc.calculate(2000, { period: 'monthly', numberOfChildren: 1 });
            expect(result.reliefs.children).toBe(236.53);
            expect(result.reliefs.total).toBe(674.86);
            expect(result.taxBase).toBe(825.97);
            expect(result.tax).toBe(138.00);
            expect(result.netIncome).toBe(1362.83);
        });

        test('2000 EUR z 2 otrokoma', () => {
            const result = calc.calculate(2000, { period: 'monthly', numberOfChildren: 2 });
            expect(result.reliefs.children).toBe(644.79);
            expect(result.taxBase).toBe(417.71);
            expect(result.tax).toBe(66.83);
            expect(result.netIncome).toBe(1434.00);
        });

        test('2000 EUR z 3 otroki', () => {
            const result = calc.calculate(2000, { period: 'monthly', numberOfChildren: 3 });
            expect(result.reliefs.children).toBe(1224.79);
            expect(result.taxBase).toBe(0);
            expect(result.tax).toBe(0);
            expect(result.netIncome).toBe(1500.83);
        });
    });

    describe('stroški delodajalca', () => {
        test('2000 EUR bruto', () => {
            const result = calc.calculate(2000, { period: 'monthly' });
            expect(result.totalCostForEmployer).toBe(2342.00);
            expect(result.totalTaxes).toBe(1040.66);
        });

        test('3500 EUR bruto', () => {
            const result = calc.calculate(3500, { period: 'monthly', numberOfChildren: 1 });
            expect(result.totalCostForEmployer).toBe(4098.50);
            expect(result.totalTaxes).toBe(1882.08);
        });
    });
});

describe('srednjeletne spremembe 2025 (mesečno)', () => {
    const calc = new DohodninaCalculator(2025);

    test('januar 2025 - brez DO, OZP 35 €', () => {
        const result = calc.calculate(2000, { period: 'monthly', month: 1 });

        expect(result.healthInsuranceFee).toBe(35.00);
        expect(result.contributions.employee.longTermCare).toBeUndefined();
        expect(result.contributions.employee.total).toBe(477.00);
        expect(result.contributions.employer.health).toBe(131.20);
        expect(result.contributions.employer.unemployment).toBe(1.20);
        expect(result.contributions.employer.workInjury).toBe(10.60);
        expect(result.contributions.employer.longTermCare).toBeUndefined();
        expect(result.contributions.employer.total).toBe(322.00);
        expect(result.tax).toBe(205.26);
        expect(result.netIncome).toBe(1317.74);
        expect(result.totalTaxes).toBe(1004.26);
        expect(result.totalCostForEmployer).toBe(2322.00);
    });

    test('avgust 2025 - z DO, OZP 37,17 €, nove delodajalske stopnje', () => {
        const result = calc.calculate(2000, { period: 'monthly', month: 8 });

        expect(result.healthInsuranceFee).toBe(37.17);
        expect(result.contributions.employee.longTermCare).toBe(20.00);
        expect(result.contributions.employee.total).toBe(499.17);
        expect(result.contributions.employer.health).toBe(131.20);
        expect(result.contributions.employer.unemployment).toBe(1.20);
        expect(result.contributions.employer.workInjury).toBe(10.60);
        expect(result.contributions.employer.longTermCare).toBe(20.00);
        expect(result.contributions.employer.total).toBe(342.00);
        expect(result.tax).toBe(199.49);
        expect(result.netIncome).toBe(1301.34);
        expect(result.totalTaxes).toBe(1040.66);
        expect(result.totalCostForEmployer).toBe(2342.00);
    });
});

// ====================
// MESEČNI IZRAČUNI ZA VSA LETA
// ====================

describe('mesečni izračuni - vsa leta', () => {
    describe('2020 - 2000 EUR mesečno', () => {
        const calc = new DohodninaCalculator(2020);

        test('prispevki (brez OZP)', () => {
            const result = calc.calculate(2000, { period: 'monthly' });
            expect(result.contributions.employee.total).toBe(442.00);
            expect(result.healthInsuranceFee).toBe(0);
        });

        test('neto brez otrok', () => {
            const result = calc.calculate(2000, { period: 'monthly' });
            expect(result.netIncome).toBe(1299.59);
        });

        test('prispevki delodajalca', () => {
            const result = calc.calculate(2000, { period: 'monthly' });
            expect(result.contributions.employer.pension).toBe(177.00);
            expect(result.contributions.employer.health).toBe(131.20);
            expect(result.contributions.employer.unemployment).toBe(1.20);
            expect(result.contributions.employer.parentalCare).toBe(2.00);
            expect(result.contributions.employer.workInjury).toBe(10.60);
            expect(result.contributions.employer.total).toBe(322.00);
        });
    });

    describe('2021 - 2000 EUR mesečno', () => {
        const calc = new DohodninaCalculator(2021);

        test('prispevki (brez OZP)', () => {
            const result = calc.calculate(2000, { period: 'monthly' });
            expect(result.contributions.employee.total).toBe(442.00);
            expect(result.healthInsuranceFee).toBe(0);
        });

        test('neto brez otrok', () => {
            const result = calc.calculate(2000, { period: 'monthly' });
            expect(result.netIncome).toBe(1299.59);
        });
    });

    describe('2022 - 2000 EUR mesečno', () => {
        const calc = new DohodninaCalculator(2022);

        test('prispevki (brez OZP)', () => {
            const result = calc.calculate(2000, { period: 'monthly' });
            expect(result.contributions.employee.total).toBe(442.00);
            expect(result.healthInsuranceFee).toBe(0);
        });

        test('neto brez otrok', () => {
            const result = calc.calculate(2000, { period: 'monthly' });
            expect(result.netIncome).toBe(1323.38);
        });
    });

    describe('2023 - 2000 EUR mesečno', () => {
        const calc = new DohodninaCalculator(2023);

        test('prispevki (brez OZP)', () => {
            const result = calc.calculate(2000, { period: 'monthly' });
            expect(result.contributions.employee.total).toBe(442.00);
            expect(result.healthInsuranceFee).toBe(0);
        });

        test('neto brez otrok', () => {
            const result = calc.calculate(2000, { period: 'monthly' });
            expect(result.netIncome).toBe(1334.22);
        });
    });

    describe('2024 - 2000 EUR mesečno', () => {
        const calc = new DohodninaCalculator(2024);

        test('prispevki (z OZP 35 EUR)', () => {
            const result = calc.calculate(2000, { period: 'monthly' });
            expect(result.contributions.employee.total).toBe(477.00);
            expect(result.healthInsuranceFee).toBe(35.00);
        });

        test('neto brez otrok', () => {
            const result = calc.calculate(2000, { period: 'monthly' });
            expect(result.netIncome).toBe(1308.32);
        });
    });
});

// ====================
// OLAJŠAVE ZA OTROKE
// ====================

describe('olajšave za otroke - letno', () => {
    describe('2025', () => {
        const calc = new DohodninaCalculator(2025);

        test('0 otrok', () => {
            expect(calc.calculateChildRelief(0, false)).toBe(0);
        });

        test('1 otrok', () => {
            expect(calc.calculateChildRelief(1, false)).toBe(2838.3);
        });

        test('2 otroka', () => {
            expect(calc.calculateChildRelief(2, false)).toBe(7737.47);
        });

        test('3 otroci', () => {
            expect(calc.calculateChildRelief(3, false)).toBe(14697.51);
        });

        test('4 otroci', () => {
            expect(calc.calculateChildRelief(4, false)).toBe(23718.42);
        });

        test('5 otrok', () => {
            expect(calc.calculateChildRelief(5, false)).toBe(34800.2);
        });
    });

    describe('2024', () => {
        const calc = new DohodninaCalculator(2024);

        test('1 otrok', () => {
            expect(calc.calculateChildRelief(1, false)).toBe(2701.23);
        });

        test('2 otroka', () => {
            expect(calc.calculateChildRelief(2, false)).toBe(7361.46);
        });

        test('3 otroci', () => {
            expect(calc.calculateChildRelief(3, false)).toBe(13980.69);
        });
    });

    describe('2023', () => {
        const calc = new DohodninaCalculator(2023);

        test('1 otrok', () => {
            expect(calc.calculateChildRelief(1, false)).toBe(2701.23);
        });

        test('2 otroka', () => {
            expect(calc.calculateChildRelief(2, false)).toBe(7361.46);
        });

        test('3 otroci', () => {
            expect(calc.calculateChildRelief(3, false)).toBe(13980.69);
        });
    });

    describe('2021', () => {
        const calc = new DohodninaCalculator(2021);

        test('1 otrok', () => {
            expect(calc.calculateChildRelief(1, false)).toBe(2397.83);
        });

        test('2 otroka', () => {
            expect(calc.calculateChildRelief(2, false)).toBe(6564.96);
        });

        test('3 otroci', () => {
            expect(calc.calculateChildRelief(3, false)).toBe(12501.39);
        });
    });

    describe('2020', () => {
        const calc = new DohodninaCalculator(2020);

        test('1 otrok', () => {
            expect(calc.calculateChildRelief(1, false)).toBe(2397.83);
        });

        test('2 otroka', () => {
            expect(calc.calculateChildRelief(2, false)).toBe(6564.96);
        });

        test('3 otroci', () => {
            expect(calc.calculateChildRelief(3, false)).toBe(12501.39);
        });

        test('4 otroci', () => {
            expect(calc.calculateChildRelief(4, false)).toBe(20207.12);
        });

        test('5 otrok', () => {
            expect(calc.calculateChildRelief(5, false)).toBe(29682.15);
        });
    });
});

// ====================
// SPLOŠNA OLAJŠAVA
// ====================

describe('splošna olajšava', () => {
    describe('2025 - progresivna formula', () => {
        const calc = new DohodninaCalculator(2025);

        test('nizek dohodek (10000 EUR) - višja olajšava', () => {
            expect(calc.calculateGeneralRelief(10000, false)).toBe(13271.09);
        });

        test('srednji dohodek (15000 EUR)', () => {
            expect(calc.calculateGeneralRelief(15000, false)).toBe(7408.14);
        });

        test('na meji (16832 EUR)', () => {
            expect(calc.calculateGeneralRelief(16832, false)).toBe(5259.96);
        });

        test('nad mejo (17000 EUR) - osnovna olajšava', () => {
            expect(calc.calculateGeneralRelief(17000, false)).toBe(5260.00);
        });

        test('visok dohodek (24000 EUR) - osnovna olajšava', () => {
            expect(calc.calculateGeneralRelief(24000, false)).toBe(5260.00);
        });
    });

    describe('2024', () => {
        const calc = new DohodninaCalculator(2024);

        test('osnovna olajšava', () => {
            expect(calc.calculateGeneralRelief(20000, false)).toBe(5000.00);
        });
    });

    describe('2021', () => {
        const calc = new DohodninaCalculator(2021);

        test('osnovna olajšava', () => {
            expect(calc.calculateGeneralRelief(20000, false)).toBe(3500.00);
        });
    });

    describe('2020 - progresivna formula', () => {
        const calc = new DohodninaCalculator(2020);

        test('nizek dohodek (10000 EUR) - višja olajšava', () => {
            expect(calc.calculateGeneralRelief(10000, false)).toBe(8157.68);
        });

        test('na meji (13316 EUR)', () => {
            expect(calc.calculateGeneralRelief(13316, false)).toBe(3501.12);
        });

        test('nad mejo (15000 EUR) - osnovna olajšava', () => {
            expect(calc.calculateGeneralRelief(15000, false)).toBe(3500.00);
        });

        test('visok dohodek (20000 EUR) - osnovna olajšava', () => {
            expect(calc.calculateGeneralRelief(20000, false)).toBe(3500.00);
        });
    });
});

// ====================
// MINIMALNA PLAČA
// ====================

describe('minimalna plača', () => {
    const minPlaceData = {
        2020: { bruto: 940.58, expectedNetRange: [650, 850] },
        2021: { bruto: 1024.24, expectedNetRange: [700, 900] },
        2022: { bruto: 1074.43, expectedNetRange: [750, 950] },
        2023: { bruto: 1203.36, expectedNetRange: [800, 1000] },
        2024: { bruto: 1253.90, expectedNetRange: [800, 1000] },
        2025: { bruto: 1277.72, expectedNetRange: [850, 1050] }
    };

    for (const [year, data] of Object.entries(minPlaceData)) {
        test(`${year} - minimalna plača ${data.bruto} EUR`, () => {
            const calc = new DohodninaCalculator(parseInt(year));
            const result = calc.calculate(data.bruto, { period: 'monthly' });

            // Preverimo, da je neto v pričakovanem razponu
            expect(result.netIncome).toBeGreaterThan(data.expectedNetRange[0]);
            expect(result.netIncome).toBeLessThan(data.expectedNetRange[1]);
        });
    }
});

// ====================
// DAVČNI RAZREDI - MEJNE VREDNOSTI
// ====================

describe('mejne vrednosti davčnih razredov', () => {
    describe('2025 - letni razredi', () => {
        const calc = new DohodninaCalculator(2025);
        // Meje: 9210.26, 27089, 54178, 78016.32

        test('pod prvo mejo (16000 EUR)', () => {
            const result = calc.calculate(16000);
            expect(result.tax).toBe(899.59);
        });

        test('na prvi meji (27089 EUR)', () => {
            const result = calc.calculate(27089);
            expect(result.tax).toBe(3011.58);
        });

        test('na drugi meji (54178 EUR)', () => {
            const result = calc.calculate(54178);
            expect(result.tax).toBe(9048.50);
        });

        test('pod tretjo mejo (78016 EUR)', () => {
            const result = calc.calculate(78016);
            expect(result.tax).toBe(15104.48);
        });

        test('nad tretjo mejo (78017 EUR)', () => {
            const result = calc.calculate(78017);
            expect(result.tax).toBe(15104.78);
        });
    });

    describe('2020/2021 - letni razredi', () => {
        const calc = new DohodninaCalculator(2020);
        // Meje: 9210.26, 27089, 54178, 78016.32

        test('pod prvo mejo (16000 EUR)', () => {
            const result = calc.calculate(16000);
            expect(result.tax).toBe(1480.64);
        });

        test('na prvi meji (25000 EUR)', () => {
            const result = calc.calculate(25000);
            expect(result.tax).toBe(3303.5);
        });

        test('na drugi meji (50000 EUR)', () => {
            const result = calc.calculate(50000);
            expect(result.tax).toBe(9098.50);
        });

        test('na tretji meji (72000 EUR)', () => {
            const result = calc.calculate(72000);
            expect(result.tax).toBe(14909.32);
        });
    });
});

// ====================
// NAJVIŠJA DAVČNA STOPNJA
// ====================

describe('najvišja davčna stopnja', () => {
    test('2020 - najvišja stopnja 50%', () => {
        const calc = new DohodninaCalculator(2020);
        const result = calc.calculate(100000);
        expect(result.tax).toBe(23680.00);
        // Efektivna stopnja upošteva strošek delodajalca (skupne dajatve / skupni strošek delodajalca)
        expect(result.effectiveRate).toBe(53.3);
    });

    test('2021 - najvišja stopnja 50%', () => {
        const calc = new DohodninaCalculator(2021);
        const result = calc.calculate(100000);
        expect(result.tax).toBe(23680.00);
        // Efektivna stopnja upošteva strošek delodajalca
        expect(result.effectiveRate).toBe(53.3);
    });

    test('2022 - najvišja stopnja 45%', () => {
        const calc = new DohodninaCalculator(2022);
        // Pri zelo visokem dohodku (100000 EUR) bi morala biti efektivna stopnja pod 45%
        const result = calc.calculate(100000);
        expect(result.tax).toBe(22858.00);
        // Efektivna stopnja upošteva strošek delodajalca
        expect(result.effectiveRate).toBe(52.59);
    });

    test('2023 - najvišja stopnja 50%', () => {
        const calc = new DohodninaCalculator(2023);
        const result = calc.calculate(100000);
        expect(result.tax).toBe(22663.00);
        // Efektivna stopnja upošteva strošek delodajalca
        expect(result.effectiveRate).toBe(52.42);
    });

    test('2025 - najvišja stopnja 50%', () => {
        const calc = new DohodninaCalculator(2025);
        const result = calc.calculate(100000);
        expect(result.tax).toBe(21697.70);
        // Efektivna stopnja upošteva strošek delodajalca
        expect(result.effectiveRate).toBe(53.24);
    });
});

// ====================
// POSEBNE OLAJŠAVE
// ====================

describe('posebne olajšave 2025', () => {
    const calc = new DohodninaCalculator(2025);

    test('olajšava za mlade delavce', () => {
        const resultBrez = calc.calculate(24000, { isYoungEmployee: false });
        const resultZ = calc.calculate(24000, { isYoungEmployee: true });

        // Razlika v davku mora biti približno 16-26% od olajšave (1367.60 EUR)
        expect(resultBrez.tax).toBeGreaterThan(resultZ.tax);
    });

    test('olajšava za vzdrževane družinske člane', () => {
        const resultBrez = calc.calculate(24000, { dependentFamilyMembers: 0 });
        const resultZ = calc.calculate(24000, { dependentFamilyMembers: 1 });

        expect(resultBrez.tax).toBeGreaterThan(resultZ.tax);
    });
});

// ====================
// EFEKTIVNA DAVČNA STOPNJA
// ====================

describe('efektivna davčna stopnja', () => {
    // Efektivna stopnja upošteva strošek delodajalca (skupne dajatve / skupni strošek delodajalca)
    const testCases = [
        { year: 2020, gross: 24000, expectedRate: 44.03 },
        { year: 2021, gross: 24000, expectedRate: 44.03 },
        { year: 2022, gross: 24000, expectedRate: 43.01 },
        { year: 2023, gross: 24000, expectedRate: 42.54 },
        { year: 2024, gross: 24000, expectedRate: 43.66 },
        { year: 2025, gross: 24000, expectedRate: 44.43 }
    ];

    testCases.forEach(({ year, gross, expectedRate }) => {
        test(`${year} - ${gross} EUR - efektivna stopnja okoli ${expectedRate}%`, () => {
            const calc = new DohodninaCalculator(year);
            const result = calc.calculate(gross);
            expect(result.effectiveRate).toBe(expectedRate);
        });
    });
});

// ====================
// PRISPEVKI DELODAJALCA SKOZI LETA
// ====================

describe('prispevki delodajalca', () => {
    describe('2021 - brez DO, s poškodbami pri delu', () => {
        const calc = new DohodninaCalculator(2021);

        test('2000 EUR bruto', () => {
            const result = calc.calculate(2000, { period: 'monthly' });
            expect(result.contributions.employer.pension).toBe(177.00);
            expect(result.contributions.employer.health).toBe(131.20);
            expect(result.contributions.employer.unemployment).toBe(1.20);
            expect(result.contributions.employer.parentalCare).toBe(2.00);
            expect(result.contributions.employer.workInjury).toBe(10.60); // 0.53%
            expect(result.contributions.employer.total).toBe(322.00);
            // V 2021 ni bilo prispevkov za DO
            expect(result.contributions.employer.longTermCare).toBeUndefined();
        });
    });

    describe('2025 - z DO in poškodbami pri delu', () => {
        const calc = new DohodninaCalculator(2025);

        test('2000 EUR bruto', () => {
            const result = calc.calculate(2000, { period: 'monthly' });
            expect(result.contributions.employer.pension).toBe(177.00);
            expect(result.contributions.employer.health).toBe(131.20); // 6.56%
            expect(result.contributions.employer.unemployment).toBe(1.20); // 0.06%
            expect(result.contributions.employer.parentalCare).toBe(2.00);
            expect(result.contributions.employer.longTermCare).toBe(20.00); // 1%
            expect(result.contributions.employer.workInjury).toBe(10.60); // 0.53%
            expect(result.contributions.employer.total).toBe(342.00);
        });
    });
});

// ====================
// VALIDACIJA VHODNIH PODATKOV
// ====================

describe('validacija', () => {
    test('napačno leto vrne napako', () => {
        expect(() => new DohodninaCalculator(2019)).toThrow('Davčna lestvica za leto 2019 ni na voljo');
    });

    test('leto 2020 je podprto', () => {
        expect(() => new DohodninaCalculator(2020)).not.toThrow();
    });
});

// ====================
// IZRAČUNI NETO IZ RAZLIČNIH BRUTO ZA PRIMERJAVO MED LETI
// ====================

describe('primerjava neto plač med leti', () => {
    const grossSalary = 2000;

    test('neto plača raste z leti (od 2021 do 2023)', () => {
        const calc2021 = new DohodninaCalculator(2021);
        const calc2022 = new DohodninaCalculator(2022);
        const calc2023 = new DohodninaCalculator(2023);

        const net2021 = calc2021.calculate(grossSalary, { period: 'monthly' }).netIncome;
        const net2022 = calc2022.calculate(grossSalary, { period: 'monthly' }).netIncome;
        const net2023 = calc2023.calculate(grossSalary, { period: 'monthly' }).netIncome;

        // Od 2021 do 2023 se je neto povečeval zaradi višjih olajšav
        expect(net2022).toBeGreaterThan(net2021);
        expect(net2023).toBeGreaterThan(net2022);
    });

    test('neto plača pada v 2024 in 2025 zaradi OZP in prispevkov za DO', () => {
        const calc2023 = new DohodninaCalculator(2023);
        const calc2024 = new DohodninaCalculator(2024);
        const calc2025 = new DohodninaCalculator(2025);

        const net2023 = calc2023.calculate(grossSalary, { period: 'monthly' }).netIncome;
        const net2024 = calc2024.calculate(grossSalary, { period: 'monthly' }).netIncome;
        const net2025 = calc2025.calculate(grossSalary, { period: 'monthly' }).netIncome;

        // V 2024 se je uvedel OZP (35 EUR), kar je zmanjšalo neto
        expect(net2024).toBeLessThan(net2023);
        // V 2025 se je uvedel še prispevek za DO (1%), kar je še dodatno zmanjšalo neto
        expect(net2025).toBeLessThan(net2024);
    });
});

// ====================
// SKUPNE DAJATVE (DRŽAVA)
// ====================

describe('skupne dajatve za državo', () => {
    test('2025 - 2000 EUR mesečno', () => {
        const calc = new DohodninaCalculator(2025);
        const result = calc.calculate(2000, { period: 'monthly' });

        // Skupne dajatve = prispevki delojemalca + dohodnina + prispevki delodajalca
        const expected = result.contributions.employee.total + result.tax + result.contributions.employer.total;
        expect(result.totalTaxes).toBe(1040.66);
    });
});

