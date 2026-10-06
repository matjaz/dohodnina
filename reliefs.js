/**
 * Olajšave po ZDoh-2 in letnih pravilnikih FURS.
 * Zneski za otroke so uradni zneski po vrstnem redu otroka (ne linearni inkrement).
 * Vir: pravilniki o usklajenih zneskih olajšav in obvestila FURS za posamezno leto.
 */
export default {
  2020: {
    general: {
      base: 3500.00,
      threshold: 13316.83,
      formula: (income) => {
        if (income <= 13316.83) {
          return 3500.00 + (18700.38 - 1.40427 * income);
        }
        return 3500.00;
      }
    },
    student: { annual: 3500.00 },
    youngEmployee: { annual: 0 },
    dependentChild: {
      amounts: [2436.92, 2649.24, 4418.54, 6187.85, 7957.14],
      furtherIncrement: 1769.30,
      specialCare: 8830.00
    },
    dependentFamily: { annual: 2436.92 },
    disability100: { annual: 17658.84 },
    pension: { maxAmount: 2819.09 }
  },
  2021: {
    general: {
      base: 3500.00,
      threshold: 13316.83,
      formula: (income) => {
        if (income <= 13316.83) {
          return 3500.00 + (18700.38 - 1.40427 * income);
        }
        return 3500.00;
      }
    },
    student: { annual: 3500.00 },
    youngEmployee: { annual: 0 },
    dependentChild: {
      amounts: [2436.92, 2649.24, 4418.54, 6187.85, 7957.14],
      furtherIncrement: 1769.30,
      specialCare: 8830.00
    },
    dependentFamily: { annual: 2436.92 },
    disability100: { annual: 17658.84 },
    pension: { maxAmount: 2819.09 }
  },
  2022: {
    general: {
      base: 4500.00,
      threshold: 13716.33,
      formula: (income) => {
        if (income <= 13716.33) {
          return 4500.00 + (19261.43 - 1.40427 * income);
        }
        return 4500.00;
      }
    },
    student: { annual: 3500.00 },
    youngEmployee: { annual: 0 },
    dependentChild: {
      amounts: [2510.03, 2728.72, 4551.10, 6373.48, 8195.86],
      furtherIncrement: 1822.38,
      specialCare: 9094.90
    },
    dependentFamily: { annual: 2510.03 },
    disability100: { annual: 18188.61 },
    pension: { maxAmount: 2903.66 }
  },
  2023: {
    general: {
      base: 5000.00,
      threshold: 16000.00,
      formula: (income) => {
        if (income <= 16000.00) {
          return 5000.00 + (18761.40 - 1.17259 * income);
        }
        return 5000.00;
      }
    },
    student: { annual: 3500.00 },
    youngEmployee: { annual: 1300.00 },
    dependentChild: {
      amounts: [2698.00, 2933.00, 4892.00, 6851.00, 8810.00],
      furtherIncrement: 1959.00,
      specialCare: 9777.00
    },
    dependentFamily: { annual: 2698.00 },
    disability100: { annual: 18188.61 },
    over70: { annual: 1500.00 },
    volunteer: { annual: 1500.00 },
    pension: { maxAmount: 2903.66 }
  },
  2024: {
    general: {
      base: 5000.00,
      threshold: 16000.00,
      formula: (income) => {
        if (income <= 16000.00) {
          return 5000.00 + (18761.40 - 1.17259 * income);
        }
        return 5000.00;
      }
    },
    student: { annual: 3500.00 },
    youngEmployee: { annual: 1300.00 },
    dependentChild: {
      amounts: [2698.00, 2933.00, 4892.00, 6851.00, 8810.00],
      furtherIncrement: 1959.00,
      specialCare: 9777.00
    },
    dependentFamily: { annual: 2698.00 },
    disability100: { annual: 18188.61 },
    over70: { annual: 1500.00 },
    volunteer: { annual: 1500.00 },
    pension: { maxAmount: 2903.66 }
  },
  2025: {
    general: {
      base: 5260.00,
      threshold: 16832.00,
      formula: (income) => {
        if (income <= 16832.00) {
          return 5260.00 + (19736.99 - 1.17259 * income);
        }
        return 5260.00;
      }
    },
    student: { annual: 3682.00 },
    youngEmployee: { annual: 1367.60 },
    dependentChild: {
      amounts: [2838.30, 3085.52, 5146.39, 7207.26, 9268.12],
      furtherIncrement: 2060.87,
      specialCare: 10285.40
    },
    dependentFamily: { annual: 2838.30 },
    disability100: { annual: 19134.42 },
    over70: { annual: 1578.00 },
    volunteer: { annual: 1578.00 },
    pension: { maxAmount: 3054.65 },
    // ZDoh-2, 113.a člen (ZDoh-2AB): zmanjšanje dohodnine, ne davčne osnove.
    newResidentRate: 0.07
  },
  2026: {
    general: {
      base: 5551.93,
      threshold: 17766.18,
      formula: (income) => {
        if (income <= 17766.18) {
          return 5551.93 + (20832.39 - 1.17259 * income);
        }
        return 5551.93;
      }
    },
    student: { annual: 3886.35 },
    youngEmployee: { annual: 1443.50 },
    dependentChild: {
      amounts: [2995.83, 3256.77, 5432.02, 7607.27, 9782.51],
      furtherIncrement: 2175.25,
      specialCare: 10856.24
    },
    dependentFamily: { annual: 2995.83 },
    disability100: { annual: 20196.38 },
    over70: { annual: 1665.58 },
    volunteer: { annual: 1665.58 },
    pension: { maxAmount: 3224.18 },
    newResidentRate: 0.07
  }
};
