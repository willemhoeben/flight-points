export type Airport = {
  code: string;
  city: string;
  country: string;
  name: string;
  /** Runway coordinates, so award prices and flight times can follow distance. */
  lat: number;
  lon: number;
};

export const AIRPORTS: Airport[] = [
  { code: "JFK", city: "New York", country: "United States", name: "John F. Kennedy Intl", lat: 40.6413, lon: -73.7781 },
  { code: "EWR", city: "Newark", country: "United States", name: "Newark Liberty Intl", lat: 40.6895, lon: -74.1745 },
  { code: "LAX", city: "Los Angeles", country: "United States", name: "Los Angeles Intl", lat: 33.9416, lon: -118.4085 },
  { code: "SFO", city: "San Francisco", country: "United States", name: "San Francisco Intl", lat: 37.6213, lon: -122.379 },
  { code: "ORD", city: "Chicago", country: "United States", name: "O'Hare Intl", lat: 41.9742, lon: -87.9073 },
  { code: "MIA", city: "Miami", country: "United States", name: "Miami Intl", lat: 25.7959, lon: -80.287 },
  { code: "SEA", city: "Seattle", country: "United States", name: "Seattle-Tacoma Intl", lat: 47.4502, lon: -122.3088 },
  { code: "IAD", city: "Washington D.C.", country: "United States", name: "Washington Dulles Intl", lat: 38.9531, lon: -77.4565 },
  { code: "AMS", city: "Amsterdam", country: "Netherlands", name: "Schiphol", lat: 52.3105, lon: 4.7683 },
  { code: "LHR", city: "London", country: "United Kingdom", name: "Heathrow", lat: 51.47, lon: -0.4543 },
  { code: "CDG", city: "Paris", country: "France", name: "Charles de Gaulle", lat: 49.0097, lon: 2.5479 },
  { code: "FRA", city: "Frankfurt", country: "Germany", name: "Frankfurt am Main", lat: 50.0379, lon: 8.5622 },
  { code: "MAD", city: "Madrid", country: "Spain", name: "Adolfo Suárez Madrid-Barajas", lat: 40.4839, lon: -3.568 },
  { code: "IST", city: "Istanbul", country: "Turkey", name: "Istanbul Airport", lat: 41.2753, lon: 28.7519 },
  { code: "DXB", city: "Dubai", country: "United Arab Emirates", name: "Dubai Intl", lat: 25.2532, lon: 55.3657 },
  { code: "DOH", city: "Doha", country: "Qatar", name: "Hamad Intl", lat: 25.2731, lon: 51.608 },
  { code: "SIN", city: "Singapore", country: "Singapore", name: "Changi", lat: 1.3644, lon: 103.9915 },
  { code: "HND", city: "Tokyo", country: "Japan", name: "Haneda", lat: 35.5494, lon: 139.7798 },
  { code: "NRT", city: "Tokyo", country: "Japan", name: "Narita", lat: 35.772, lon: 140.3929 },
  { code: "ICN", city: "Seoul", country: "South Korea", name: "Incheon Intl", lat: 37.4602, lon: 126.4407 },
  { code: "HKG", city: "Hong Kong", country: "Hong Kong", name: "Hong Kong Intl", lat: 22.308, lon: 113.9185 },
  { code: "BKK", city: "Bangkok", country: "Thailand", name: "Suvarnabhumi", lat: 13.69, lon: 100.7501 },
  { code: "SYD", city: "Sydney", country: "Australia", name: "Kingsford Smith", lat: -33.9399, lon: 151.1753 },
  { code: "GRU", city: "São Paulo", country: "Brazil", name: "Guarulhos Intl", lat: -23.4356, lon: -46.4731 },
  { code: "JNB", city: "Johannesburg", country: "South Africa", name: "O.R. Tambo Intl", lat: -26.1367, lon: 28.2411 },
  { code: "CPT", city: "Cape Town", country: "South Africa", name: "Cape Town Intl", lat: -33.9715, lon: 18.6021 },
];

export function findAirport(code: string): Airport | undefined {
  return AIRPORTS.find((a) => a.code === code);
}
