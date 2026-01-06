/**
 * Analiza efektivnih stopenj obdavčitve 2020-2025
 *
 * Izračun efektivne stopnje za vse mejne zneske dohodninske lestvice
 * in višje letne bruto dohodke.
 */

import { DohodninaCalculator } from '../index.js';
import WAGES from '../wages.js';
import TAX_BRACKETS from '../brackets.js';
import SOCIAL_CONTRIBUTIONS from '../social.js';

// Minimalne plače po letih (letno)

// Testni letni bruto dohodki (prilagojeni minimalni plači 2025 = 15.332,64 €)
const testAmounts = [
  15333,   // Minimalna plača 2025 (zaokroženo)
  18000,   // 1.5x minimalna
  20000,   // Srednje nizek
  24000,   // Povprečna plača ~2000€/mesec
  25000,   // Mejnik 2. razred (2020-2021)
  30000,   // Srednji dohodek
  36000,   // 3000€/mesec
  40000,   // Višji srednji
  48000,   // 4000€/mesec
  50000,   // Mejnik 3. razred (2020-2021)
  60000,   // Visok dohodek
  72000,   // Mejnik 4. razred (2020-2021)
  80000,   // Zelo visok
  100000,  // Najvišji razred
  150000,  // Ultra visok
];

const years = [2020, 2021, 2022, 2023, 2024, 2025];

console.log('═══════════════════════════════════════════════════════════════════════════════════════════════');
console.log('                    ANALIZA EFEKTIVNIH STOPENJ OBDAVČITVE 2020-2025');
console.log('═══════════════════════════════════════════════════════════════════════════════════════════════\n');

// Pregled davčnih lestvic po letih
console.log('📊 DAVČNE LESTVICE PO LETIH (letne neto davčne osnove v EUR)\n');
console.log('─'.repeat(95));

for (const year of years) {
  const brackets = TAX_BRACKETS[year].annual;
  console.log(`\n📅 ${year}:`);
  console.log('┌─────────────────────────────────────────────────────────────────────────┐');
  console.log('│  Razred  │      Od (EUR)   │      Do (EUR)   │  Stopnja  │  Fiksni davek │');
  console.log('├─────────────────────────────────────────────────────────────────────────┤');

  brackets.forEach((bracket, idx) => {
    const from = bracket.from.toFixed(2).padStart(12);
    const to = bracket.to === Infinity ? '        ∞' : bracket.to.toFixed(2).padStart(12);
    const rate = (bracket.rate * 100).toFixed(0).padStart(5) + '%';
    const fixedTax = bracket.fixedTax.toFixed(2).padStart(11);
    console.log(`│    ${idx + 1}.    │ ${from}    │ ${to}    │   ${rate}   │ ${fixedTax} €  │`);
  });

  console.log('└─────────────────────────────────────────────────────────────────────────┘');
}

// Tabela efektivnih stopenj
console.log('\n\n═══════════════════════════════════════════════════════════════════════════════════════════════');
console.log('             EFEKTIVNA STOPNJA OBDAVČITVE (% celotnega stroška delodajalca)');
console.log('═══════════════════════════════════════════════════════════════════════════════════════════════');
console.log('\nEfektivna stopnja = (Prispevki delojemalca + OZP + Dohodnina + Prispevki delodajalca) / Strošek delodajalca × 100\n');

// Header row
let header = '│ Bruto letno │';
for (const year of years) {
  header += ` ${year}    │`;
}
console.log('┌─────────────' + '─────────┬'.repeat(years.length - 1) + '─────────┐');
console.log(header);
console.log('├─────────────' + '─────────┼'.repeat(years.length - 1) + '─────────┤');

for (const amount of testAmounts) {
  let row = `│ ${amount.toLocaleString('sl-SI').padStart(10)} € │`;

  for (const year of years) {
    try {
      const calc = new DohodninaCalculator(year);
      const result = calc.calculate(amount, { period: 'annual' });
      const effectiveRate = result.effectiveRate.toFixed(2).padStart(5) + '% │';
      row += ` ${effectiveRate}`;
    } catch (e) {
      row += '    N/A │';
    }
  }

  console.log(row);
}

console.log('└─────────────' + '─────────┴'.repeat(years.length - 1) + '─────────┘');

// Podrobna tabela za vsako leto
console.log('\n\n═══════════════════════════════════════════════════════════════════════════════════════════════');
console.log('                         PODROBNI IZRAČUNI PO LETIH');
console.log('═══════════════════════════════════════════════════════════════════════════════════════════════');

