import { DohodninaCalculator } from '../index.js';

describe('osnovna dohodnina', () => {
    test('2021', () => {
        const calc = new DohodninaCalculator(2021)
        expect(calc.calculate(16000).tax).toBe(1480.64)
        expect(calc.calculate(24000).tax).toBe(3100.96)
    })

    test('2022', () => {
        const calc = new DohodninaCalculator(2022)
        expect(calc.calculate(16000).tax).toBe(1274.24)
        expect(calc.calculate(24000).tax).toBe(2815.46)
    })

    test('2023', () => {
        const calc = new DohodninaCalculator(2023)
        expect(calc.calculate(16000).tax).toBe(1194.24)
        expect(calc.calculate(24000).tax).toBe(2685.46)
    })

    test('2024', () => {
        const calc = new DohodninaCalculator(2024)
        expect(calc.calculate(16000).tax).toBe(1127.04)
        expect(calc.calculate(24000).tax).toBe(2576.26)
    })

    test('2025', () => {
        const calc = new DohodninaCalculator(2025)
        expect(calc.calculate(16000).tax).toBe(899.59)
        expect(calc.calculate(24000).tax).toBe(2393.96)
    })
})

describe('dohodnina 1 otrok', () => {
    test('2021', () => {
        const calc = new DohodninaCalculator(2021)
        expect(calc.calculate(16000, { numberOfChildren: 1 }).tax).toBe(1050.59)
        expect(calc.calculate(24000, { numberOfChildren: 1 }).tax).toBe(2477.52)
    })

    test('2022', () => {
        const calc = new DohodninaCalculator(2022)
        expect(calc.calculate(16000, { numberOfChildren: 1 }).tax).toBe(880.55)
        expect(calc.calculate(24000, { numberOfChildren: 1 }).tax).toBe(2175.71)
    })

    test('2023', () => {
        const calc = new DohodninaCalculator(2023)
        expect(calc.calculate(16000, { numberOfChildren: 1 }).tax).toBe(762.04)
        expect(calc.calculate(24000, { numberOfChildren: 1 }).tax).toBe(1983.14)
    })

    test('2024', () => {
        const calc = new DohodninaCalculator(2024)
        expect(calc.calculate(16000, { numberOfChildren: 1 }).tax).toBe(694.84)
        expect(calc.calculate(24000, { numberOfChildren: 1 }).tax).toBe(1873.94)
    })

    test('2025', () => {
        const calc = new DohodninaCalculator(2025)
        expect(calc.calculate(16000, { numberOfChildren: 1 }).tax).toBe(445.46)
        expect(calc.calculate(24000, { numberOfChildren: 1 }).tax).toBe(1656.00)
    })
})

describe('mesečni izračuni 2025', () => {
    const calc = new DohodninaCalculator(2025)

    test('2000 EUR mesečno brez otrok', () => {
        const result = calc.calculate(2000, { period: 'monthly' })

        // Prispevki delojemalca
        expect(result.contributions.employee.pension).toBe(310.00)
        expect(result.contributions.employee.health).toBe(127.20)
        expect(result.contributions.employee.unemployment).toBe(2.80)
        expect(result.contributions.employee.parentalCare).toBe(2.00)
        expect(result.contributions.employee.longTermCare).toBe(20.00)
        expect(result.healthInsuranceFee).toBe(37.17)
        expect(result.contributions.employee.total).toBe(499.17)

        // Olajšave
        expect(result.reliefs.general).toBe(438.33)
        expect(result.reliefs.total).toBe(438.33)

        // Dohodnina
        expect(result.taxBase).toBe(1062.50)
        expect(result.tax).toBe(199.49)

        // Neto
        expect(result.netIncome).toBe(1301.34)

        // Prispevki delodajalca
        expect(result.contributions.employer.pension).toBe(177.00)
        expect(result.contributions.employer.health).toBe(131.20)
        expect(result.contributions.employer.unemployment).toBe(1.20)
        expect(result.contributions.employer.parentalCare).toBe(2.00)
        expect(result.contributions.employer.workInjury).toBe(10.60)
        expect(result.contributions.employer.longTermCare).toBe(20.00)
        expect(result.contributions.employer.total).toBe(342.00)

        // Stroški
        expect(result.totalCostForEmployer).toBe(2342.00)
        expect(result.totalTaxes).toBe(1040.66)
    })

    test('2000 EUR mesečno z 1 otrokom', () => {
        const result = calc.calculate(2000, { period: 'monthly', numberOfChildren: 1 })

        // Prispevki delojemalca
        expect(result.contributions.employee.total).toBe(499.17)

        // Olajšave
        expect(result.reliefs.general).toBe(438.33)
        expect(result.reliefs.children).toBe(236.53)
        expect(result.reliefs.total).toBe(674.86)

        // Dohodnina
        expect(result.taxBase).toBe(825.97)
        expect(result.tax).toBe(138.00)

        // Neto
        expect(result.netIncome).toBe(1362.83)
    })

    test('3500 EUR mesečno z 1 otrokom', () => {
        const result = calc.calculate(3500, { period: 'monthly', numberOfChildren: 1 })

        // Prispevki delojemalca
        expect(result.contributions.employee.health).toBe(222.60)
        expect(result.healthInsuranceFee).toBe(37.17)
        expect(result.contributions.employee.pension).toBe(542.50)
        expect(result.contributions.employee.unemployment).toBe(4.90)
        expect(result.contributions.employee.parentalCare).toBe(3.50)
        expect(result.contributions.employee.longTermCare).toBe(35.00)
        expect(result.contributions.employee.total).toBe(845.67)

        // Olajšave
        expect(result.reliefs.general).toBe(438.33)
        expect(result.reliefs.children).toBe(236.53)
        expect(result.reliefs.total).toBe(674.86)

        // Dohodnina
        expect(result.taxBase).toBe(1979.47)
        expect(result.tax).toBe(437.91)

        // Neto
        expect(result.netIncome).toBe(2216.42)

        // Prispevki delodajalca
        expect(result.contributions.employer.health).toBe(229.60)
        expect(result.contributions.employer.pension).toBe(309.75)
        expect(result.contributions.employer.unemployment).toBe(2.10)
        expect(result.contributions.employer.parentalCare).toBe(3.50)
        expect(result.contributions.employer.workInjury).toBe(18.55)
        expect(result.contributions.employer.longTermCare).toBe(35.00)
        expect(result.contributions.employer.total).toBe(598.50)

        // Stroški
        expect(result.totalCostForEmployer).toBe(4098.50)
        expect(result.totalTaxes).toBe(1882.08)
    })
})
