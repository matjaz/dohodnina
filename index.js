/**
 * Knjižnica za izračun dohodnine v Sloveniji (2020-2026)
 */

import TAX_BRACKETS from './brackets.js';
import SOCIAL_CONTRIBUTIONS from './social.js';
import TAX_RELIEFS from './reliefs.js';
import WAGES from './wages.js';

export class DohodninaCalculator {
  constructor(year = 2025) {
    this.year = year;

    if (!TAX_BRACKETS[year]) {
      throw new Error(`Davčna lestvica za leto ${year} ni na voljo`);
    }

    this.brackets = TAX_BRACKETS[year];
    this.reliefs = TAX_RELIEFS[year];
    this.contributions = SOCIAL_CONTRIBUTIONS[year];
    this.wages = WAGES[year];
  }

  /**
   * Vrne prispevne stopnje (upošteva mesečne spremembe, npr. 2025)
   */
  getContributionRates(type, month, isAnnual = false) {
    const baseRates = { ...this.contributions[type] };

    // 2025 ima spremembo julija
    if (this.year === 2025) {
      if (month) {
        if (Number(month) < 7) delete baseRates.longTermCare;
      } else if (isAnnual) {
        // Letni izračun: dolgotrajna oskrba velja 6/12 mesecev (jul–dec)
        if (baseRates.longTermCare) baseRates.longTermCare *= 0.5;
      }
    }
    return baseRates;
  }

  /**
   * Vrne OZP glede na leto in mesec (2025 ima spremembo marca)
   */
  getHealthInsuranceFee(isMonthly, month) {
    let fee = this.contributions.healthInsuranceFee || 0;

    const beforeMarch = this.contributions.healthInsuranceFeeBeforeMarch;
    if (beforeMarch && month) {
      const m = Number(month);
      if (m < 3) {
        fee = beforeMarch;
      }
    }
    if (isMonthly) return fee;
    // Letni izračun: jan–feb po stari tarifi, mar–dec po novi
    return beforeMarch ? (2 * beforeMarch + 10 * fee) : fee * 12;
  }

  getBracket(taxBase, period = 'annual') {
    const brackets = period === 'monthly' ? this.brackets.monthly : this.brackets.annual;
    for (const bracket of brackets) {
      if (taxBase >= bracket.from && taxBase < bracket.to) {
        return bracket;
      }
    }
  }

  /**
   * Izračuna prispevke za socialno varnost
   */
  calculateSocialContributions(grossIncome, type = 'employee', month, isAnnual = false) {
    const rates = this.getContributionRates(type, month, isAnnual);
    const contributions = {};
    let total = 0;

    for (const [key, rate] of Object.entries(rates)) {
      contributions[key] = round(grossIncome * rate);
      total += contributions[key];
    }

    return { ...contributions, total: round(total) };
  }

  /**
   * Izračuna dohodnino iz davčne osnove
   */
  calculateTax(taxBase, period = 'annual') {
    const bracket = this.getBracket(taxBase, period);
    if (bracket) {
        return round(bracket.fixedTax + (taxBase - bracket.over) * bracket.rate);
    }
    return 0;
  }

  /**
   * Izračuna splošno olajšavo
   */
  calculateGeneralRelief(totalIncome, isMonthly = false) {
    const relief = this.reliefs.general;

    if (isMonthly) {
      const annualEstimate = totalIncome * 12;
      const annualRelief = relief.formula(annualEstimate);
      return round(annualRelief / 12);
    }

    return round(relief.formula(totalIncome));
  }

  /**
   * Letna olajšava za otroka na danem mestu (1 = prvi otrok).
   * ZDoh-2, 114. člen: drugi otrok se poveča le za majhen znesek,
   * od tretjega naprej pa za večji korak glede na predhodnega otroka.
   */
  childAmount(position) {
    const child = this.reliefs.dependentChild;
    const amounts = child.amounts || [child.first];
    if (position <= amounts.length) return amounts[position - 1];
    const last = amounts[amounts.length - 1];
    return round(last + (position - amounts.length) * child.furtherIncrement);
  }