for (const year of years) {
  console.log(`\n\n📅 LETO ${year}`);
  console.log('─'.repeat(130));

  const calc = new DohodninaCalculator(year);

  console.log('┌────────────┬────────────┬────────────┬────────────┬────────────┬────────────┬────────────┬────────────┬────────────┐');
  console.log('│   Bruto    │  Prispevki │     OZP    │  Olajšava  │ Dav. osn.  │  Dohodnina │    Neto    │  Strošek   │  Efektivna │');
  console.log('│   letno    │  delojema. │   (letno)  │  skupna    │            │            │   letno    │ delodajalca│   stopnja  │');
  console.log('├────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┤');

  for (const amount of testAmounts) {
    try {
      const result = calc.calculate(amount, { period: 'annual' });

      const bruto = amount.toFixed(0).padStart(9) + ' €';
      const prispevki = result.contributions.employee.total.toFixed(0).padStart(9) + ' €';
      const ozp = (result.healthInsuranceFee || 0).toFixed(0).padStart(9) + ' €';
      const olajsava = result.reliefs.total.toFixed(0).padStart(9) + ' €';
      const davOsn = result.taxBase.toFixed(0).padStart(9) + ' €';
      const dohodnina = result.tax.toFixed(0).padStart(9) + ' €';
      const neto = result.netIncome.toFixed(0).padStart(9) + ' €';
      const strosek = result.totalCostForEmployer.toFixed(0).padStart(9) + ' €';
      const efektivna = result.effectiveRate.toFixed(2).padStart(7) + ' %';

      console.log(`│ ${bruto} │ ${prispevki} │ ${ozp} │ ${olajsava} │ ${davOsn} │ ${dohodnina} │ ${neto} │ ${strosek} │ ${efektivna} │`);
    } catch (e) {
      console.log(`│ ${amount.toFixed(0).padStart(9)} € │     NAPAKA: ${e.message.substring(0, 80)} │`);
    }
  }

  console.log('└────────────┴────────────┴────────────┴────────────┴────────────┴────────────┴────────────┴────────────┴────────────┘');
}

// Primerjava sprememb po letih za isti bruto dohodek
console.log('\n\n═══════════════════════════════════════════════════════════════════════════════════════════════');
console.log('                  PRIMERJAVA NETO PLAČ IN SPREMEMB 2020-2025');
console.log('═══════════════════════════════════════════════════════════════════════════════════════════════\n');

console.log('┌────────────┬────────────┬────────────┬────────────┬────────────┬────────────┬────────────┐');
console.log('│   Bruto    │   2020     │   2021     │   2022     │   2023     │   2024     │   2025     │');
console.log('│   letno    │   Neto     │   Neto     │   Neto     │   Neto     │   Neto     │   Neto     │');
console.log('├────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┤');

for (const amount of testAmounts) {
  let row = `│ ${amount.toFixed(0).padStart(9)} € │`;

  for (const year of years) {
    try {
      const calc = new DohodninaCalculator(year);
      const result = calc.calculate(amount, { period: 'annual' });
      row += ` ${result.netIncome.toFixed(0).padStart(9)} € │`;
    } catch (e) {
      row += '        N/A │';
    }
  }

  console.log(row);
}

console.log('└────────────┴────────────┴────────────┴────────────┴────────────┴────────────┴────────────┘');

// Tabela z natančnimi mejnimi zneski
console.log('\n\n═══════════════════════════════════════════════════════════════════════════════════════════════');
console.log('           EFEKTIVNE STOPNJE NA TOČNIH MEJNIH ZNESKIH DAVČNE LESTVICE');
console.log('═══════════════════════════════════════════════════════════════════════════════════════════════\n');

// Zberi vse unikatne mejne zneske
const allThresholds = new Set();
for (const year of years) {
  const brackets = TAX_BRACKETS[year].annual;
  brackets.forEach(b => {
    if (b.to !== Infinity) {
      allThresholds.add(b.to);
    }
  });
}

// Dodaj še nekaj višjih vrednosti
[80000, 100000, 120000, 150000].forEach(v => allThresholds.add(v));

const sortedThresholds = Array.from(allThresholds).sort((a, b) => a - b);

