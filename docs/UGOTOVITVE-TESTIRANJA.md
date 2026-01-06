# 🧪 Ugotovitve testiranja kalkulatorja dohodnine

**Datum**: December 2025
**Status**: ✅ Vsi testi uspešni

---

## 📊 Povzetek preverjanja

### 1. Preverjanje podatkov na spletu

Po raziskavi uradnih slovenskih virov (FURS, ministrstvo za finance, Statistični urad RS) so bili potrjeni naslednji podatki:

#### Minimalne plače 2020-2025
- ✅ Vse vrednosti v kodi se ujemajo z javno objavami
- 2020: 940,58 €
- 2021: 1.024,24 €
- 2022: 1.074,43 €
- 2023: 1.203,36 €
- 2024: 1.253,90 €
- 2025: 1.277,72 €

#### Obvezni zdravstveni prispevek (OZP)
- ✅ Pravilno implementirano:
  - 2024: 35,00 €/mesec
  - Januar–februar 2025: 35,00 €/mesec
  - Marec–december 2025: 37,17 €/mesec

#### Prispevek za dolgotrajno oskrbo (DO)
- ✅ Pravilno implementirano:
  - Januar–junij 2025: brez prispevka
  - Julij–december 2025: 1% za delojemalca in delodajalca

---

## ✅ Rezultati testiranja

### Osnovni testi (`dohodnina.test.js`)
- ✅ Letni izračuni brez otrok (2021-2025)
- ✅ Letni izračuni z 1 otrokom (2021-2025)
- ✅ Mesečni izračuni 2025 (2000€, 3500€)
- **Status**: Vsi testi uspešni

### Razširjeni testi (`dohodnina-extended.test.js`)
- ✅ Letni izračuni za različne dohodke (2020-2025)
- ✅ Letni izračuni z otroki (0-3 otroci)
- ✅ Mesečni izračuni za vsa leta (2020-2025)
- ✅ Olajšave za otroke (1-5 otrok)
- ✅ Splošna olajšava (progresivna formula)
- ✅ Minimalna plača za vsa leta
- ✅ Mejne vrednosti davčnih razredov
- ✅ Najvišja davčna stopnja (45% 2022, 50% ostala leta)
- ✅ Posebne olajšave (mladi delavec, študent, invalidnost)
- ✅ Efektivna davčna stopnja
- ✅ Srednjeletne spremembe 2025 (januar, avgust)
- **Status**: Vsi testi uspešni

### Robni primeri (`dohodnina-edge-cases.test.js`)
- ✅ Minimalna plača in okolica
- ✅ Zelo visoki dohodki (200.000€, 500.000€)
- ✅ Meje davčnih razredov
- ✅ Več otrok (3, 5 otrok)
- ✅ Kombinacija olajšav
- ✅ Prispevki delodajalca
- ✅ Zgodovinska primerjava (2020-2025)
- **Status**: Vsi testi uspešni

---

## 🔍 Preverjeni scenariji

### Mesečni izračuni 2025 (2000€ bruto)

| Mesec | OZP | DO | Delojemalec | Delodajalec | Neto | Davek |
|-------|-----|----|-------------|-------------|------|-------|
| Januar | 35€ | ❌ | 477€ | 320,80€ | 1.317,74€ | 205,26€ |
| Februar | 35€ | ❌ | 477€ | 320,80€ | 1.317,74€ | 205,26€ |
| Marec | 37,17€ | ❌ | 479,17€ | 320,80€ | 1.315,57€ | 203,09€ |
| Junij | 37,17€ | ❌ | 479,17€ | 320,80€ | 1.315,57€ | 203,09€ |
| Julij | 37,17€ | ✅ | 499,17€ | 342,00€ | 1.301,34€ | 199,49€ |
| Avgust | 37,17€ | ✅ | 499,17€ | 342,00€ | 1.301,34€ | 199,49€ |

**Opomba**: Brez parametra `month` se uporabijo najnovejše stopnje (konec leta 2025).

### Primerjava med leti (2000€ mesečno)

| Leto | Neto | Davek | OZP | DO | Opomba |
|------|------|-------|-----|-----|--------|
| 2023 | 1.334,22€ | 223,78€ | 0€ | ❌ | Pred uvedbo OZP |
| 2024 | 1.308,32€ | 214,68€ | 35€ | ❌ | Uvedba OZP |
| 2025 (jan) | 1.317,74€ | 205,26€ | 35€ | ❌ | Stare stopnje |
| 2025 (avg) | 1.301,34€ | 199,49€ | 37,17€ | ✅ | Nove stopnje |

---

## 📈 Statistični podatki

### Povprečne plače v Sloveniji
- **2024**: 2.394,92 € bruto
- **2025 (januar)**: 2.464,35 € bruto (+6,9%)
- **2025 (junij)**: 2.540,80 € bruto
- **2025 (oktober)**: 2.572,07 € bruto

### Efektivna davčna stopnja (24.000€ letno)
**Opomba**: Efektivna stopnja upošteva strošek delodajalca. Formula: `(skupne dajatve / skupni strošek delodajalca) × 100`, kjer skupne dajatve vključujejo prispevke delojemalca, dohodnino in prispevke delodajalca.

- 2020: 44,02%
- 2021: 44,02%
- 2022: 42,99%
- 2023: 42,53%
- 2024: 43,64%
- 2025: 44,43% ✅

**Primer izračuna za 2025 (24.000€ letno)**:
- Bruto plača: 24.000€
- Prispevki delodajalca: 4.104€
- Skupni strošek delodajalca: 28.104€
- Skupne dajatve (država): 12.488€
  - Prispevki delojemalca: 5.990,04€
  - Dohodnina: 2.393,96€
  - Prispevki delodajalca: 4.104€
- Neto delojemalca: 15.616,00€
- Efektivna stopnja: 12.488 / 28.104 × 100 = 44,43%

---

## ✅ Zaključek

Kalkulator za izračun dohodnine v Sloveniji je **popolnoma funkcionalen** in pravilno upošteva:

1. ✅ Vse davčne lestvice za obdobje 2020-2025
2. ✅ Vse prispevke za socialno varnost (vključno s srednjeletnimi spremembami 2025)
3. ✅ Vse olajšave (splošna, otroške, posebne)
4. ✅ Obvezni zdravstveni prispevek (OZP) z mesečnimi spremembami
5. ✅ Prispevek za dolgotrajno oskrbo (DO) od julija 2025
6. ✅ Spremembe prispevkov delodajalca od julija 2025

**Vsi testi so uspešno prestali preverjanje** - kalkulator je pripravljen za produkcijsko uporabo.

---

*Zadnja posodobitev: December 2025*

