import type { Locale } from "@/lib/i18n/locales";

/**
 * Translations for the per-currency notes in the valuations table.
 *
 * These live here rather than in `dictionaries.ts` because they're keyed by
 * a data id, not by a UI string — and rather than in `data/valuations.ts`
 * because that file is the data layer and shouldn't know about locales.
 * English stays in the data file as the single source for the original
 * wording; only the other six need an entry here, which is why the key type
 * excludes "en".
 *
 * Without this the table switched language mid-page: a row's name, type,
 * value, and trend read in the visitor's language while the note beside
 * them stayed English. `test/valuation-notes.test.ts` pins the key sets to
 * the actual currency list so a new currency can't ship half-translated.
 */
export const VALUATION_NOTES: Record<Exclude<Locale, "en">, Record<string, string>> = {
  nl: {
    "chase-ur": "Het meest waard als je ze overzet naar Hyatt of United, niet via de portal.",
    "amex-mr": "De breedste transferlijst; de beste deals zitten bij ANA en Air France.",
    bilt: "Geen jaarlijkse bijdrage, en dezelfde transferpartners als Amex.",
    "capital-one": "Groeiende transferlijst, met een vaste bodem van 1:1 in contant geld.",
    "citi-typ": "Via Turkish Airlines kom je aan scherpe business class-tarieven binnen Star Alliance.",
    aeroplan: "Geen brandstoftoeslagen bij de meeste partnerboekingen.",
    hyatt: "Gratis nachten in categorie 1 tot 4 leveren de meeste waarde van alle hotelpunten op.",
    "ba-avios": "De afstandstabel beloont korte directe vluchten.",
    lifemiles: "Regelmatige acties om punten te kopen veranderen de rekensom.",
    aadvantage: "Dynamische prijzen hebben de meeste oude koopjes weggevaagd.",
    flyingblue: "Maandelijkse Promo Rewards kunnen dit ver boven het basistarief tillen.",
    "united-mp": "Uitstekende beschikbaarheid op eigen vluchten, zwak bij partners.",
    southwest: "Gekoppeld aan de ticketprijs, dus de waarde blijft vrijwel gelijk.",
    skymiles: "Volledig dynamische prijzen; de waarde schommelt per route en seizoen.",
    marriott: "Je hebt veel punten per nacht nodig; de waarde hangt af van hoog- of laagseizoen.",
    hilton: "Lage waarde per punt, maar je spaart ze wel heel snel.",
  },
  de: {
    "chase-ur": "Am meisten wert bei Übertragung an Hyatt oder United, nicht über das Portal.",
    "amex-mr": "Größte Auswahl an Airline-Partnern; die besten Angebote bei ANA und Air France.",
    bilt: "Keine Jahresgebühr, und fast dieselben Transferpartner wie Amex.",
    "capital-one": "Wachsende Partnerliste, mit fester Untergrenze von 1:1 in bar.",
    "citi-typ": "Über Turkish Airlines kommt man an günstige Business-Class-Tarife in der Star Alliance.",
    aeroplan: "Keine Treibstoffzuschläge bei den meisten Partnerbuchungen.",
    hyatt: "Freinächte der Kategorien 1 bis 4 sind das Beste, was Hotelpunkte zu bieten haben.",
    "ba-avios": "Die Entfernungstabelle belohnt kurze Direktflüge.",
    lifemiles: "Häufige Kaufaktionen für Meilen verändern die Rechnung immer wieder.",
    aadvantage: "Dynamische Preise haben die meisten früheren Schnäppchen zunichtegemacht.",
    flyingblue: "Monatliche Promo Rewards können den Wert deutlich über den Normalsatz heben.",
    "united-mp": "Sehr gute Verfügbarkeit auf eigenen Flügen, schwach bei Partnern.",
    southwest: "An den Ticketpreis gekoppelt, der Wert bleibt also nahezu konstant.",
    skymiles: "Vollständig dynamische Preise; der Wert schwankt je nach Strecke und Saison.",
    marriott: "Pro Nacht sind viele Punkte nötig; der Wert hängt von der Saison ab.",
    hilton: "Niedriger Wert je Punkt, dafür sammelt man sie sehr schnell.",
  },
  fr: {
    "chase-ur": "Vaut le plus en transfert vers Hyatt ou United, pas via le portail.",
    "amex-mr": "La plus large liste de partenaires aériens ; les meilleures offres chez ANA et Air France.",
    bilt: "Sans frais annuels, et presque les mêmes partenaires de transfert qu'Amex.",
    "capital-one": "Liste de partenaires en expansion, avec un plancher fixe de 1:1 en espèces.",
    "citi-typ": "Les transferts vers Turkish Airlines ouvrent des tarifs affaires Star Alliance avantageux.",
    aeroplan: "Pas de surcharges carburant sur la plupart des réservations partenaires.",
    hyatt: "Les nuits gratuites en catégories 1 à 4 offrent la meilleure valeur en points hôteliers.",
    "ba-avios": "Le barème par distance récompense les courts vols directs.",
    lifemiles: "Les promotions fréquentes sur l'achat de miles changent souvent le calcul.",
    aadvantage: "La tarification dynamique a effacé la plupart des anciennes bonnes affaires.",
    flyingblue: "Les Promo Rewards mensuelles peuvent largement dépasser le tarif de base.",
    "united-mp": "Excellente disponibilité sur les vols United, faible chez les partenaires.",
    southwest: "Indexé sur le prix du billet, donc la valeur reste quasi constante.",
    skymiles: "Tarification entièrement dynamique ; la valeur varie selon la route et la saison.",
    marriott: "Il faut beaucoup de points par nuit ; la valeur dépend de la saison.",
    hilton: "Faible valeur par point, compensée par une accumulation très rapide.",
  },
  es: {
    "chase-ur": "Valen más transferidos a Hyatt o United, no en el portal.",
    "amex-mr": "La lista de aerolíneas socias más amplia; las mejores ofertas en ANA y Air France.",
    bilt: "Sin cuota anual, y casi los mismos socios de transferencia que Amex.",
    "capital-one": "Lista de socios en crecimiento, con un suelo fijo de 1:1 en efectivo.",
    "citi-typ": "Las transferencias a Turkish Airlines abren tarifas de business baratas en Star Alliance.",
    aeroplan: "Sin recargos de combustible en la mayoría de reservas con socios.",
    hyatt: "Las noches gratis de categoría 1 a 4 dan el mayor valor de todos los puntos de hotel.",
    "ba-avios": "La tabla por distancia premia los vuelos directos cortos.",
    lifemiles: "Las promociones frecuentes de compra de millas cambian el cálculo a menudo.",
    aadvantage: "Los precios dinámicos han borrado casi todas las antiguas gangas.",
    flyingblue: "Las Promo Rewards mensuales pueden superar con creces la tarifa base.",
    "united-mp": "Excelente disponibilidad en vuelos de United, floja con socios.",
    southwest: "Ligado al precio del billete, así que el valor se mantiene casi constante.",
    skymiles: "Precios totalmente dinámicos; el valor varía según ruta y temporada.",
    marriott: "Hacen falta muchos puntos por noche; el valor depende de la temporada.",
    hilton: "Bajo valor por punto, compensado por una acumulación muy rápida.",
  },
  it: {
    "chase-ur": "Valgono di più trasferiti a Hyatt o United, non sul portale.",
    "amex-mr": "La lista di compagnie partner più ampia; le offerte migliori su ANA e Air France.",
    bilt: "Nessun canone annuo, e quasi gli stessi partner di trasferimento di Amex.",
    "capital-one": "Lista partner in crescita, con una base fissa di 1:1 in contanti.",
    "citi-typ": "I trasferimenti a Turkish Airlines aprono tariffe business Star Alliance convenienti.",
    aeroplan: "Nessun supplemento carburante sulla maggior parte delle prenotazioni partner.",
    hyatt: "Le notti gratuite di categoria 1-4 danno il valore più alto tra i punti hotel.",
    "ba-avios": "La tabella per distanza premia i voli diretti brevi.",
    lifemiles: "Le frequenti promozioni sull'acquisto di miglia cambiano spesso i conti.",
    aadvantage: "I prezzi dinamici hanno cancellato quasi tutte le vecchie occasioni.",
    flyingblue: "Le Promo Rewards mensili possono portarlo ben sopra la tariffa base.",
    "united-mp": "Ottima disponibilità sui voli United, debole con i partner.",
    southwest: "Legato al prezzo del biglietto, quindi il valore resta quasi costante.",
    skymiles: "Prezzi completamente dinamici; il valore oscilla per rotta e stagione.",
    marriott: "Servono molti punti a notte; il valore dipende dalla stagione.",
    hilton: "Valore per punto basso, compensato da un accumulo molto rapido.",
  },
  ja: {
    "chase-ur": "ポータルで使うよりハイアットやユナイテッドへ移行するのが最もお得です。",
    "amex-mr": "提携航空会社が最も多く、ANAとエールフランスが特にお得です。",
    bilt: "年会費が無料で、アメックスとほぼ同じ移行先が使えます。",
    "capital-one": "提携先が増加中。現金還元の1:1が最低保証になります。",
    "citi-typ": "ターキッシュエアラインズへの移行で、スターアライアンスのビジネスクラスを安く取れます。",
    aeroplan: "ほとんどの提携社特典で燃油サーチャージがかかりません。",
    hyatt: "カテゴリー1〜4の無料宿泊が、ホテルポイントで最も価値があります。",
    "ba-avios": "距離制のため、短距離の直行便がお得です。",
    lifemiles: "マイル購入キャンペーンが頻繁にあり、損得が変わりやすいです。",
    aadvantage: "変動制の導入で、かつてのお得な特典はほぼなくなりました。",
    flyingblue: "毎月のプロモ特典で、基本レートを大きく上回ることがあります。",
    "united-mp": "ユナイテッド自社便の空席は豊富ですが、提携社特典は弱めです。",
    southwest: "運賃連動制のため、価値はほぼ一定です。",
    skymiles: "完全変動制で、路線と時期によって価値が大きく変わります。",
    marriott: "1泊に必要なポイントが多く、繁忙期かどうかで価値が変わります。",
    hilton: "1ポイントの価値は低いものの、貯まるスピードが非常に速いです。",
  },
};

/** The note for a currency in the visitor's language, falling back to the English original. */
export function valuationNote(id: string, locale: Locale, fallback: string): string {
  if (locale === "en") return fallback;
  return VALUATION_NOTES[locale][id] ?? fallback;
}
