# 🧪 Dokumentacija testov

## Pregled testne pokritosti

Projekt vsebuje **tri testne datoteke**:

1. **`dohodnina.test.js`** - Osnovni testi
2. **`dohodnina-extended.test.js`** - Razširjeni testi
3. **`dohodnina-edge-cases.test.js`** - Testi robnih primerov in posebnih scenarijev

---

## 📋 Osnovni testi (`dohodnina.test.js`)

### Vsebina

| Test skupina | Opis |
|--------------|------|
| `osnovna dohodnina` | Letni izračuni za 8.500€ in 24.000€ (2021-2025) |
| `dohodnina 1 otrok` | Letni izračuni z 1 otrokom (2021-2025) |
| `mesečni izračuni 2025` | Podrobni mesečni izračuni za 2000€ in 3500€ |

---

## 📋 Testi robnih primerov (`dohodnina-edge-cases.test.js`)

### Namen

Ti testi pokrivajo **robne primere**, **ekstremne vrednosti** in **posebne scenarije**, ki niso pokriti v osnovnih testih. Namenjeni so zagotavljanju robustnosti kalkulatorja pri različnih robnih pogojih.

### 1. Minimalna plača in okolico

Testira obnašanje pri minimalni plači in okolici (upošteva slovensko zakonodajo o minimalni plači):
- **Minimalna plača 2025 (1277.72 € mesečno)**: Davek 57.69 €, neto 887.70 €, efektivna stopnja 4.52%
- **Tik nad minimalno plačo (1280 € mesečno)**: Davek 58.40 €, neto 888.75 €, efektivna stopnja 4.56%
- **Blizu minimalne plače (1300 € mesečno)**: Davek 64.61 €, neto 897.92 €, efektivna stopnja 4.97%
- **Validacija prenizke plače**: Metoda `calculate()` zavrne bruto plače pod minimalno plačo z ustrezno napako
- **Validacija za vsa leta**: Preverjanje deluje za vsa podprta leta (2020-2025)

**Minimalne plače po letih (mesečne):**
- 2020: 940.58 €, 2021: 1024.24 €, 2022: 1074.43 €, 2023: 1203.36 €, 2024: 1253.90 €, 2025: 1277.72 €

### 2. Zelo visoki dohodki

Testira obnašanje pri ekstremno visokih bruto dohodkih:
- **200.000 € letno**: Preverja najvišjo davčno stopnjo (50%)
- **500.000 € letno**: Preverja efektivno davčno stopnjo pri zelo visokih dohodkih

### 3. Meje davčnih razredov

Preverja pravilno prehode med davčnimi razredi:
- Primerjava davkov pri različnih dohodkih
- Preverjanje pravilnega izračuna na mejah razredov

### 4. Več otrok

Testira olajšave pri večjem številu otrok:
- **3 otroci**: Letni izračun z visoko olajšavo
- **5 otrok**: Mesečni izračun z maksimalno olajšavo za otroke

### 5. Kombinacija olajšav

Testira sočasno uporabo več olajšav:
- **Študent + 1 otrok**: Kombinacija študentske in otroške olajšave
- **Mladi delavec + invalidnost**: Kombinacija olajšav za mlade in invalide
- **Vse olajšave skupaj**: Študent + otroci + mlad delavec + invalidnost + starost 70+

### 6. Prispevki delodajalca

Primerja strukturo prispevkov delojemalca in delodajalca pri 2000€ mesečno.

### 7. Efektivna davčna stopnja

Preverja efektivno davčno stopnjo pri:
- **Minimalna plača 2025**: Nizka efektivna stopnja (< 15%)
- **Visoki dohodki**: Visoka efektivna stopnja (> 20%)

### 8. Zgodovinska primerjava

Preverja konsistentnost izračunov za **2500€ mesečno** čez vsa leta (2020-2025).

---

## 📋 Razširjeni testi (`dohodnina-extended.test.js`)

### 1. Letni izračuni brez otrok

Pokriva vsa leta **2020-2025** z naslednjimi bruto dohodki:
- 8.500 € (nizek dohodek)
- 12.000 € (nizek-srednji)
- 18.000 € (srednji)
- 24.000 € (srednje-visok)
- 36.000 € (visok)
- 48.000 € (zelo visok)
- 72.000 € (na meji 5. razreda)
- 100.000 € (nad mejo 5. razreda)

### 2. Letni izračuni z otroki

Pokriva kombinacije:
- **Bruto dohodki**: 24.000 € in 36.000 €
- **Število otrok**: 0, 1, 2, 3
- **Leta**: 2020-2025

### 3. Mesečni izračuni 2025

#### Prispevki delojemalca
- Pokojninsko (15,5%)
- Zdravstveno (6,36%)
- Brezposelnost (0,14%)
- Starševsko varstvo (0,10%)
- Dolgotrajna oskrba (1%)
- OZP (37,17 €)

#### Prispevki delodajalca
- Pokojninsko (8,85%)
- Zdravstveno (6,56%)
- Zaposlovanje (0,06%)
- Starševsko varstvo (0,10%)
- Poškodbe pri delu (0,53%)
- Dolgotrajna oskrba (1%)

#### Neto plača brez otrok
Testirane plače: 1.500€, 2.000€, 2.500€, 3.000€, 3.500€, 5.000€

#### Neto plača z otroki
- 2.000 € z 1 otrokom
- 2.000 € z 2 otrokoma
- 2.000 € z 3 otroki

### 4. Mesečni izračuni - vsa leta

