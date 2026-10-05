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
   * Olajšava za otroka, ki potrebuje posebno nego in varstvo.
   * Enaka lestvica povečanj kot pri navadnem otroku, osnova pa je posebna olajšava (114. člen).
   */
  calculateSpecialCareRelief(numberOfChildren, isMonthly = false) {
    const base = this.reliefs.dependentChild.specialCare;
    if (!numberOfChildren || !base) return 0;

    const first = this.childAmount(1);
    let total = 0;
    for (let n = 1; n <= numberOfChildren; n++) {
      const annual = round(base + (this.childAmount(n) - first));
      total += isMonthly ? round(annual / 12) : annual;
    }
    return round(total);
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
      winterBonus = 0
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
    const generalRelief = this.calculateGeneralRelief(taxableGross, isMonthly);
    const childRelief = this.calculateChildRelief(numberOfChildren, isMonthly);
    const specialCareRelief = this.calculateSpecialCareRelief(specialCareChildren, isMonthly);

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

    // ZDoh-2, 113.a člen: posebna olajšava za nove rezidente je zmanjšanje dohodnine (7 % plače), od 2025.
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
