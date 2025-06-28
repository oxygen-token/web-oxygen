// 📊 Constantes de Emisión de CO₂e para Calculadora de Huella de Carbono

export interface EmissionOption {
  label: string;
  value: string;
  emission: number; // toneladas CO₂e/año
  multiplier?: number; // para ajustes (Q2, Q10, Q13, Q14)
}

export interface Question {
  id: string;
  titleKey: string;
  type: 'slider' | 'radio' | 'dropdown';
  options: EmissionOption[];
  section: 'transport' | 'flights' | 'energy';
  dependsOn?: string; // para preguntas que modifican otras
}

// Q1: Distancia anual en vehículo personal
export const Q1_VEHICLE_DISTANCE: EmissionOption[] = [
  { label: "options.q1.0", value: "0", emission: 0 },
  { label: "options.q1.low", value: "low", emission: 1.0 },
  { label: "options.q1.medium", value: "medium", emission: 1.5 },
  { label: "options.q1.high", value: "high", emission: 3.0 },
  { label: "options.q1.very_high", value: "very_high", emission: 4.0 }
];

// Q2: Tipo de vehículo (multiplica Q1)
export const Q2_VEHICLE_TYPE: EmissionOption[] = [
  { label: "options.q2.none", value: "none", emission: 0, multiplier: 0 },
  { label: "options.q2.gasoline", value: "gasoline", emission: 0, multiplier: 1 },
  { label: "options.q2.hybrid", value: "hybrid", emission: 0, multiplier: 0.5 },
  { label: "options.q2.electric", value: "electric", emission: 0, multiplier: 0.25 }
];

// Q3: Uso de colectivo/bus
export const Q3_BUS_USAGE: EmissionOption[] = [
  { label: "options.q3.never", value: "never", emission: 0 },
  { label: "options.q3.occasional", value: "occasional", emission: 0.1 },
  { label: "options.q3.regular", value: "regular", emission: 0.45 },
  { label: "options.q3.intensive", value: "intensive", emission: 0.9 }
];

// Q4: Uso de tren/subte
export const Q4_TRAIN_USAGE: EmissionOption[] = [
  { label: "options.q4.never", value: "never", emission: 0 },
  { label: "options.q4.occasional", value: "occasional", emission: 0.05 },
  { label: "options.q4.regular", value: "regular", emission: 0.2 },
  { label: "options.q4.intensive", value: "intensive", emission: 0.4 }
];

// Q5: Vuelos cortos por año
export const Q5_SHORT_FLIGHTS: EmissionOption[] = [
  { label: "options.q5.0", value: "0", emission: 0 },
  { label: "options.q5.low", value: "low", emission: 0.375 },
  { label: "options.q5.medium", value: "medium", emission: 1.0 },
  { label: "options.q5.high", value: "high", emission: 2.0 }
];

// Q6: Vuelos largos por año
export const Q6_LONG_FLIGHTS: EmissionOption[] = [
  { label: "options.q6.0", value: "0", emission: 0 },
  { label: "options.q6.one", value: "one", emission: 1.0 },
  { label: "options.q6.two", value: "two", emission: 2.0 },
  { label: "options.q6.medium", value: "medium", emission: 3.25 },
  { label: "options.q6.high", value: "high", emission: 5.0 }
];

// Q7: Tipo de dieta
export const Q7_DIET_TYPE: EmissionOption[] = [
  { label: "options.q7.carnivore", value: "carnivore", emission: 2.6 },
  { label: "options.q7.omnivore", value: "omnivore", emission: 2.0 },
  { label: "options.q7.low_meat", value: "low_meat", emission: 1.7 },
  { label: "options.q7.vegetarian", value: "vegetarian", emission: 1.4 },
  { label: "options.q7.vegan", value: "vegan", emission: 1.0 }
];

// Q8: Consumo eléctrico del hogar (se divide por Q10)
export const Q8_ELECTRICITY: EmissionOption[] = [
  { label: "options.q8.low", value: "low", emission: 1.0 },
  { label: "options.q8.medium", value: "medium", emission: 2.4 },
  { label: "options.q8.high", value: "high", emission: 4.8 },
  { label: "options.q8.very_high", value: "very_high", emission: 7.0 }
];

