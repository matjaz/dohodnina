export default {
  2020: {
    employee: {
      pension: 0.155,       // 15,5% PIZ
      health: 0.0636,       // 6,36% ZZ
      unemployment: 0.0014, // 0,14% brezposelnost
      parentalCare: 0.001   // 0,01% starševsko varstvo
    },
    employer: {
      pension: 0.0885,      // 8,85% PIZ
      health: 0.0656,       // 6,56% ZZ
      unemployment: 0.0006, // 0,06% zaposlovanje
      parentalCare: 0.001,  // 0,1% starševsko varstvo
      workInjury: 0.0053    // 0,53% poškodbe pri delu
    },
  },
  2021: {
    employee: {
      pension: 0.155,
      health: 0.0636,
      unemployment: 0.0014,
      parentalCare: 0.001
    },
    employer: {
      pension: 0.0885,
      health: 0.0656,
      unemployment: 0.0006,
      parentalCare: 0.001,
      workInjury: 0.0053
    },
  },
  2022: {
    employee: {
      pension: 0.155,
      health: 0.0636,
      unemployment: 0.0014,
      parentalCare: 0.001
    },
    employer: {
      pension: 0.0885,
      health: 0.0656,
      unemployment: 0.0006,
      parentalCare: 0.001,
      workInjury: 0.0053
    },
  },
  2023: {
    employee: {
      pension: 0.155,
      health: 0.0636,
      unemployment: 0.0014,
      parentalCare: 0.001
    },
    employer: {
      pension: 0.0885,
      health: 0.0656,
      unemployment: 0.0006,
      parentalCare: 0.001,
      workInjury: 0.0053
    },
  },
  2024: {
    employee: {
      pension: 0.155,
      health: 0.0636,
      unemployment: 0.0014,
      parentalCare: 0.001
    },
    employer: {
      pension: 0.0885,
      health: 0.0656,
      unemployment: 0.0006,
      parentalCare: 0.001,
      workInjury: 0.0053
    },
    healthInsuranceFee: 35.00 // Obvezni zdravstveni prispevek (od januarja 2024)
  },
  2025: {
    employee: {
      pension: 0.155,
      health: 0.0636,
      unemployment: 0.0014,
      parentalCare: 0.001,
      longTermCare: 0.01     // 1% dolgotrajne oskrbe (od julija 2025)
    },
    employer: {
      pension: 0.0885,
      health: 0.0656,
      unemployment: 0.0006,
      parentalCare: 0.001,
      workInjury: 0.0053,
      longTermCare: 0.01     // 1% dolgotrajne oskrbe (od julija 2025)
    },
    healthInsuranceFee: 37.17, // Od marca 2025
    healthInsuranceFeeBeforeMarch: 35.00 // 35 € do 28. 2. 2025
  },
  2026: {
    employee: {
      pension: 0.155,
      health: 0.0636,
      unemployment: 0.0014,
      parentalCare: 0.001,
      longTermCare: 0.01
    },
    employer: {
      pension: 0.0885,
      health: 0.0656,
      unemployment: 0.0006,
      parentalCare: 0.001,
      workInjury: 0.0053,
      longTermCare: 0.01
    },
    healthInsuranceFee: 39.36, // Od marca 2026 (+5,9% rast povprečne bruto plače 2025)
    healthInsuranceFeeBeforeMarch: 37.17 // 37,17 € do 28. 2. 2026
  }
};