| Leto | Testira |
|------|---------|
| 2020 | Prispevki brez OZP, neto, prispevki delodajalca |
| 2021 | Prispevki brez OZP, neto |
| 2022 | Prispevki brez OZP, neto |
| 2023 | Prispevki brez OZP, neto |
| 2024 | Prispevki z OZP (35€), neto |
| 2025 | Prispevki z OZP (37,17€) in DO (1%), neto |

### 5. Olajšave za otroke

| Leto | Testirano |
|------|-----------|
| 2020 | 1-5 otrok |
| 2021 | 1-3 otroci |
| 2023 | 1-3 otroci |
| 2024 | 1-3 otroci |
| 2025 | 0-5 otrok |

### 6. Splošna olajšava

Testira progresivno formulo za 2020 in 2025:
- **2020**: Prag 13.316,83 €, osnovna 3.500 €
- **2025**: Prag 16.832 €, osnovna 5.260 €
- Nizek dohodek → višja olajšava
- Nad pragom → osnovna olajšava

### 7. Minimalna plača

Preveri razumen razpon neto plače za:
- 2020: 940,58 € bruto
- 2021: 1.024,24 € bruto
- 2022: 1.074,43 € bruto
- 2023: 1.203,36 € bruto
- 2024: 1.253,90 € bruto
- 2025: 1.277,72 € bruto

### 8. Mejne vrednosti davčnih razredov

Testira izračune na mejah za 2020/2021 in 2025:
- **2020/2021**: Meje 8.500, 25.000, 50.000, 72.000 €
- **2025**: Meje 9.210, 27.089, 54.178, 78.016 €

### 9. Najvišja davčna stopnja

Preveri pravilno uporabo:
- **2020**: 50%
- **2021**: 50%
- **2022**: 45% (začasno znižanje)
- **2023**: 50% (vrnitev)
- **2025**: 50%

### 10. Posebne olajšave

- Olajšava za mlade delavce
- Olajšava za vzdrževane družinske člane

### 11. Efektivna davčna stopnja

Preveri, da efektivna stopnja pri 24.000€ bruto:
- 2020: < 15%
- 2021: < 15%
- 2022: < 14%
- 2023: < 13%
- 2024: < 12%
- 2025: < 11%

### 12. Prispevki delodajalca

Primerja strukturo prispevkov:
- **2020**: Brez DO
- **2025**: Z DO (1%)

### 13. Primerjava neto plač med leti

Preveri:
- Rast neto od 2021 do 2023
- Padec neto v 2024 (OZP)
- Dodatni padec v 2025 (DO)

### 14. Skupne dajatve za državo

Preveri izračun: prispevki delojemalca + dohodnina + prispevki delodajalca

### 15. Validacija

- Napačno leto (2019) vrne napako
- Leto 2020 je podprto

---

## 🔧 Zagon testov

```bash
npm test

# Samo osnovni testi
npx jest dohodnina.test.js

# Samo razširjeni testi
npx jest dohodnina-extended.test.js

# Samo testi robnih primerov
npx jest dohodnina-edge-cases.test.js

# Z verbose izpisom
npx jest --verbose

# Samo določeni test
npx jest --testNamePattern="zelo nizki dohodki"
```

---

## ✅ Preverjene vrednosti

### Referenčna tabela: 24.000 € letno

| Leto | Brez otrok | 1 otrok | 2 otroka | 3 otroci |
|------|------------|---------|----------|----------|
| 2020 | 3.100,96 € | 2.477,52 € | 1.394,07 € | 431,14 € |
| 2021 | 3.100,96 € | 2.477,52 € | 1.394,07 € | 431,14 € |
| 2022 | 2.815,46 € | 2.175,71 € | 1.192,40 € | 215,55 € |
| 2023 | 2.685,46 € | 1.983,14 € | 1.013,53 € | 0 € |
| 2024 | 2.576,26 € | 1.873,94 € | 946,33 € | 0 € |
| 2025 | 2.393,96 € | 1.656,00 € | 802,00 € | 0 € |

### Referenčna tabela: 2.000 € mesečno (neto)

| Leto | Brez otrok | Prispevki | OZP |
|------|------------|-----------|-----|
| 2020 | 1.299,59 € | 442,00 € | 0 € |
| 2021 | 1.299,59 € | 442,00 € | 0 € |
| 2022 | 1.323,38 € | 442,00 € | 0 € |
| 2023 | 1.334,22 € | 442,00 € | 0 € |
| 2024 | 1.308,32 € | 477,00 € | 35,00 € |
| 2025 | 1.301,34 € | 499,17 € | 37,17 € |

---

## 📝 Opombe

1. **Zaokroževanje**: Vsi izračuni so zaokroženi na 2 decimalni mesti.

2. **OZP obravnava**: OZP se odšteje pred izračunom davčne osnove (od 2024).

3. **Prispevek za DO**: Uveden julija 2025 - trenutni testi predpostavljajo celoletno uporabo.

4. **Mesečni vs letni**: Pri mesečnih izračunih se olajšave delijo z 12.

---

## 🔍 Status raziskave (December 2025)

**✅ Raziskava dokončana:** Preverjene so uradne slovenske davčne lestvice, prispevki in olajšave za obdobje 2020-2025.

**✅ Vsi testi uspešni:** vsi testi so uspešni.

**✅ Implementacija pravilna:** Koda pravilno obravnava vse znane spremembe do konca leta 2025, vključno z OZP in prispevkom za dolgotrajno oskrbo.

---

*Zadnja posodobitev: December 2025 - Dodana validacija minimalne plače in testi robnih primerov*

