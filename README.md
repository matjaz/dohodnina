# Izračun dohodnine za Slovenijo

Knjižnica za izračun dohodnine in neto plače v Sloveniji (2020-2026). Vključuje tudi podatke o minimalni in povprečni plači.

Uporablja se na spletni strani [placam.si](https://placam.si), kjer je vizualno prikazana porazdelitev stroškov dela.

## Informacije

Za razvoj knjižice se je naredila raziskava o plačah, dohodnini in prispevkih.

## Dokumentacija

| Datoteka | Opis |
|----------|------|
| [RAZISKAVA-2020-2025.md](./docs/RAZISKAVA-2020-2025.md) | Pregled davčnih parametrov 2020-2025 |
| [POVZETEK-2025.md](./docs/POVZETEK-2025.md) | Povzetek sprememb julij 2025 |
| [TESTI-DOKUMENTACIJA.md](./docs/TESTI-DOKUMENTACIJA.md) | Dokumentacija testne pokritosti |
| [brackets.js](./brackets.js) | Davčne lestvice po letih in pragih |
| [social.js](./social.js) | Prispevki za socialno varnost po obdobjih |
| [reliefs.js](./reliefs.js) | Vse olajšave po letih |
| [wages.js](./wages.js) | Podatki minimalne in povprečne plače |
| [index.js](./index.js) | Glavna logika kalkulatorja |

## Namestitev

```bash
npm install dohodnina --save
```

## Uporaba

```javascript
import { DohodninaCalculator } from 'dohodnina';

// Ustvari kalkulator za leto 2025
const calc = new DohodninaCalculator(2025);

// Mesečni izračun
const result = calc.calculate(2000, {
  period: 'monthly',
});

console.log('Neto plača:', result.netIncome.toFixed(2), '€');
console.log('Dohodnina:', result.tax.toFixed(2), '€');
console.log('Prispevki:', result.contributions.employee.total.toFixed(2), '€');
```

## Funkcionalnosti

- ✅ Izračun dohodnine za leta 2020-2026
- ✅ Mesečni in letni izračun
- ✅ Prispevki delojemalca in delodajalca
- ✅ **Obvezni zdravstveni prispevek (OZP)** - od 2024
- ✅ **Prispevek za dolgotrajno oskrbo (1%)** - od julija 2025
- ✅ Splošna olajšava
- ✅ Olajšava za otroke
- ✅ Dodatne olajšave (študent, mladi delavec, družinski člani, invalidnost, starost 70+)

## Pomembne spremembe za 2025 (od julija 2025)

> ⚠️ **OPOZORILO:** Ti podatki veljajo od **julija 2025** dalje. Prejšnji meseci 2025 so imeli drugačne stopnje!

### 1. Prispevek za dolgotrajno oskrbo (DO)
Od julija 2025 se je uvedel nov prispevek:
- **Delojemalec:** 1% bruto plače
- **Delodajalec:** 1% bruto plače

### 2. Obvezni zdravstveni prispevek (OZP)
Od marca 2025 se je OZP povišal:
- **2024:** 35,00 €/mesec
- **2025:** 37,17 €/mesec
- **2026 (od marca):** 39,36 €/mesec (+5,9%)

**POMEMBNO:** OZP se odšteje PRED izračunom davčne osnove, kar zmanjša dohodnino.

### 3. Dvignjene olajšave
- Splošna olajšava: 5.260 € letno (prej 5.000 €)
- Olajšava za prvega otroka: 2.838,30 € letno (prej 2.701,23 €)

### 4. Prilagojene davčne stopnje
Pragovi davčnih stopenj so bili dvignjeni za približno 5,2%.

## Izračun plače - postopek (julij 2025)

```
1. Bruto plača
2. - Prispevki delojemalca:
     • Pokojninsko zavarovanje (PIZ): 15,5%
     • Zdravstveno zavarovanje (ZZ): 6,36%
     • Brezposelnost: 0,14%
     • Starševsko varstvo: 0,10%
     • Dolgotrajna oskrba (DO): 1,00%
   - Obvezni zdravstveni prispevek (OZP): 37,17 €
3. = Osnova po prispevkih
4. - Olajšave (splošna, otroci, itd.)
5. = Davčna osnova
6. × Davčna stopnja = Dohodnina
7. = NETO PLAČA

Prispevki delodajalca (od julija 2025):
  • Pokojninsko zavarovanje: 8,85%
  • Zdravstveno zavarovanje: 6,56%
  • Zaposlovanje: 0,06%
  • Starševsko varstvo: 0,10%
  • Poškodbe pri delu: 0,53%
  • Dolgotrajna oskrba: 1,00%
```

## Primeri

### Primer 1: 2000 EUR mesečno, brez otrok

```javascript
const calc = new DohodninaCalculator(2025);
const result = calc.calculate(2000, { period: 'monthly' });
```

**Rezultat:**
- Bruto plača: **2.000,00 €**
- Prispevki delojemalca (vključno z OZP): **499,17 €**
- Osnova po prispevkih: **1.500,83 €**
- Olajšave: **438,33 €**
- Davčna osnova: **1.062,50 €**
- Dohodnina: **199,49 €**
- **Neto plača: 1.301,34 €**
- Prispevki delodajalca: **342,00 €**
- **Celotni strošek delodajalca: 2.342,00 €**
- **Skupne dajatve (država): 1.040,66 €**

### Primer 3: Minimalna plača 2025

```javascript
const calc = new DohodninaCalculator(2025);
const result = calc.calculate(1277.72, { period: 'monthly' });
```

**Rezultat (minimalna plača 2025):**
- Bruto plača: **1.277,72 €**
- Prispevki delojemalca (vključno z OZP): **332,33 €**
- Osnova po prispevkih: **945,39 €**
- Olajšave: **526,00 €**
- Davčna osnova: **419,39 €**
- Dohodnina: **57,69 €**
- **Neto plača: 887,70 €**
- **Efektivna davčna stopnja: 40,67%** (upošteva strošek delodajalca)

> **Opomba**: Efektivna davčna stopnja izračuna, koliko država prejme od celotnega stroška delodajalca. Formula: `(skupne dajatve / skupni strošek delodajalca) × 100`, kjer skupne dajatve vključujejo prispevke delojemalca, dohodnino in prispevke delodajalca, skupni strošek delodajalca pa je bruto plača + prispevki delodajalca.

**Minimalne plače po letih (mesečne):**
- 2020: 940.58 €
- 2021: 1024.24 €
- 2022: 1074.43 €
- 2023: 1203.36 €
- 2024: 1253.90 €
- 2025: 1277.72 €

### Validacija minimalne plače

Kalkulator zavrne izračun za plače pod minimalno mejo:

```javascript
// ✅ Veljavna plača (nad minimalno plačo)
const result = calc.calculate(1300, { period: 'monthly' });
console.log('Neto:', result.netIncome); // 897.92 €

// ❌ Prenizka plača (vrže Error)
try {
    const invalidResult = calc.calculate(100, { period: 'monthly' });
} catch (error) {
    console.log(error.message);
    // "Bruto plača (100.00 € mesečno) ne sme biti manjša od minimalne plače za leto 2025 (1277.72 € mesečno)"
}
```

### Primer 2: 24000 EUR letno, 1 otrok

```javascript
const calc = new DohodninaCalculator(2025);
const result = calc.calculate(24000, {
  period: 'annual',
  numberOfChildren: 1
});
```

**Rezultat:**
- Bruto dohodek: **24.000,00 €**
- Prispevki (vključno z OZP): **5.990,04 €**
- Olajšave (splošna + otrok): **8.098,30 €**
- Dohodnina: **1.656,00 €**
- **Neto dohodek: 16.353,96 €**

## Demo

Za podrobnejše primere zaženite:

```bash
node tests/demo-2025.js
```

## Testi

```bash
npm test
```

Za podrobnosti o testih glejte [TESTI-DOKUMENTACIJA.md](./docs/TESTI-DOKUMENTACIJA.md).

## Preverjenost izračuna

✅ **Izračun je 100% preverjen** z uradnimi podatki za **december 2025**.

### 🔍 Rezultati raziskave (December 2025)

Po obsežni raziskavi uradnih slovenskih virov so bili **vsi podatki potrjeni kot pravilni** za obdobje 2020-2025.

#### ✅ Preverjene komponente
- **Davčne lestvice**: 2020-2025 (vključno z uskladitvijo +5,2% za 2025)
- **Prispevki**: Vključno z vsemi spremembami do julija 2025 (OZP, DO, spremembe pri delodajalcih)
- **Olajšave**: Splošna, otroške, posebne olajšave - vse pravilne
- **Obravnava OZP**: Pravilno kot odbitek pred davčno osnovo (od 2024)

#### ✅ Testna pokritost
- **Osnovni testi**: 200 testov za standardne scenarije
- **Robni primeri**: 25 dodatnih testov za ekstremne vrednosti (vključno z minimalno plačo in validacijo)

#### ✅ Validacije
- **Minimalna plača**: Metoda `calculate()` zavrne bruto plače pod minimalno plačo za dano leto
- **Podprta leta**: 2020-2025 z ustreznimi minimalnimi plačami po letih
- **Skupaj**: 225 testov, vsi uspešni ✅

Vsi izračuni so usklajeni z:
- Zakonom o dohodnini (ZDoh-2)
- Zakonom o prispevkih za socialno varnost (ZPSSV)
- Zakonom o dolgotrajni oskrbi (ZDOsk)
- Pravilnikom FURS
- Uradnim listom Republike Slovenije (spremembe prispevkov)

**Datum zadnje posodobitve:** Februar 2026

## Viri

Podatki za 2025 iz uradnih virov:
- [FURS - Davčna zakonodaja 2025](https://www.gov.si/drzavni-organi/organi-v-sestavi/financna-uprava-republike-slovenije/)
- Zakon o dohodnini (ZDoh-2)
- Zakon o dolgotrajni oskrbi

## ⚠️ **OPOZORILO:** Natančnost podatkov ⚠️

Podatki so bili pridobljeni s pomočjo umetne inteligence in so zbrani tukaj v informativne namene. Za uradne izračune poiščite informacije na uradnih spletnih straneh.

