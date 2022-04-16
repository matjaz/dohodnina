const { 
    letna_dohodnina_razred,
    izracunaj_dohodnino,
} = require('./')

test('razredi lestvice', () => {
  expect(letna_dohodnina_razred(2022, 8500)).toBe(16)
  expect(letna_dohodnina_razred(2022, 25000)).toBe(26)
  expect(letna_dohodnina_razred(2022, 50000)).toBe(33)
  expect(letna_dohodnina_razred(2022, 72000)).toBe(39)
  expect(letna_dohodnina_razred(2022, 100000)).toBe(45)
  expect(letna_dohodnina_razred(2021, 100000)).toBe(50)
})

describe('osnovna dohodnina', () => {
    test('2021', () => {
        expect(izracunaj_dohodnino(2021, 8500)).toBe(0)
        expect(izracunaj_dohodnino(2021, 24000)).toBe(3100.96) // 258,41/m
    })

    test('2022', () => {
        expect(izracunaj_dohodnino(2022, 8500)).toBe(0)
        expect(izracunaj_dohodnino(2022, 24000)).toBe(2815.46) // 234,62/m
    })

    test('2023', () => {
        expect(izracunaj_dohodnino(2023, 8500)).toBe(0)
        expect(izracunaj_dohodnino(2023, 24000)).toBe(2529.96) // 210,83/m
    })

    test('2024', () => {
        expect(izracunaj_dohodnino(2024, 8500)).toBe(0)
        expect(izracunaj_dohodnino(2024, 24000)).toBe(2244.46) // 187,04/m
    })

    test('2025', () => {
        expect(izracunaj_dohodnino(2025, 8500)).toBe(0)
        expect(izracunaj_dohodnino(2025, 24000)).toBe(1958.96) // 163,25/m
    })
})

describe('dohodnina 1 otrok', () => {
    test('2021', () => {
        expect(izracunaj_dohodnino(2021, 8500, 1)).toBe(0)
        expect(izracunaj_dohodnino(2021, 24000, 1)).toBe(2467.36) // 205,61/m
    })

    test('2022', () => {
        expect(izracunaj_dohodnino(2022, 8500, 1)).toBe(0)
        expect(izracunaj_dohodnino(2022, 24000, 1)).toBe(2162.85) // 180,24/m
    })

    test('2023', () => {
        expect(izracunaj_dohodnino(2023, 8500, 1)).toBe(0)
        expect(izracunaj_dohodnino(2023, 24000, 1)).toBe(1858.34) // 154,86/m
    })

    test('2024', () => {
        expect(izracunaj_dohodnino(2024, 8500, 1)).toBe(0)
        expect(izracunaj_dohodnino(2024, 24000, 1)).toBe(1553.84) // 129,49/m
    })

    test('2025', () => {
        expect(izracunaj_dohodnino(2025, 8500, 1)).toBe(0)
        expect(izracunaj_dohodnino(2025, 24000, 1)).toBe(1354.66) // 112,89/m
    })
})

describe('dohodnina 1 vzdrževan član', () => {
    test('2021', () => {
        expect(izracunaj_dohodnino(2021, 8500, 0, 1)).toBe(0)
        expect(izracunaj_dohodnino(2021, 24000, 0, 1)).toBe(2467.36) // 205,61/m
    })

    test('2022', () => {
        expect(izracunaj_dohodnino(2022, 8500, 0, 1)).toBe(0)
        expect(izracunaj_dohodnino(2022, 24000, 0, 1)).toBe(2162.85) // 180,24/m
    })

    test('2023', () => {
        expect(izracunaj_dohodnino(2023, 8500, 0, 1)).toBe(0)
        expect(izracunaj_dohodnino(2023, 24000, 0, 1)).toBe(1858.34) // 154,86/m
    })

    test('2024', () => {
        expect(izracunaj_dohodnino(2024, 8500, 0, 1)).toBe(0)
        expect(izracunaj_dohodnino(2024, 24000, 0, 1)).toBe(1553.84) // 129,49/m
    })

    test('2025', () => {
        expect(izracunaj_dohodnino(2025, 8500, 0, 1)).toBe(0)
        expect(izracunaj_dohodnino(2025, 24000, 0, 1)).toBe(1354.66) // 112,89/m
    })
})
