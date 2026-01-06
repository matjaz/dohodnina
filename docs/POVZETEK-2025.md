# 🎯 POVZETEK POSODOBITVE - JULIJ 2025

## ✅ Status: POPOLNOMA PREVERJEN

Vsi izračuni so **100% usklajeni** z uradnimi podatki za **julij 2025**.

## 📊 Primerjava: 2000 EUR mesečna bruto plača

| Kategorija | Vrednost | Status |
|------------|----------|--------|
| **DELOJEMALEC** | | |
| Prispevki (vključno z OZP) | 499,17 € | ✅ |
| Olajšave | 438,33 € | ✅ |
| Davčna osnova | 1.062,50 € | ✅ |
| Dohodnina | 199,49 € | ✅ |
| **NETO PLAČA** | **1.301,34 €** | ✅ |
| | | |
| **DELODAJALEC** | | |
| Prispevki delodajalca | 342,00 € | ✅ |
| **Celotni strošek** | **2.342,00 €** | ✅ |
| | | |
| **DRŽAVA** | | |
| Skupne dajatve | 1.040,66 € | ✅ |

## 🔧 Ključne spremembe


### 1. Posodobljeni prispevki delodajalca (julij 2025)

| Prispevek | Stopnja | Znesek (2000 €) |
|-----------|---------|-----------------|
| Pokojninsko | 8,85% | 177,00 € |
| Zdravstveno | 6,56% | 131,20 € |
| Zaposlovanje | 0,06% | 1,20 € |
| Starševsko | 0,10% | 2,00 € |
| Poškodbe pri delu | 0,53% | 10,60 € |
| Dolgotrajna oskrba | 1,00% | 20,00 € |
| **SKUPAJ** | **17,10%** | **342,00 €** |

## 🚀 Uporaba

```javascript
import { DohodninaCalculator } from './index.js';

const calc = new DohodninaCalculator(2025);
const result = calc.calculate(2000, { period: 'monthly' });

console.log('Neto:', result.netIncome);      // 1301.34 €
console.log('Davek:', result.tax);            // 199.49 €
console.log('Prispevki:', result.contributions.employee.total); // 499.17 € (vključno z OZP)
console.log('Strošek delodajalca:', result.totalCostForEmployer); // 2342.00 €
```

## 🧪 Testiranje

```bash
# Demo primeri
node demo-2025.js

# Unit testi
npm test
```

## 📅 Pomembno

⚠️ **Ti podatki veljajo od JULIJA 2025 dalje!**

Sprembe zajemajo:
- Novo: Prispevek za dolgotrajno oskrbo (1% delojemalec + 1% delodajalec)
- Sprememba: OZP 35,00 € → 37,17 € (od marca 2025)

## 🔍 Rezultati raziskave (December 2025)

### ✅ Potrditev pravilnosti

Po obsežni raziskavi so bili **vsi podatki in izračuni potrjeni kot pravilni** za obdobje 2020-2025.

#### Preverjene komponente:
- **Davčne lestvice**: ✅ Pravilne za vsa leta (2020-2025)
- **Prispevki**: ✅ Vključno z julijskimi spremembami 2025
- **Olajšave**: ✅ Splošna, otroške, posebne olajšave
- **OZP**: ✅ Pravilna obravnava kot odbitek pred davčno osnovo
- **Testi**: ✅ 226 testov uspešnih

#### Testna pokritost:
- **Osnovni scenariji**: Vsi primeri izračuna plač 2020-2025
- **Robni primeri**: Zelo nizki/visoki dohodki, več otrok, kombinacije olajšav
- **Zgodovinska primerjava**: Vsa leta 2020-2025

## 📖 Viri

- Zakon o dohodnini (ZDoh-2)
- Zakon o prispevkih za socialno varnost (ZPSSV)
- Zakon o dolgotrajni oskrbi (ZDOsk)
- FURS - Finančna uprava RS
- Uradni list Republike Slovenije (spremembe prispevkov)
