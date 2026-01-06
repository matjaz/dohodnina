/**
 * Knjižnica za izračun dohodnine v Sloveniji (2020-2025)
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
  getContributionRates(type, month) {
    const baseRates = { ...this.contributions[type] };

    // 2025 ima spremembo julija
    if (this.year === 2025 && month) {
      const m = Number(month);
      if (m < 7) {
        delete baseRates.longTermCare;
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
    return isMonthly ? fee : fee * 12;
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
  calculateSocialContributions(grossIncome, type = 'employee', month) {
    const rates = this.getContributionRates(type, month);
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
   * Izračuna olajšavo za vzdrževane otroke
   */
  calculateChildRelief(numberOfChildren, isMonthly = false) {
    if (numberOfChildren === 0) return 0;

    const child = this.reliefs.dependentChild;
    let total = child.first;

    for (let i = 1; i < numberOfChildren; i++) {
      const previousRelief = i === 1 ? child.first : child.first + (i - 1) * child.increment;
      total += previousRelief + child.increment;
    }

    return round(isMonthly ? total / 12 : total);
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
      isStudent = false,
      isYoungEmployee = false,
      dependentFamilyMembers = 0,
      hasDisability100 = false,
      isOver70 = false,
      isVolunteer = false,
      pensionContribution = 0
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

    // 1. PRISPEVKI DELOJEMALCA (odštejejo se od bruto plače)
    const employeeContributions = this.calculateSocialContributions(grossIncome, 'employee', month);

    // 1a. OBVEZNI ZDRAVSTVENI PRISPEVEK (OZP)
    const healthInsuranceFee = this.getHealthInsuranceFee(isMonthly, month);

    // Dodaj OZP v total prispevkov delojemalca
    employeeContributions.total = round(employeeContributions.total + healthInsuranceFee);

    // 2. OSNOVA PO PRISPEVKIH (vključuje odbitek vseh prispevkov + OZP)
    const incomeAfterContributions = grossIncome - employeeContributions.total;

    // 3. OLAJŠAVE
    const generalRelief = this.calculateGeneralRelief(grossIncome, isMonthly);
    const childRelief = this.calculateChildRelief(numberOfChildren, isMonthly);

    let totalReliefs = generalRelief + childRelief;

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
    const tax = this.calculateTax(taxBase, period);

    // 6. NETO PLAČA (employeeContributions.total že vključuje OZP)
    const netIncome = round(grossIncome - employeeContributions.total - tax);

    // PRISPEVKI DELODAJALCA
    const employerContributions = this.calculateSocialContributions(grossIncome, 'employer', month);

    // SKUPNE DAJATVE (država prejme) - employeeContributions.total že vključuje OZP
    const totalTaxes = round(employeeContributions.total + tax + employerContributions.total);

    return {
      grossIncome: round(grossIncome),
      contributions: {
        employee: employeeContributions,
        employer: employerContributions,
        healthInsuranceFee
      },
      incomeAfterContributions: round(incomeAfterContributions),
      reliefs: {
        general: generalRelief,
        children: childRelief,
        total: round(totalReliefs)
      },
      taxBase,
      tax,
      healthInsuranceFee,
      netIncome,
      totalCostForEmployer: round(grossIncome + employerContributions.total),
      totalTaxes,
      effectiveRate: round((totalTaxes / (grossIncome + employerContributions.total)) * 100),
      year: this.year,
      period
    };
  }
}

export function round(number) {
  return Math.round(number * 100) / 100
}