  /**
   * Izračuna olajšavo za vzdrževane otroke.
   * Mesečni znesek je vsota zaokroženih mesečnih olajšav posameznega otroka (FURS 1/12).
   */
  calculateChildRelief(numberOfChildren, isMonthly = false) {
    if (!numberOfChildren) return 0;

    let total = 0;
    for (let n = 1; n <= numberOfChildren; n++) {
      const annual = this.childAmount(n);
      total += isMonthly ? round(annual / 12) : annual;
    }
    return round(total);
  }

  /**
   * Letna olajšava enega otroka na mestu v skupnem vrstnem redu (1 = prvi otrok).
   * Otrok s posebno nego dobi osnovo iz 2. točke 114. člena, povečano za isti korak
   * kot navaden otrok na tem mestu (drugi odstavek 114. člena).
   */
  childReliefAmount(position, specialCare = false) {
    const ordinary = this.childAmount(position);
    if (!specialCare) return ordinary;
    const base = this.reliefs.dependentChild.specialCare;
    if (!base) return ordinary;
    return round(base + (ordinary - this.childAmount(1)));
  }

  /**
   * Olajšava za otroke s posebno nego, ki zasedejo zaporedna mesta od `firstPosition`.
   * Privzeto so to prvi otroci. V družini z navadnimi otroki podajte mesto prvega
   * otroka s posebno nego, sicer korak ostane pri prvem otroku.
   */
  calculateSpecialCareRelief(count, isMonthly = false, firstPosition = 1) {
    if (!count || !this.reliefs.dependentChild.specialCare) return 0;
    if (!Number.isInteger(firstPosition) || firstPosition < 1) {
      throw new Error('Mesto otroka s posebno nego se šteje od 1 naprej');
    }

    let total = 0;
    for (let n = 0; n < count; n++) {
      const annual = this.childReliefAmount(firstPosition + n, true);
      total += isMonthly ? round(annual / 12) : annual;
    }
    return round(total);
  }

  /**
   * Skupni vrstni red vzdrževanih otrok.
   *
   * `numberOfChildren` so samo otroci brez posebne nege. `specialCareChildren` so
   * dodatni otroci in se vanj ne štejejo še enkrat: najprej navadni, nato posebna
   * nega. Dva navadna in en s posebno nego pomenita, da je posebni tretji otrok.
   * Če bi posebnega šteli v obeh poljih, bi dobil še eno navadno mesto.
   *
   * `children` je polje `{ specialCare: boolean }` od prvega otroka in preglasi
   * oba števca. Uporabite ga, kadar otrok s posebno nego ni zadnji.
   */
  orderedChildren({ numberOfChildren = 0, specialCareChildren = 0, children = null } = {}) {
    if (children != null) {
      if (numberOfChildren > 0 || specialCareChildren > 0) {
        throw new Error('Seznam children že določa vrstni red; numberOfChildren in specialCareChildren pustite pri 0');
      }
      if (!Array.isArray(children)) {
        throw new Error('Seznam otrok mora biti polje');
      }
      return children.map((child, index) => {
        if (!child || typeof child.specialCare !== 'boolean') {
          throw new Error(`Otrok na mestu ${index + 1} mora imeti specialCare: true ali false`);
        }
        return { specialCare: child.specialCare };
      });
    }

    const ordered = [];
    for (let n = 0; n < numberOfChildren; n++) ordered.push({ specialCare: false });
    for (let n = 0; n < specialCareChildren; n++) ordered.push({ specialCare: true });
    return ordered;
  }

  /**
   * Olajšave po skupnem vrstnem redu. Vsak otrok dobi en znesek, na svojem mestu.
   */
  splitChildRelief(ordered, isMonthly = false) {
    let ordinaryTotal = 0;
    let specialTotal = 0;
    ordered.forEach((child, index) => {
      const annual = this.childReliefAmount(index + 1, child.specialCare);
      const amount = isMonthly ? round(annual / 12) : annual;
      if (child.specialCare) specialTotal += amount;
      else ordinaryTotal += amount;
    });
    return {
      children: round(ordinaryTotal),
      specialCare: round(specialTotal)
    };
  }

