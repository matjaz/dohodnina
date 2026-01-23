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
      first: 2397.83,
      increment: 1769.30
    },
    dependentFamily: { annual: 2397.83 },
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
      first: 2397.83,
      increment: 1769.30
    },
    dependentFamily: { annual: 2397.83 },
    pension: { maxAmount: 2819.09 }
  },
  2022: {
    general: {
      base: 4500.00,
      threshold: 15243.06,
      formula: (income) => {
        if (income <= 15243.06) {
          return 4500.00 + (18188.61 - 1.19329 * income);
        }
        return 4500.00;
      }
    },
    student: { annual: 3500.00 },
    youngEmployee: { annual: 0 },
    dependentChild: {
      first: 2460.56,
      increment: 1822.38
    },
    dependentFamily: { annual: 2460.56 },
    pension: { maxAmount: 2903.66 }
  },
  2023: {
    general: {
      base: 5000.00,
      threshold: 15933.00,
      formula: (income) => {
        if (income <= 15933.00) {
          return 5000.00 + (18696.00 - 1.17309 * income);
        }
        return 5000.00;
      }
    },
    student: { annual: 3500.00 },
    youngEmployee: { annual: 1300.00 },
    dependentChild: {
      first: 2701.23,
      increment: 1959.00
    },
    dependentFamily: { annual: 2701.23 },
    pension: { maxAmount: 2903.66 }
  },
  2024: {
    general: {
      base: 5000.00,
      threshold: 15933.00,
      formula: (income) => {
        if (income <= 15933.00) {
          return 5000.00 + (18696.00 - 1.17309 * income);
        }
        return 5000.00;
      }
    },
    student: { annual: 3500.00 },
    youngEmployee: { annual: 1300.00 },
    dependentChild: {
      first: 2701.23,
      increment: 1959.00
    },
    dependentFamily: { annual: 2701.23 },
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
      first: 2838.30,
      increment: 2060.87
    },
    dependentFamily: { annual: 2838.30 },
    disability100: { annual: 19134.42 },
    over70: { annual: 1578.00 },
    volunteer: { annual: 1578.00 },
    pension: { maxAmount: 3054.65 }
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
      first: 2995.83,
      increment: 2175.25
    },
    dependentFamily: { annual: 2995.83 },
    disability100: { annual: 20196.38 },
    over70: { annual: 1665.58 },
    volunteer: { annual: 1665.58 },
    pension: { maxAmount: 3224.18 }
  }
};
