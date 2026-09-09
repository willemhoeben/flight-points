export type Airport = {
  code: string;
  city: string;
  country: string;
  name: string;
};

export const AIRPORTS: Airport[] = [
  { code: "JFK", city: "New York", country: "United States", name: "John F. Kennedy Intl" },
  { code: "EWR", city: "Newark", country: "United States", name: "Newark Liberty Intl" },
  { code: "LAX", city: "Los Angeles", country: "United States", name: "Los Angeles Intl" },
  { code: "SFO", city: "San Francisco", country: "United States", name: "San Francisco Intl" },
  { code: "ORD", city: "Chicago", country: "United States", name: "O'Hare Intl" },
  { code: "MIA", city: "Miami", country: "United States", name: "Miami Intl" },
  { code: "SEA", city: "Seattle", country: "United States", name: "Seattle-Tacoma Intl" },
  { code: "IAD", city: "Washington D.C.", country: "United States", name: "Washington Dulles Intl" },
  { code: "AMS", city: "Amsterdam", country: "Netherlands", name: "Schiphol" },
  { code: "LHR", city: "London", country: "United Kingdom", name: "Heathrow" },
  { code: "CDG", city: "Paris", country: "France", name: "Charles de Gaulle" },
  { code: "FRA", city: "Frankfurt", country: "Germany", name: "Frankfurt am Main" },
  { code: "MAD", city: "Madrid", country: "Spain", name: "Adolfo Suárez Madrid-Barajas" },
  { code: "IST", city: "Istanbul", country: "Turkey", name: "Istanbul Airport" },
  { code: "DXB", city: "Dubai", country: "United Arab Emirates", name: "Dubai Intl" },
  { code: "DOH", city: "Doha", country: "Qatar", name: "Hamad Intl" },
  { code: "SIN", city: "Singapore", country: "Singapore", name: "Changi" },
  { code: "HND", city: "Tokyo", country: "Japan", name: "Haneda" },
  { code: "NRT", city: "Tokyo", country: "Japan", name: "Narita" },
  { code: "ICN", city: "Seoul", country: "South Korea", name: "Incheon Intl" },
  { code: "HKG", city: "Hong Kong", country: "Hong Kong", name: "Hong Kong Intl" },
  { code: "BKK", city: "Bangkok", country: "Thailand", name: "Suvarnabhumi" },
  { code: "SYD", city: "Sydney", country: "Australia", name: "Kingsford Smith" },
  { code: "GRU", city: "São Paulo", country: "Brazil", name: "Guarulhos Intl" },
  { code: "JNB", city: "Johannesburg", country: "South Africa", name: "O.R. Tambo Intl" },
  { code: "CPT", city: "Cape Town", country: "South Africa", name: "Cape Town Intl" },
];

export function findAirport(code: string): Airport | undefined {
  return AIRPORTS.find((a) => a.code === code);
}