for (const threshold of sortedThresholds) {
  console.log(`\n💰 Letni bruto dohodek: ${threshold.toLocaleString('sl-SI')} €`);
  console.log('┌──────┬────────────┬────────────┬────────────┬────────────┬────────────┬────────────┐');
  console.log('│ Leto │ Prispevki  │     OZP    │  Dohodnina │    Neto    │  Efektivna │ Max stopnja│');
  console.log('├──────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┤');

  for (const year of years) {
    try {
      const calc = new DohodninaCalculator(year);
      const result = calc.calculate(threshold, { period: 'annual' });

      // Poišči max stopnjo za ta dohodek
      const brackets = TAX_BRACKETS[year].annual;
      let maxRate = 0;
      for (const bracket of brackets) {
        if (result.taxBase >= bracket.from) {
          maxRate = bracket.rate;
        }
      }

      const prispevki = result.contributions.employee.total.toFixed(0).padStart(9) + ' €';
      const ozp = (result.healthInsuranceFee || 0).toFixed(0).padStart(9) + ' €';
      const dohodnina = result.tax.toFixed(0).padStart(9) + ' €';
      const neto = result.netIncome.toFixed(0).padStart(9) + ' €';
      const efektivna = result.effectiveRate.toFixed(2).padStart(7) + ' %';
      const maxRateStr = (maxRate * 100).toFixed(0).padStart(8) + ' %';

      console.log(`│ ${year} │ ${prispevki} │ ${ozp} │ ${dohodnina} │ ${neto} │ ${efektivna} │ ${maxRateStr} │`);
    } catch (e) {
      console.log(`│ ${year} │     Pod minimalno plačo - ni izračuna                                          │`);
    }
  }

  console.log('└──────┴────────────┴────────────┴────────────┴────────────┴────────────┴────────────┘');
}

// Povzetek sprememb
console.log('\n\n═══════════════════════════════════════════════════════════════════════════════════════════════');
console.log('                              POVZETEK KLJUČNIH SPREMEMB');
console.log('═══════════════════════════════════════════════════════════════════════════════════════════════\n');

console.log('📌 2020: Nova davčna lestvica, splošna olajšava 3.500 €, max stopnja 50%');
console.log('📌 2021: Enako kot 2020');
console.log('📌 2022: Usklajeni zneski (+3%), splošna olajšava 4.500 €, max stopnja ZAČASNO 45%');
console.log('📌 2023: Max stopnja vrnjena na 50%, splošna olajšava 5.000 €');
console.log('📌 2024: Uveden OZP 35 €/mesec (420 €/leto), splošna olajšava 5.000 €');
console.log('📌 2025: Usklajeni zneski (+5,2%), splošna olajšava 5.260 €, OZP 37,17 €/mesec, prispevek DO 1%');

console.log('\n\n═══════════════════════════════════════════════════════════════════════════════════════════════');
console.log('                    PRISPEVKI DELOJEMALCA IN DELODAJALCA PO LETIH');
console.log('═══════════════════════════════════════════════════════════════════════════════════════════════\n');

console.log('┌──────┬────────────┬────────────┬────────────┬────────────┐');
console.log('│ Leto │ Delojemal. │ Delodajalec│ OZP mesečni│   Skupaj   │');
console.log('├──────┼────────────┼────────────┼────────────┼────────────┤');

for (const year of years) {
  const emp = SOCIAL_CONTRIBUTIONS[year].employee;
  const empr = SOCIAL_CONTRIBUTIONS[year].employer;
  const ozp = SOCIAL_CONTRIBUTIONS[year].healthInsuranceFee || 0;

  let empTotal = Object.values(emp).reduce((a, b) => a + b, 0);
  let emprTotal = 0;
  for (const [key, val] of Object.entries(empr)) {
    if (!key.includes('Before')) {
      emprTotal += val;
    }
  }

  const empStr = (empTotal * 100).toFixed(2).padStart(8) + ' %';
  const emprStr = (emprTotal * 100).toFixed(2).padStart(8) + ' %';
  const ozpStr = ozp.toFixed(2).padStart(8) + ' €';
  const skupaj = ((empTotal + emprTotal) * 100).toFixed(2).padStart(8) + ' %';

  console.log(`│ ${year} │ ${empStr} │ ${emprStr} │ ${ozpStr} │ ${skupaj} │`);
}

console.log('└──────┴────────────┴────────────┴────────────┴────────────┘');

