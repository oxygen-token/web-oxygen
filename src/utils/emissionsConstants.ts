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
  { label: "0 km", value: "0", emission: 0 },
  { label: "Menos de 5.000 km", value: "low", emission: 1.0 },
  { label: "5.000–10.000 km", value: "medium", emission: 1.5 },
  { label: "10.000–20.000 km", value: "high", emission: 3.0 },
  { label: "Más de 20.000 km", value: "very_high", emission: 4.0 }
];

// Q2: Tipo de vehículo (multiplica Q1)
export const Q2_VEHICLE_TYPE: EmissionOption[] = [
  { label: "Sin vehículo", value: "none", emission: 0, multiplier: 0 },
  { label: "Gasolina / Diesel", value: "gasoline", emission: 0, multiplier: 1 },
  { label: "Híbrido", value: "hybrid", emission: 0, multiplier: 0.5 },
  { label: "Eléctrico", value: "electric", emission: 0, multiplier: 0.25 }
];

// Q3: Uso de colectivo/bus
export const Q3_BUS_USAGE: EmissionOption[] = [
  { label: "Nunca o rara vez", value: "never", emission: 0 },
  { label: "Ocasional (1–2 veces por semana)", value: "occasional", emission: 0.1 },
  { label: "Regular (viaje diario)", value: "regular", emission: 0.45 },
  { label: "Intenso (varios viajes por día)", value: "intensive", emission: 0.9 }
];

// Q4: Uso de tren/subte
export const Q4_TRAIN_USAGE: EmissionOption[] = [
  { label: "Nunca", value: "never", emission: 0 },
  { label: "Ocasional (1–2 viajes por semana)", value: "occasional", emission: 0.05 },
  { label: "Regular (diario)", value: "regular", emission: 0.2 },
  { label: "Intenso (frecuente o largas dist.)", value: "intensive", emission: 0.4 }
];

// Q5: Vuelos cortos por año
export const Q5_SHORT_FLIGHTS: EmissionOption[] = [
  { label: "0 vuelos", value: "0", emission: 0 },
  { label: "1–2 vuelos cortos", value: "low", emission: 0.375 }, // promedio 0.25-0.5
  { label: "3–5 vuelos cortos", value: "medium", emission: 1.0 }, // promedio 0.75-1.25
  { label: "Más de 5 vuelos cortos", value: "high", emission: 2.0 }
];

// Q6: Vuelos largos por año
export const Q6_LONG_FLIGHTS: EmissionOption[] = [
  { label: "0 vuelos", value: "0", emission: 0 },
  { label: "1 vuelo largo", value: "one", emission: 1.0 }, // promedio 0.8-1.2
  { label: "2 vuelos largos", value: "two", emission: 2.0 }, // promedio 1.6-2.4
  { label: "3–4 vuelos largos", value: "medium", emission: 3.25 }, // promedio 2.5-4.0
  { label: "Más de 4 vuelos largos", value: "high", emission: 5.0 }
];

// Q7: Tipo de dieta
export const Q7_DIET_TYPE: EmissionOption[] = [
  { label: "Carnívoro (alta carne)", value: "carnivore", emission: 2.6 },
  { label: "Omnívoro promedio", value: "omnivore", emission: 2.0 },
  { label: "Poca carne", value: "low_meat", emission: 1.7 },
  { label: "Vegetariano", value: "vegetarian", emission: 1.4 },
  { label: "Vegano", value: "vegan", emission: 1.0 }
];

// Q8: Consumo eléctrico del hogar (se divide por Q10)
export const Q8_ELECTRICITY: EmissionOption[] = [
  { label: "Bajo (~2.000 kWh)", value: "low", emission: 1.0 },
  { label: "Medio (~5.000 kWh)", value: "medium", emission: 2.4 },
  { label: "Alto (~10.000 kWh)", value: "high", emission: 4.8 },
  { label: "Muy alto (>15.000 kWh)", value: "very_high", emission: 7.0 }
];

// Q9: Uso de gas/combustible (se divide por Q10)
export const Q9_GAS_USAGE: EmissionOption[] = [
  { label: "Ninguno (eléctrico)", value: "none", emission: 0 },
  { label: "Bajo uso (cocina/agua)", value: "low", emission: 0.4 }, // promedio 0.3-0.5
  { label: "Medio (uso típico)", value: "medium", emission: 1.5 }, // promedio 1.0-2.0
  { label: "Alto (clima frío, casa grande)", value: "high", emission: 3.0 }
];

// Q10: Personas en el hogar (divide Q8 y Q9)
export const Q10_HOUSEHOLD_SIZE: EmissionOption[] = [
  { label: "1 persona", value: "1", emission: 0, multiplier: 1 },
  { label: "2 personas", value: "2", emission: 0, multiplier: 0.5 },
  { label: "3 personas", value: "3", emission: 0, multiplier: 0.33 },
  { label: "4 personas", value: "4", emission: 0, multiplier: 0.25 },
  { label: "5 o más personas", value: "5+", emission: 0, multiplier: 0.2 }
];

// Q11: Consumo de bienes y servicios
export const Q11_CONSUMPTION: EmissionOption[] = [
  { label: "Minimalista", value: "minimal", emission: 1.0 },
  { label: "Promedio", value: "average", emission: 2.5 },
  { label: "Consumidor frecuente", value: "frequent", emission: 5.0 },
  { label: "Alta gama / lujo", value: "luxury", emission: 8.0 }
];

// Q12: Basura no reciclada (se reduce por Q13)
export const Q12_WASTE: EmissionOption[] = [
  { label: "Muy poca (<5 kg/semana)", value: "very_low", emission: 0.1 },
  { label: "Promedio (1–2 bolsas)", value: "average", emission: 0.3 },
  { label: "Alta (>30 kg/semana)", value: "high", emission: 0.55 } // promedio 0.5-0.6
];

// Q13: Nivel de reciclaje (reduce Q12)
export const Q13_RECYCLING: EmissionOption[] = [
  { label: "Nada o muy poco (0–20%)", value: "none", emission: 0, multiplier: 1 },
  { label: "Algo (~30–60%)", value: "some", emission: 0, multiplier: 0.65 }, // promedio -30% a -40%
  { label: "Casi todo (80–100%)", value: "most", emission: 0, multiplier: 0.2 } // -80%
];

// Q14: Energía renovable (reduce Q8)
export const Q14_RENEWABLE: EmissionOption[] = [
  { label: "No (solo red convencional)", value: "none", emission: 0, multiplier: 1 },
  { label: "Parcial (ej. plan verde)", value: "partial", emission: 0, multiplier: 0.625 }, // promedio -25% a -50%
  { label: "Total (100% renovable / solar)", value: "total", emission: 0, multiplier: 0 } // -100%
];

// Q15: Cruceros por año
export const Q15_CRUISES: EmissionOption[] = [
  { label: "Ninguno", value: "none", emission: 0 },
  { label: "Ocasional (3–4 días)", value: "occasional", emission: 1.75 }, // promedio 1.5-2.0
  { label: "Promedio (1 semana al año)", value: "average", emission: 3.0 },
  { label: "Frecuente o extensos", value: "frequent", emission: 7.5 } // promedio 5.0-10.0+
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