  /**
   * Kompleten izračun dohodnine z vsemi odbitki
   * POSTOPEK:
   * 1. Bruto plača
   * 2. - Prispevki delojemalca (PIZ, ZZ, brezposelnost, starševstvo, DO, OZP)
   * 3. = Osnova po prispevkih
   * 4. - Olajšave
   * 5. = Davčna osnova
   * 6. × Davčna stopnja = Dohodnina
   * 7. Neto plača = Bruto - Prispevki - Dohodnina
   */
  calculate(grossIncome, options = {}) {
    const {
      period = 'annual',
      month = null,
      numberOfChildren = 0,
      specialCareChildren = 0,
      isStudent = false,
      isYoungEmployee = false,
      dependentFamilyMembers = 0,
      hasDisability100 = false,
      isOver70 = false,
      isVolunteer = false,
      pensionContribution = 0,
      isNewResident = false,
      winterBonus = 0,
      children = null
    } = options;

    const isMonthly = period === 'monthly';

    if (month !== null) {
      const m = Number(month);
      if (!Number.isInteger(m) || m < 1 || m > 12) {
        throw new Error(`Parameter "month" mora biti celo število med 1 in 12 (prejeto: ${month})`);
      }
    }

    // VALIDACIJA: Preverjanje minimalne plače
    const minimumWageAnnual = this.wages.min;
    const minimumWage = isMonthly ? minimumWageAnnual / 12 : minimumWageAnnual;

    if (grossIncome < minimumWage) {
      const periodText = isMonthly ? 'mesečno' : 'letno';
      throw new Error(`Bruto plača (${grossIncome.toFixed(2)} € ${periodText}) ne sme biti manjša od minimalne plače za leto ${this.year} (${minimumWage.toFixed(2)} € ${periodText})`);
    }

    if (winterBonus < 0) {
      throw new Error('Zimski regres ne sme biti negativen');
    }
    if (winterBonus > 0 && this.year < 2025) {
      throw new Error('Neobdavčen zimski regres po ZPZR velja od leta 2025');
    }
    if (specialCareChildren < 0 || numberOfChildren < 0) {
      throw new Error('Število otrok ne sme biti negativno');
    }

    // ZPZR: zimski regres do polovice minimalne plače ni v davčni osnovi in nima prispevkov.
    // Zakon velja od leta 2025. Presežek se prišteje k obdavčljivi plači.
    const winterBonusCap = this.year >= 2025 ? round(this.wages.min / 24) : 0;
    const exemptWinterBonus = winterBonusCap ? round(Math.min(winterBonus, winterBonusCap)) : 0;
    const taxableWinterBonus = round(Math.max(0, winterBonus - exemptWinterBonus));
    const taxableGross = round(grossIncome + taxableWinterBonus);

    // 1. PRISPEVKI DELOJEMALCA (odštejejo se od bruto plače)
    const employeeContributions = this.calculateSocialContributions(taxableGross, 'employee', month, !isMonthly);

    // 1a. OBVEZNI ZDRAVSTVENI PRISPEVEK (OZP)
    const healthInsuranceFee = this.getHealthInsuranceFee(isMonthly, month);

    // Dodaj OZP v total prispevkov delojemalca
    employeeContributions.total = round(employeeContributions.total + healthInsuranceFee);

    // 2. OSNOVA PO PRISPEVKIH (vključuje odbitek vseh prispevkov + OZP)
    const incomeAfterContributions = taxableGross - employeeContributions.total;

    // 3. OLAJŠAVE
    // Mesečna akontacija veže splošno olajšavo na redno plačo × 12. Obdavčljivi
    // presežek zimskega regresa je enkratno izplačilo (ZPZR, 127. člen za regres):
    // prišteje se enkrat, ne kot dvanajst dodatnih mesečnih plač.
    const generalRelief = (isMonthly && taxableWinterBonus > 0)
      ? round(this.reliefs.general.formula(round(grossIncome * 12 + taxableWinterBonus)) / 12)
      : this.calculateGeneralRelief(isMonthly ? grossIncome : taxableGross, isMonthly);
    const family = this.splitChildRelief(
      this.orderedChildren({ numberOfChildren, specialCareChildren, children }),
      isMonthly
    );
    const childRelief = family.children;
    const specialCareRelief = family.specialCare;

    let totalReliefs = generalRelief + childRelief + specialCareRelief;

    if (isStudent && this.reliefs.student) {
      totalReliefs += isMonthly ? this.reliefs.student.annual / 12 : this.reliefs.student.annual;
    }

    if (isYoungEmployee && this.reliefs.youngEmployee?.annual > 0) {
      totalReliefs += isMonthly ? this.reliefs.youngEmployee.annual / 12 : this.reliefs.youngEmployee.annual;
    }

    if (dependentFamilyMembers > 0 && this.reliefs.dependentFamily) {
      totalReliefs += dependentFamilyMembers * (isMonthly ? this.reliefs.dependentFamily.annual / 12 : this.reliefs.dependentFamily.annual);
    }

    if (hasDisability100 && this.reliefs.disability100) {
      totalReliefs += isMonthly ? this.reliefs.disability100.annual / 12 : this.reliefs.disability100.annual;
    }

    if (isOver70 && this.reliefs.over70) {
      totalReliefs += isMonthly ? this.reliefs.over70.annual / 12 : this.reliefs.over70.annual;
    }

    if (isVolunteer && this.reliefs.volunteer) {
      totalReliefs += isMonthly ? this.reliefs.volunteer.annual / 12 : this.reliefs.volunteer.annual;
    }

    if (pensionContribution > 0 && this.reliefs.pension) {
      const maxAmount = isMonthly ? this.reliefs.pension.maxAmount / 12 : this.reliefs.pension.maxAmount;
      totalReliefs += Math.min(pensionContribution, maxAmount);
    }

    // 4. DAVČNA OSNOVA
    const taxBase = round(Math.max(0, incomeAfterContributions - totalReliefs));

    // 5. DOHODNINA (akontacija)
    let tax = this.calculateTax(taxBase, period);

    // ZDoh-2, 113.a člen: zmanjšanje dohodnine za 7 % prejete plače oziroma nadomestila
    // plače, od 2025. Osnova je argument plače, ne obdavčljivi presežek zimskega regresa
    // (ta po ZPZR ni plača, ampak plačilo za poslovno uspešnost ali drug dohodek).
    let newResidentReduction = 0;
    if (isNewResident && this.reliefs.newResidentRate) {
      newResidentReduction = round(Math.min(tax, grossIncome * this.reliefs.newResidentRate));
      tax = round(tax - newResidentReduction);
    }

    // 6. NETO PLAČA (employeeContributions.total že vključuje OZP)
    // Neobdavčen zimski regres se prišteje k neto, ker od njega ni prispevkov niti dohodnine.
    const netIncome = round(taxableGross - employeeContributions.total - tax + exemptWinterBonus);

    // PRISPEVKI DELODAJALCA
    const employerContributions = this.calculateSocialContributions(taxableGross, 'employer', month, !isMonthly);

    // SKUPNE DAJATVE (država prejme) - employeeContributions.total že vključuje OZP
    const totalTaxes = round(employeeContributions.total + tax + employerContributions.total);

    const totalCostForEmployer = round(taxableGross + employerContributions.total + exemptWinterBonus);

    return {
      grossIncome: round(grossIncome),
      taxableGross,
      contributions: {
        employee: employeeContributions,
        employer: employerContributions,
        healthInsuranceFee
      },
      incomeAfterContributions: round(incomeAfterContributions),
      reliefs: {
        general: generalRelief,
        children: childRelief,
        specialCare: specialCareRelief,
        total: round(totalReliefs)
      },
      taxBase,
      tax,
      newResidentReduction,
      winterBonus: {
        paid: round(winterBonus),
        exempt: exemptWinterBonus,
        taxable: taxableWinterBonus
      },
      healthInsuranceFee,
      netIncome,
      totalCostForEmployer,
      totalTaxes,
      effectiveRate: round((totalTaxes / totalCostForEmployer) * 100),
      year: this.year,
      period
    };
  }
}

export function round(number) {
  return Math.round(number * 100) / 100
}