// Efektivne stopnje pri MINIMALNI PLAČI za vsako leto
console.log('\n\n═══════════════════════════════════════════════════════════════════════════════════════════════');
console.log('                    EFEKTIVNE STOPNJE PRI MINIMALNI PLAČI');
console.log('═══════════════════════════════════════════════════════════════════════════════════════════════\n');

console.log('┌──────┬────────────┬────────────┬────────────┬────────────┬────────────┬────────────┬────────────┬────────────┐');
console.log('│ Leto │ Min. bruto │  Strošek   │  Prispevki │  Dohodnina │    Neto    │  Efektivna │  Neto %    │  Neto %    │');
console.log('│      │   (letno)  │ delodajalca│  + OZP     │            │   letno    │   stopnja  │  od bruto  │ od stroška │');
console.log('├──────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┤');

for (const year of years) {
  try {
    const calc = new DohodninaCalculator(year);
    const minWage = WAGES[year].min;
    const result = calc.calculate(minWage, { period: 'annual' });

    const minWageStr = minWage.toFixed(0).padStart(8) + ' €';
    const strosekDelod = result.totalCostForEmployer.toFixed(0).padStart(8) + ' €';
    const prispevkiOzp = (result.contributions.employee.total).toFixed(0).padStart(8) + ' €';
    const dohodnina = result.tax.toFixed(0).padStart(8) + ' €';
    const neto = result.netIncome.toFixed(0).padStart(8) + ' €';
    const efektivna = result.effectiveRate.toFixed(2).padStart(8) + ' %';
    const netoPercentBruto = ((result.netIncome / minWage) * 100).toFixed(1).padStart(8) + ' %';
    const netoPercentStrosek = ((result.netIncome / result.totalCostForEmployer) * 100).toFixed(1).padStart(8) + ' %';

    console.log(`│ ${year} │ ${minWageStr} │ ${strosekDelod} │ ${prispevkiOzp} │ ${dohodnina} │ ${neto} │ ${efektivna} │ ${netoPercentBruto} │ ${netoPercentStrosek} │`);
  } catch (e) {
    console.log(`│ ${year} │     NAPAKA: ${e.message.substring(0, 70)} │`);
  }
}

console.log('└──────┴────────────┴────────────┴────────────┴────────────┴────────────┴────────────┴────────────┴────────────┘');

// Mesečna primerjava minimalnih plač
console.log('\n\n═══════════════════════════════════════════════════════════════════════════════════════════════');
console.log('                    MESEČNA MINIMALNA PLAČA - NETO PRIMERJAVA');
console.log('═══════════════════════════════════════════════════════════════════════════════════════════════\n');

console.log('┌──────┬────────────┬────────────┬────────────┬────────────┬────────────┬────────────┐');
console.log('│ Leto │ Min. bruto │  Strošek   │  Prispevki │  Dohodnina │ Min. neto  │ Sprememba  │');
console.log('│      │  (mesečno) │ delodajalca│  + OZP     │            │  (mesečno) │  od 2020   │');
console.log('├──────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┤');

let neto2020 = 0;
for (const year of years) {
  try {
    const calc = new DohodninaCalculator(year);
    const minWageMonthly = WAGES[year].min / 12;
    const result = calc.calculate(minWageMonthly, { period: 'monthly' });

    const brutoStr = minWageMonthly.toFixed(2).padStart(8) + ' €';
    const strosekDelod = result.totalCostForEmployer.toFixed(2).padStart(8) + ' €';
    const prispevkiOzp = (result.contributions.employee.total).toFixed(2).padStart(8) + ' €';
    const dohodnina = result.tax.toFixed(2).padStart(8) + ' €';
    const netoStr = result.netIncome.toFixed(2).padStart(8) + ' €';

    if (year === 2020) {
      neto2020 = result.netIncome;
    }
    const sprememba = result.netIncome - neto2020;
    const spremembaStr = (sprememba >= 0 ? '+' : '') + sprememba.toFixed(2).padStart(7) + ' €';

    console.log(`│ ${year} │ ${brutoStr} │ ${strosekDelod} │ ${prispevkiOzp} │ ${dohodnina} │ ${netoStr} │ ${spremembaStr} │`);
  } catch (e) {
    console.log(`│ ${year} │     NAPAKA: ${e.message.substring(0, 60)} │`);
  }
}

console.log('└──────┴────────────┴────────────┴────────────┴────────────┴────────────┴────────────┘');

console.log('\n✅ Analiza končana.\n');