// Q9: Uso de gas/combustible (se divide por Q10)
export const Q9_GAS_USAGE: EmissionOption[] = [
  { label: "options.q9.none", value: "none", emission: 0 },
  { label: "options.q9.low", value: "low", emission: 0.4 },
  { label: "options.q9.medium", value: "medium", emission: 1.5 },
  { label: "options.q9.high", value: "high", emission: 3.0 }
];

// Q10: Personas en el hogar (divide Q8 y Q9)
export const Q10_HOUSEHOLD_SIZE: EmissionOption[] = [
  { label: "options.q10.1", value: "1", emission: 0, multiplier: 1 },
  { label: "options.q10.2", value: "2", emission: 0, multiplier: 0.5 },
  { label: "options.q10.3", value: "3", emission: 0, multiplier: 0.33 },
  { label: "options.q10.4", value: "4", emission: 0, multiplier: 0.25 },
  { label: "options.q10.5+", value: "5+", emission: 0, multiplier: 0.2 }
];

// Q11: Consumo de bienes y servicios
export const Q11_CONSUMPTION: EmissionOption[] = [
  { label: "options.q11.minimal", value: "minimal", emission: 1.0 },
  { label: "options.q11.average", value: "average", emission: 2.5 },
  { label: "options.q11.frequent", value: "frequent", emission: 5.0 },
  { label: "options.q11.luxury", value: "luxury", emission: 8.0 }
];

// Q12: Basura no reciclada (se reduce por Q13)
export const Q12_WASTE: EmissionOption[] = [
  { label: "options.q12.very_low", value: "very_low", emission: 0.1 },
  { label: "options.q12.average", value: "average", emission: 0.3 },
  { label: "options.q12.high", value: "high", emission: 0.55 }
];

// Q13: Nivel de reciclaje (reduce Q12)
export const Q13_RECYCLING: EmissionOption[] = [
  { label: "options.q13.none", value: "none", emission: 0, multiplier: 1 },
  { label: "options.q13.some", value: "some", emission: 0, multiplier: 0.65 },
  { label: "options.q13.most", value: "most", emission: 0, multiplier: 0.2 }
];

// Q14: Energía renovable (reduce Q8)
export const Q14_RENEWABLE: EmissionOption[] = [
  { label: "options.q14.none", value: "none", emission: 0, multiplier: 1 },
  { label: "options.q14.partial", value: "partial", emission: 0, multiplier: 0.625 },
  { label: "options.q14.total", value: "total", emission: 0, multiplier: 0 }
];

// Q15: Cruceros por año
export const Q15_CRUISES: EmissionOption[] = [
  { label: "options.q15.none", value: "none", emission: 0 },
  { label: "options.q15.occasional", value: "occasional", emission: 1.75 },
  { label: "options.q15.average", value: "average", emission: 3.0 },
  { label: "options.q15.frequent", value: "frequent", emission: 7.5 }
];

