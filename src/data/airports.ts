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
  { code: "YYZ", city: "Toronto", country: "Canada", name: "Toronto Pearson Intl", lat: 43.6777, lon: -79.6248 },
  { code: "YVR", city: "Vancouver", country: "Canada", name: "Vancouver Intl", lat: 49.1967, lon: -123.1815 },
  { code: "YUL", city: "Montreal", country: "Canada", name: "Montréal-Trudeau", lat: 45.4706, lon: -73.7408 },
  { code: "BOS", city: "Boston", country: "United States", name: "Logan Intl", lat: 42.3656, lon: -71.0096 },
  { code: "ATL", city: "Atlanta", country: "United States", name: "Hartsfield-Jackson Intl", lat: 33.6407, lon: -84.4277 },
  { code: "DFW", city: "Dallas", country: "United States", name: "Dallas/Fort Worth Intl", lat: 32.8998, lon: -97.0403 },
  { code: "DEN", city: "Denver", country: "United States", name: "Denver Intl", lat: 39.8561, lon: -104.6737 },
  { code: "IAH", city: "Houston", country: "United States", name: "George Bush Intercontinental", lat: 29.9902, lon: -95.3368 },
  { code: "MEX", city: "Mexico City", country: "Mexico", name: "Benito Juárez Intl", lat: 19.4363, lon: -99.0721 },
  { code: "FCO", city: "Rome", country: "Italy", name: "Fiumicino", lat: 41.8003, lon: 12.2389 },
  { code: "MXP", city: "Milan", country: "Italy", name: "Malpensa", lat: 45.6301, lon: 8.7255 },
  { code: "MUC", city: "Munich", country: "Germany", name: "Franz Josef Strauss", lat: 48.3537, lon: 11.775 },
  { code: "ZRH", city: "Zurich", country: "Switzerland", name: "Zurich Airport", lat: 47.4647, lon: 8.5492 },
  { code: "VIE", city: "Vienna", country: "Austria", name: "Vienna Intl", lat: 48.1103, lon: 16.5697 },
  { code: "BRU", city: "Brussels", country: "Belgium", name: "Brussels Airport", lat: 50.9014, lon: 4.4844 },
  { code: "CPH", city: "Copenhagen", country: "Denmark", name: "Kastrup", lat: 55.618, lon: 12.6508 },
  { code: "ARN", city: "Stockholm", country: "Sweden", name: "Arlanda", lat: 59.6519, lon: 17.9186 },
  { code: "OSL", city: "Oslo", country: "Norway", name: "Gardermoen", lat: 60.1939, lon: 11.1004 },
  { code: "HEL", city: "Helsinki", country: "Finland", name: "Helsinki-Vantaa", lat: 60.3172, lon: 24.9633 },
  { code: "DUB", city: "Dublin", country: "Ireland", name: "Dublin Airport", lat: 53.4213, lon: -6.2701 },
  { code: "LIS", city: "Lisbon", country: "Portugal", name: "Humberto Delgado", lat: 38.7756, lon: -9.1354 },
  { code: "BCN", city: "Barcelona", country: "Spain", name: "El Prat", lat: 41.2974, lon: 2.0833 },
  { code: "ATH", city: "Athens", country: "Greece", name: "Eleftherios Venizelos", lat: 37.9364, lon: 23.9445 },
  { code: "WAW", city: "Warsaw", country: "Poland", name: "Chopin Airport", lat: 52.1657, lon: 20.9671 },
  { code: "AUH", city: "Abu Dhabi", country: "United Arab Emirates", name: "Zayed Intl", lat: 24.433, lon: 54.6511 },
  { code: "TLV", city: "Tel Aviv", country: "Israel", name: "Ben Gurion", lat: 32.0114, lon: 34.8867 },
  { code: "CAI", city: "Cairo", country: "Egypt", name: "Cairo Intl", lat: 30.1219, lon: 31.4056 },
  { code: "NBO", city: "Nairobi", country: "Kenya", name: "Jomo Kenyatta Intl", lat: -1.3192, lon: 36.9278 },
  { code: "CMN", city: "Casablanca", country: "Morocco", name: "Mohammed V Intl", lat: 33.3675, lon: -7.5899 },
  { code: "PVG", city: "Shanghai", country: "China", name: "Pudong Intl", lat: 31.1443, lon: 121.8083 },
  { code: "PEK", city: "Beijing", country: "China", name: "Capital Intl", lat: 40.0799, lon: 116.6031 },
  { code: "TPE", city: "Taipei", country: "Taiwan", name: "Taoyuan Intl", lat: 25.0777, lon: 121.2328 },
  { code: "KUL", city: "Kuala Lumpur", country: "Malaysia", name: "Kuala Lumpur Intl", lat: 2.7456, lon: 101.7099 },
  { code: "CGK", city: "Jakarta", country: "Indonesia", name: "Soekarno-Hatta Intl", lat: -6.1256, lon: 106.6559 },
  { code: "DEL", city: "Delhi", country: "India", name: "Indira Gandhi Intl", lat: 28.5562, lon: 77.1 },
  { code: "BOM", city: "Mumbai", country: "India", name: "Chhatrapati Shivaji Intl", lat: 19.0896, lon: 72.8656 },
  { code: "KIX", city: "Osaka", country: "Japan", name: "Kansai Intl", lat: 34.4273, lon: 135.2444 },
  { code: "MNL", city: "Manila", country: "Philippines", name: "Ninoy Aquino Intl", lat: 14.5086, lon: 121.0198 },
  { code: "MEL", city: "Melbourne", country: "Australia", name: "Tullamarine", lat: -37.669, lon: 144.841 },
  { code: "PER", city: "Perth", country: "Australia", name: "Perth Airport", lat: -31.9403, lon: 115.9669 },
  { code: "AKL", city: "Auckland", country: "New Zealand", name: "Auckland Airport", lat: -37.0082, lon: 174.785 },
  { code: "EZE", city: "Buenos Aires", country: "Argentina", name: "Ezeiza Intl", lat: -34.8222, lon: -58.5358 },
  { code: "SCL", city: "Santiago", country: "Chile", name: "Arturo Merino Benítez", lat: -33.393, lon: -70.7858 },
  { code: "BOG", city: "Bogotá", country: "Colombia", name: "El Dorado Intl", lat: 4.7016, lon: -74.1469 },
  { code: "LIM", city: "Lima", country: "Peru", name: "Jorge Chávez Intl", lat: -12.0219, lon: -77.1143 },
  { code: "GIG", city: "Rio de Janeiro", country: "Brazil", name: "Galeão Intl", lat: -22.81, lon: -43.2506 },
  { code: "PTY", city: "Panama City", country: "Panama", name: "Tocumen Intl", lat: 9.0714, lon: -79.3835 },
  // Second and third gateways for metros that already have one. Award space
  // is sold per airport, so a New Yorker who only ever searches JFK misses
  // whatever EWR and LGA released that morning.
  { code: "LGA", city: "New York", country: "United States", name: "LaGuardia", lat: 40.7769, lon: -73.874 },
  { code: "LGW", city: "London", country: "United Kingdom", name: "Gatwick", lat: 51.1537, lon: -0.1821 },
  { code: "ORY", city: "Paris", country: "France", name: "Orly", lat: 48.7262, lon: 2.3652 },
  { code: "DCA", city: "Washington D.C.", country: "United States", name: "Ronald Reagan National", lat: 38.8512, lon: -77.0402 },
  { code: "BWI", city: "Baltimore", country: "United States", name: "Baltimore/Washington Intl", lat: 39.1774, lon: -76.6684 },
  { code: "MDW", city: "Chicago", country: "United States", name: "Midway Intl", lat: 41.7868, lon: -87.7522 },
  { code: "OAK", city: "Oakland", country: "United States", name: "Oakland Intl", lat: 37.7126, lon: -122.2197 },
  { code: "HOU", city: "Houston", country: "United States", name: "William P. Hobby", lat: 29.6454, lon: -95.2789 },
  { code: "DAL", city: "Dallas", country: "United States", name: "Dallas Love Field", lat: 32.8471, lon: -96.8518 },
  { code: "GMP", city: "Seoul", country: "South Korea", name: "Gimpo Intl", lat: 37.5583, lon: 126.7906 },
  { code: "SHA", city: "Shanghai", country: "China", name: "Hongqiao Intl", lat: 31.1979, lon: 121.3363 },
  { code: "LIN", city: "Milan", country: "Italy", name: "Linate", lat: 45.4451, lon: 9.2767 },

  // The places people actually save points for, and the hubs that reach them.
  { code: "HNL", city: "Honolulu", country: "United States", name: "Daniel K. Inouye Intl", lat: 21.3245, lon: -157.9251 },
  { code: "ANC", city: "Anchorage", country: "United States", name: "Ted Stevens Anchorage Intl", lat: 61.1743, lon: -149.9962 },
  { code: "CUN", city: "Cancún", country: "Mexico", name: "Cancún Intl", lat: 21.0365, lon: -86.8771 },
  { code: "SJO", city: "San José", country: "Costa Rica", name: "Juan Santamaría Intl", lat: 9.9939, lon: -84.2088 },
  { code: "MLE", city: "Malé", country: "Maldives", name: "Velana Intl", lat: 4.1918, lon: 73.5291 },
  { code: "DPS", city: "Denpasar", country: "Indonesia", name: "Ngurah Rai Intl", lat: -8.7482, lon: 115.1672 },
  { code: "PPT", city: "Papeete", country: "French Polynesia", name: "Faa'a Intl", lat: -17.5537, lon: -149.607 },
  { code: "NAN", city: "Nadi", country: "Fiji", name: "Nadi Intl", lat: -17.7554, lon: 177.4434 },
  { code: "MRU", city: "Port Louis", country: "Mauritius", name: "Sir Seewoosagur Ramgoolam Intl", lat: -20.4302, lon: 57.6836 },
  { code: "ADD", city: "Addis Ababa", country: "Ethiopia", name: "Bole Intl", lat: 8.9779, lon: 38.7993 },
  { code: "LOS", city: "Lagos", country: "Nigeria", name: "Murtala Muhammed Intl", lat: 6.5774, lon: 3.3212 },
  { code: "ACC", city: "Accra", country: "Ghana", name: "Kotoka Intl", lat: 5.6052, lon: -0.1668 },
  { code: "SGN", city: "Ho Chi Minh City", country: "Vietnam", name: "Tan Son Nhat Intl", lat: 10.8188, lon: 106.652 },
  { code: "HAN", city: "Hanoi", country: "Vietnam", name: "Noi Bai Intl", lat: 21.2212, lon: 105.8072 },
  { code: "RUH", city: "Riyadh", country: "Saudi Arabia", name: "King Khalid Intl", lat: 24.9576, lon: 46.6988 },
  { code: "JED", city: "Jeddah", country: "Saudi Arabia", name: "King Abdulaziz Intl", lat: 21.6796, lon: 39.1565 },
  { code: "CMB", city: "Colombo", country: "Sri Lanka", name: "Bandaranaike Intl", lat: 7.1808, lon: 79.8841 },
  { code: "KEF", city: "Reykjavík", country: "Iceland", name: "Keflavík Intl", lat: 63.985, lon: -22.6056 },
  { code: "PRG", city: "Prague", country: "Czechia", name: "Václav Havel Airport Prague", lat: 50.1008, lon: 14.26 },
  { code: "BUD", city: "Budapest", country: "Hungary", name: "Ferenc Liszt Intl", lat: 47.4369, lon: 19.2556 },
  { code: "EDI", city: "Edinburgh", country: "United Kingdom", name: "Edinburgh Airport", lat: 55.95, lon: -3.3725 },
  { code: "BNE", city: "Brisbane", country: "Australia", name: "Brisbane Airport", lat: -27.3842, lon: 153.1175 },
];

/**
 * Indexed rather than scanned. findAirport is called from inside the award
 * search's per-program loop, which /explore runs 1,470 times for one page,
 * and a linear scan of a hundred-odd airports inside that is the classic
 * find-in-a-loop.
 */
const BY_CODE = new Map(AIRPORTS.map((a) => [a.code, a]));

export function findAirport(code: string): Airport | undefined {
  return BY_CODE.get(code);
}
