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

test('dohodnina 2021', () => {
    expect(izracunaj_dohodnino(2021, 8500)).toBe(0)
    expect(izracunaj_dohodnino(2021, 24000)).toBe(3100.96) // 258,41/m
})

test('dohodnina 2022', () => {
    expect(izracunaj_dohodnino(2022, 8500)).toBe(0)
    expect(izracunaj_dohodnino(2022, 24000)).toBe(2840.96) // 236,75/m
})

test('dohodnina 2023', () => {
    expect(izracunaj_dohodnino(2023, 8500)).toBe(0)
    expect(izracunaj_dohodnino(2023, 24000)).toBe(2580.96) // 215,08/m
})

test('dohodnina 2024', () => {
    expect(izracunaj_dohodnino(2024, 8500)).toBe(0)
    expect(izracunaj_dohodnino(2024, 24000)).toBe(2320.96) // 193,41/m
})

test('dohodnina 2025', () => {
    expect(izracunaj_dohodnino(2025, 8500)).toBe(0)
    expect(izracunaj_dohodnino(2025, 24000)).toBe(2060.96) // 171,75/m
})