// Configuración de preguntas
export const QUESTIONS: Question[] = [
  {
    id: 'q1',
    titleKey: 'transport.distance',
    type: 'dropdown',
    options: Q1_VEHICLE_DISTANCE,
    section: 'transport'
  },
  {
    id: 'q2',
    titleKey: 'transport.vehicleType',
    type: 'dropdown',
    options: Q2_VEHICLE_TYPE,
    section: 'transport',
    dependsOn: 'q1'
  },
  {
    id: 'q3',
    titleKey: 'transport.busFreq',
    type: 'radio',
    options: Q3_BUS_USAGE,
    section: 'transport'
  },
  {
    id: 'q4',
    titleKey: 'transport.trainFreq',
    type: 'radio',
    options: Q4_TRAIN_USAGE,
    section: 'transport'
  },
  {
    id: 'q5',
    titleKey: 'flights.shortFlights',
    type: 'dropdown',
    options: Q5_SHORT_FLIGHTS,
    section: 'flights'
  },
  {
    id: 'q6',
    titleKey: 'flights.longFlights',
    type: 'dropdown',
    options: Q6_LONG_FLIGHTS,
    section: 'flights'
  },
  {
    id: 'q7',
    titleKey: 'flights.diet',
    type: 'radio',
    options: Q7_DIET_TYPE,
    section: 'flights'
  },
  {
    id: 'q8',
    titleKey: 'energy.electricity',
    type: 'dropdown',
    options: Q8_ELECTRICITY,
    section: 'energy'
  },
  {
    id: 'q9',
    titleKey: 'energy.gas',
    type: 'radio',
    options: Q9_GAS_USAGE,
    section: 'energy'
  },
  {
    id: 'q10',
    titleKey: 'energy.householdSize',
    type: 'dropdown',
    options: Q10_HOUSEHOLD_SIZE,
    section: 'energy',
    dependsOn: 'q8,q9'
  },
  {
    id: 'q11',
    titleKey: 'energy.consumption',
    type: 'radio',
    options: Q11_CONSUMPTION,
    section: 'energy'
  },
  {
    id: 'q12',
    titleKey: 'energy.waste',
    type: 'radio',
    options: Q12_WASTE,
    section: 'energy'
  },
  {
    id: 'q13',
    titleKey: 'energy.recycling',
    type: 'radio',
    options: Q13_RECYCLING,
    section: 'energy',
    dependsOn: 'q12'
  },
  {
    id: 'q14',
    titleKey: 'energy.renewable',
    type: 'radio',
    options: Q14_RENEWABLE,
    section: 'energy',
    dependsOn: 'q8'
  },
  {
    id: 'q15',
    titleKey: 'energy.cruises',
    type: 'dropdown',
    options: Q15_CRUISES,
    section: 'energy'
  }
];

// Función para calcular emisiones totales
export function calculateTotalEmissions(answers: Record<string, string>): number {
  let total = 0;
  
  // Calcular Q1 ajustado por Q2
  const q1Emission = Q1_VEHICLE_DISTANCE.find(opt => opt.value === answers.q1)?.emission || 0;
  const q2Multiplier = Q2_VEHICLE_TYPE.find(opt => opt.value === answers.q2)?.multiplier || 1;
  total += q1Emission * q2Multiplier;
  
  // Q3, Q4 directas
  total += Q3_BUS_USAGE.find(opt => opt.value === answers.q3)?.emission || 0;
  total += Q4_TRAIN_USAGE.find(opt => opt.value === answers.q4)?.emission || 0;
  
  // Q5, Q6, Q7 directas
  total += Q5_SHORT_FLIGHTS.find(opt => opt.value === answers.q5)?.emission || 0;
  total += Q6_LONG_FLIGHTS.find(opt => opt.value === answers.q6)?.emission || 0;
  total += Q7_DIET_TYPE.find(opt => opt.value === answers.q7)?.emission || 0;
  
  // Q8 ajustado por Q10 y Q14
  const q8Emission = Q8_ELECTRICITY.find(opt => opt.value === answers.q8)?.emission || 0;
  const q10Multiplier = Q10_HOUSEHOLD_SIZE.find(opt => opt.value === answers.q10)?.multiplier || 1;
  const q14Multiplier = Q14_RENEWABLE.find(opt => opt.value === answers.q14)?.multiplier || 1;
  total += (q8Emission * q10Multiplier * q14Multiplier);
  
  // Q9 ajustado por Q10
  const q9Emission = Q9_GAS_USAGE.find(opt => opt.value === answers.q9)?.emission || 0;
  total += (q9Emission * q10Multiplier);
  
  // Q11 directa
  total += Q11_CONSUMPTION.find(opt => opt.value === answers.q11)?.emission || 0;
  
  // Q12 ajustado por Q13
  const q12Emission = Q12_WASTE.find(opt => opt.value === answers.q12)?.emission || 0;
  const q13Multiplier = Q13_RECYCLING.find(opt => opt.value === answers.q13)?.multiplier || 1;
  total += (q12Emission * q13Multiplier);
  
  // Q15 directa
  total += Q15_CRUISES.find(opt => opt.value === answers.q15)?.emission || 0;
  
  return Math.ceil(total * 10) / 10; // Redondear a 1 decimal
} 