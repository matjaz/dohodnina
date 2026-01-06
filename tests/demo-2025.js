import { DohodninaCalculator } from '../index.js';

// DEMO: Izračun za Slovenijo 2025
console.log('=================================================================');
console.log('         IZRAČUN PLAČE ZA SLOVENIJO 2025');
console.log('=================================================================\n');

const calc = new DohodninaCalculator(2025);

// Test 1: 2000 EUR mesečno (brez otrok)
console.log('1. PRIMER: 2000 EUR mesečna bruto plača (brez otrok)');
console.log('-----------------------------------------------------------------');
const test1 = calc.calculate(2000, { period: 'monthly' });

console.log(`Bruto plača:                           ${test1.grossIncome.toFixed(2)} EUR`);
console.log(`\nPrispevki delojemalca:`);
console.log(`  - Pokojninsko zavarovanje (15,5%):   ${test1.contributions.employee.pension.toFixed(2)} EUR`);
console.log(`  - Zdravstveno zavarovanje (6,36%):   ${test1.contributions.employee.health.toFixed(2)} EUR`);
console.log(`  - Brezposelnost (0,14%):             ${test1.contributions.employee.unemployment.toFixed(2)} EUR`);
console.log(`  - Starševsko varstvo (0,10%):        ${test1.contributions.employee.parentalCare.toFixed(2)} EUR`);
console.log(`  - Dolgotrajna oskrba (1,00%):        ${test1.contributions.employee.longTermCare.toFixed(2)} EUR`);
console.log(`  - Obvezni zdravstveni prispevek:     ${test1.healthInsuranceFee.toFixed(2)} EUR`);
console.log(`  SKUPAJ prispevki:                    ${test1.contributions.employee.total.toFixed(2)} EUR`);

console.log(`\nOsnova po prispevkih:                  ${test1.incomeAfterContributions.toFixed(2)} EUR`);
console.log(`Splošna olajšava:                      ${test1.reliefs.general.toFixed(2)} EUR`);
console.log(`Davčna osnova:                         ${test1.taxBase.toFixed(2)} EUR`);
console.log(`Akontacija dohodnine:                  ${test1.tax.toFixed(2)} EUR`);
console.log(`\n>>> NETO PLAČA:                        ${test1.netIncome.toFixed(2)} EUR <<<`);

console.log(`\nPrispevki delodajalca:`);
console.log(`  - Pokojninsko zavarovanje (8,85%):   ${test1.contributions.employer.pension.toFixed(2)} EUR`);
console.log(`  - Zdravstveno zavarovanje (6,56%):   ${test1.contributions.employer.health.toFixed(2)} EUR`);
console.log(`  - Zaposlovanje (0,06%):              ${test1.contributions.employer.unemployment.toFixed(2)} EUR`);
console.log(`  - Starševsko varstvo (0,10%):        ${test1.contributions.employer.parentalCare.toFixed(2)} EUR`);
console.log(`  - Poškodbe pri delu (0,53%):         ${test1.contributions.employer.workInjury.toFixed(2)} EUR`);
console.log(`  - Dolgotrajna oskrba (1,00%):        ${test1.contributions.employer.longTermCare.toFixed(2)} EUR`);
console.log(`  SKUPAJ prispevki:                    ${test1.contributions.employer.total.toFixed(2)} EUR`);
console.log(`\nCelotni strošek delodajalca:           ${test1.totalCostForEmployer.toFixed(2)} EUR`);
console.log(`\nSkupne dajatve državi:                 ${test1.totalTaxes.toFixed(2)} EUR`);

// Test 2: 2000 EUR mesečno (1 otrok)
console.log('\n=================================================================');
console.log('2. PRIMER: 2000 EUR mesečna bruto plača (1 otrok)');
console.log('-----------------------------------------------------------------');
const test2 = calc.calculate(2000, { period: 'monthly', numberOfChildren: 1 });

console.log(`Bruto plača:                           ${test2.grossIncome.toFixed(2)} EUR`);
console.log(`Prispevki delojemalca (vključno z OZP):${test2.contributions.employee.total.toFixed(2)} EUR`);
console.log(`Osnova po prispevkih:                  ${test2.incomeAfterContributions.toFixed(2)} EUR`);
console.log(`Olajšave:`);
console.log(`  - Splošna:                           ${test2.reliefs.general.toFixed(2)} EUR`);
console.log(`  - Otroci:                            ${test2.reliefs.children.toFixed(2)} EUR`);
console.log(`  SKUPAJ:                              ${test2.reliefs.total.toFixed(2)} EUR`);
console.log(`Davčna osnova:                         ${test2.taxBase.toFixed(2)} EUR`);
console.log(`Akontacija dohodnine:                  ${test2.tax.toFixed(2)} EUR`);
console.log(`\n>>> NETO PLAČA:                        ${test2.netIncome.toFixed(2)} EUR <<<`);

// Test 3: Letni izračun 24000 EUR
console.log('\n=================================================================');
console.log('3. PRIMER: 24000 EUR letni bruto dohodek (brez otrok)');
console.log('-----------------------------------------------------------------');
const test3 = calc.calculate(24000, { period: 'annual' });

console.log(`Bruto dohodek:                         ${test3.grossIncome.toFixed(2)} EUR`);
console.log(`Prispevki delojemalca (vključno z OZP):${test3.contributions.employee.total.toFixed(2)} EUR`);
console.log(`Osnova po prispevkih:                  ${test3.incomeAfterContributions.toFixed(2)} EUR`);
console.log(`Splošna olajšava:                      ${test3.reliefs.general.toFixed(2)} EUR`);
console.log(`Davčna osnova:                         ${test3.taxBase.toFixed(2)} EUR`);
console.log(`Letna dohodnina:                       ${test3.tax.toFixed(2)} EUR`);
console.log(`\n>>> NETO DOHODEK:                      ${test3.netIncome.toFixed(2)} EUR <<<`);

console.log('\n=================================================================\n');
