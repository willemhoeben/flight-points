import { DEALS, type Deal } from "@/data/deals";
import type { Locale } from "@/lib/i18n/locales";

/** The parts of a deal that are prose rather than data. */
export type DealText = {
  title: string;
  summary: string;
  body: string[];
};

/**
 * Deal articles in every language but English.
 *
 * These are editorial copy, not UI strings, so nothing in the dictionaries
 * reaches them — which is why the detail page used to carry a line saying
 * the article was English only, in six languages, above an English
 * article. The English original stays in `src/data/deals.ts` as the source
 * of the wording, so this map's key type excludes it.
 *
 * `test/deal-text.test.ts` pins the key sets against the real deal list in
 * both directions: a new deal cannot ship one English article into six
 * translated ones, and a removed deal cannot leave orphaned copy behind.
 */
export const DEAL_TEXT: Record<Exclude<Locale, "en">, Record<string, DealText>> = {
  nl: {
    "amex-mr-to-ana-30-bonus": {
      title: "Amex Membership Rewards → ANA: 30% transferbonus",
      summary: "Een zeldzame bonus op een van de beste business-class sweet spots naar Azië.",
      body: [
        "American Express biedt tot 15 oktober een bonus van 30% bij het transferen van Membership Rewards-punten naar ANA Mileage Club.",
        "ANA's afstandsgebaseerde chart prijst business class VS–Japan nog altijd ruim onder de meeste concurrerende programma's, en deze bonus duwt de effectieve transferratio voorbij 1,3 punt per Amex-punt.",
        "De valkuil: ANA's eigen award-zoekmachine toont partnerbeschikbaarheid vaak pas een paar weken van tevoren, dus dit is het beste te gebruiken voor last-minute trips of in combinatie met een kalenderweergave zodra ruimte vrijkomt.",
      ],
    },
    "hyatt-category-1-4-sweet-spot": {
      title: "De World of Hyatt categorie 1-4 sweet spot, uitgelegd",
      summary: "Waarom gratis nachten onder 15.000 punten nog altijd de beste redemption in hotelpunten zijn.",
      body: [
        "De award-chart van World of Hyatt kent 8 categorieën, en categorie 1 t/m 4 (vanaf 3.500 punten per nacht bij sommige hotels) leveren consequent een waarde op boven 2 cent per punt.",
        "In tegenstelling tot de meeste hotelprogramma's is Hyatt niet overgestapt op dynamic pricing, dus de chart is voorspelbaar en makkelijk maanden vooruit te plannen.",
        "Combineer een Chase Ultimate Rewards-transfer met een categorie 1-4 hotel en een verblijf van $150 kan ruim onder de 10.000 punten kosten.",
      ],
    },
    "citi-turkish-airlines-25-bonus": {
      title: "Citi ThankYou Points → Turkish Airlines: 25% bonus",
      summary: "De Star Alliance-chart van Turkish Airlines is een van de goedkoopste routes naar business class.",
      body: [
        "Citi draait deze maand een transferbonus van 25% naar meerdere airline-partners, en Turkish-achtige partner-charts blijven een van de goedkoopste manieren om Star Alliance business class te boeken.",
        "Omdat deze charts op afstand prijzen in plaats van per maatschappij, komt een business-class stoel VS–Europa vaak ruim onder wat de opererende maatschappij zelf zou vragen.",
        "Zoals altijd bij third-party partner-charts: award-ruimte, niet prijs, is de beperkende factor. Check een kalenderweergave over een brede datumrange in plaats van één dag.",
      ],
    },
    "capital-one-portal-vs-transfer": {
      title: "Wanneer de Capital One travel portal wint van een transfer",
      summary: "Cash-back-achtige redemption wint soms van routeren via een airline-chart.",
      body: [
        "Capital One miles wisselen tegen een vaste 1 cent per punt in tegen elke reisaankoop, wat een bodem legt onder hun waarde die overdraagbare-only valuta niet hebben.",
        "Op routes waar partner award-ruimte schaars is of waar een cash-fare ongewoon goedkoop is, kan inwisselen tegen het vaste tarief winnen van het zoeken naar een transfer-partner award-stoel.",
        "De vuistregel: als de beste award die je vindt onder 1 cent per punt waarde prijst, kies dan de cash-back-achtige redemption.",
      ],
    },
    "flying-blue-promo-rewards": {
      title: "Flying Blue Promo Rewards: check de kalender vóór je transfert",
      summary: "Maandelijkse gekorte awards kunnen het benodigde aantal punten tot 50% verlagen.",
      body: [
        "Flying Blue van Air France-KLM publiceert elke maand een wisselende lijst van gekorte 'Promo Rewards'-routes, soms tot de helft goedkoper dan de standaardchart.",
        "Omdat de lijst maandelijks en per cabin verandert, loont het om de kalenderweergave voor je route te checken vóórdat je punten overzet vanuit een bankprogramma.",
        "Business-class Promo Rewards-routes zijn de beste waarde op de lijst; economy-kortingen zijn meestal kleiner in absolute zin.",
      ],
    },
    "avios-short-haul-distance-chart": {
      title: "Avios afstandsprijzen belonen korte nonstop-hops",
      summary: "Vluchten onder de 650 mijl kunnen onder de 10.000 Avios one-way prijzen.",
      body: [
        "British Airways prijst Avios-redemptions op afstand in plaats van per cabin-en-route-zone, wat zeer korte nonstop-vluchten onevenredig goedkoop maakt.",
        "Een one-way economy-redemption onder de 650 mijl kan ruim onder de 10.000 Avios plus bescheiden carrier charges prijzen, vaak goedkoper dan een cash-fare op dezelfde route.",
        "Dit werkt het beste op point-to-point-hops in plaats van verbindingen, omdat elk extra segment zijn eigen afstandsgebaseerde toeslag toevoegt.",
      ],
    },
    "amex-mr-to-marriott-bonus": {
      title: "Amex Membership Rewards → Marriott Bonvoy: 20% transferbonus",
      summary: "Marriotts hoge puntenaantallen maken transferbonussen extra belangrijk.",
      body: [
        "American Express draait tot 25 september een bonus van 20% op Membership Rewards-transfers naar Marriott Bonvoy, de eerste verhoging op deze combinatie in maanden.",
        "Marriotts categorie-chart vraagt veel meer punten per nacht dan concurrerende hotelprogramma's, waardoor een redemption bij de hogere categorieën maar net 1 cent per punt haalt — de transferbonus is wat veel verblijven naar behoorlijke waarde tilt.",
        "Het beste te gebruiken voor een specifiek geboekt verblijf in plaats van speculatief punten opsparen: check eerst de cash-prijs en transfer alleen als de bonus-aangepaste puntenprijs daaronder zit.",
      ],
    },
    "alaska-mileage-plan-oneworld-sweet-spot": {
      title: "Alaska Mileage Plan's Oneworld sweet spot staat nog open",
      summary: "Een van de laatste mileage-charts die niet dynamisch is geworden op partner-awards.",
      body: [
        "Alaska Mileage Plan liet de Oneworld-partnervoordelen intact terwijl de meeste Amerikaanse programma's overstapten op dynamic pricing, en de gepubliceerde partner-chart geldt nog steeds voor Cathay Pacific, Qatar Airways en Japan Airlines award-ruimte.",
        "Een business-class redemption naar Noord-Azië kan duizenden miles goedkoper prijzen dan wat het opererende programma zelf voor dezelfde stoel zou vragen.",
        "De chart beloont vroeg boeken: partner award-ruimte komt ruim van tevoren vrij en droogt op naarmate het vertrek nadert, dus dit is geen last-minute strategie.",
      ],
    },
    "ethiopian-shebamiles-intra-africa": {
      title: "ShebaMiles is de enige verstandige manier om binnen Afrika te vliegen",
      summary: "Addis Abeba bereikt meer van het continent dan welke hub ook, en niemand anders rekent dat in punten af.",
      body: [
        "Vliegen tussen twee Afrikaanse steden betekent meestal contant betalen, en duur ook: op de meeste van deze routes is er zo weinig concurrentie dat een enkele reis meer kost dan een transatlantisch ticket dat je dezelfde week koopt.",
        "Ethiopian vliegt meer van het continent dan welke andere maatschappij ook, bijna alles via Addis Abeba, en ShebaMiles prijst die stukken in een lage regionale band in plaats van ze mee te laten bewegen met de contante prijs. Lagos, Nairobi, Accra en Johannesburg vallen vanuit Addis allemaal in dezelfde band.",
        "Het addertje: je moet die miles eerst hebben. Geen enkele bank zet 1:1 over naar ShebaMiles, dus dit is een programma waar je in spaart door te vliegen of door Star Alliance-vluchten eraan te koppelen. Regel dat dus ruim vóór de reis die je wilt maken.",
      ],
    },
    "hawaiian-inter-island-awards": {
      title: "Tussen de eilanden is de laatste vaste prijs van Hawaï",
      summary: "Honolulu naar de buureilanden kost nog steeds evenveel punten, wat de contante prijs ook doet.",
      body: [
        "Hawaiian prijst zijn vluchten naar het vasteland tegenwoordig op basis van de ticketprijs: een zaterdag in de zomer naar Honolulu kost wat een zaterdag in de zomer kost. De sprongen tussen de eilanden zijn niet meegegaan.",
        "Honolulu naar Kahului, Kona of Lihue heeft een vaste awardprijs, ongeacht de datum, en juist in de weken waarin de contante prijzen tussen de eilanden omhoogschieten is dat het hele punt. Een gezin van vier dat halverwege de reis van eiland wisselt, verdient het er zo uit.",
        "HawaiianMiles komen 1:1 binnen vanuit Amex Membership Rewards en vanuit Bilt, dus het saldo is makkelijk aan te vullen. Boek de eilandsprong op punten en houd het geld voor het deel van de reis dat niet vastligt.",
      ],
    },
    "citi-typ-to-thai-20-bonus": {
      title: "Citi ThankYou → Thai: 20% transferbonus",
      summary: "Korte hops door Zuidoost-Azië zijn al goedkoop met Royal Orchid Plus; dit maakt ze goedkoper.",
      body: [
        "Citi geeft er 20% bij als je ThankYou-punten naar Thai Royal Orchid Plus overzet, tot eind oktober.",
        "Royal Orchid Plus is onopvallend op de lange afstand en echt goed binnen Zuidoost-Azië: Bangkok naar Singapore, Kuala Lumpur, Hanoi of Ho Chi Minhstad zit in een korte regionale band, en met 20% erbij kom je boven de 1,2 miles per ThankYou-punt uit.",
        "Zie het als een manier om de aansluitende stukken te betalen van een reis die je toch al maakt, niet als de reis zelf. Een transfer is niet terug te draaien, dus zet alleen over wat een concrete boeking nodig heeft.",
      ],
    },
    "icelandair-saga-stopover": {
      title: "De gratis stop in Reykjavik is nog steeds de reden om Saga-punten te hebben",
      summary: "De awardtabel is gewoontjes. Onderweg een week in IJsland blijven is dat niet.",
      body: [
        "Icelandair rekent tussen Europa en Noord-Amerika niets bijzonders, en op zichzelf zou dat geen alinea waard zijn.",
        "Waar het om gaat is de stopover. Keflavik ligt ongeveer halverwege, en Icelandair laat je er op een transatlantisch award tot een week blijven zonder extra punten, waardoor één boeking twee reizen wordt. Niemand anders op die oceaan biedt dat gratis aan.",
        "Saga Club kent geen 1:1 banktransfer, dus de punten komen uit vliegen of uit de creditcard. De moeite waard als IJsland toch al op het lijstje stond, niet de moeite waard als dat niet zo was.",
      ],
    },
  },
  de: {
    "amex-mr-to-ana-30-bonus": {
      title: "Amex Membership Rewards → ANA: 30 % Transferbonus",
      summary: "Ein seltener Bonus auf einen der besten Business-Class-Deals nach Asien.",
      body: [
        "American Express gewährt bis zum 15. Oktober einen Bonus von 30 % auf Transfers von Membership Rewards zu ANA Mileage Club.",
        "ANAs entfernungsbasierte Tabelle bepreist Business Class USA–Japan weiterhin deutlich unter den meisten konkurrierenden Programmen, und dieser Bonus hebt das effektive Transferverhältnis über 1,3 Meilen je Amex-Punkt.",
        "Der Haken: ANAs eigene Award-Suche zeigt Partnerverfügbarkeit oft erst wenige Wochen im Voraus. Das eignet sich also eher für kurzfristige Reisen oder in Kombination mit einer Kalenderansicht, um frei werdende Plätze zu erwischen.",
      ],
    },
    "hyatt-category-1-4-sweet-spot": {
      title: "Der World-of-Hyatt-Deal in Kategorie 1 bis 4, erklärt",
      summary: "Warum Freinächte unter 15.000 Punkten weiterhin die beste Einlösung von Hotelpunkten sind.",
      body: [
        "Die Award-Tabelle von World of Hyatt reicht bis Kategorie 8, und die Kategorien 1 bis 4 — ab 3.500 Punkten pro Nacht in manchen Häusern — liefern durchweg mehr als 2 Cent pro Punkt.",
        "Anders als die meisten Hotelprogramme ist Hyatt nie auf dynamische Preise umgestiegen, die Tabelle bleibt also berechenbar und lässt sich Monate im Voraus planen.",
        "Kombiniert man einen Transfer von Chase Ultimate Rewards mit einem Hotel der Kategorie 1 bis 4, kann ein Aufenthalt im Wert von 150 $ deutlich unter 10.000 Punkten kosten.",
      ],
    },
    "citi-turkish-airlines-25-bonus": {
      title: "Citi ThankYou Points → Turkish Airlines: 25 % Bonus",
      summary: "Die Star-Alliance-Tabelle von Turkish Airlines ist einer der günstigsten Wege in die Business Class.",
      body: [
        "Citi gewährt in diesem Monat 25 % Transferbonus auf mehrere Airline-Partner, und Partnertabellen wie die von Turkish bleiben einer der günstigsten Wege, Star-Alliance-Business-Class zu buchen.",
        "Da diese Tabellen nach Entfernung statt nach ausführender Airline bepreisen, liegt ein Business-Class-Platz USA–Europa oft deutlich unter dem, was die ausführende Airline selbst verlangen würde.",
        "Wie immer bei Partnertabellen Dritter ist die Award-Verfügbarkeit der begrenzende Faktor, nicht der Preis. Prüfen Sie eine Kalenderansicht über einen breiten Zeitraum statt nur einen einzelnen Tag.",
      ],
    },
    "capital-one-portal-vs-transfer": {
      title: "Wann das Capital-One-Reiseportal den Transfer schlägt",
      summary: "Eine Einlösung nach Cashback-Art schlägt manchmal den Umweg über eine Airline-Tabelle.",
      body: [
        "Capital-One-Meilen lassen sich zu festen 1 Cent pro Punkt gegen jede Reisebuchung einlösen. Das legt einen Boden unter ihren Wert, den reine Transferwährungen nicht haben.",
        "Auf Strecken mit knapper Partner-Verfügbarkeit oder ungewöhnlich günstigen Bartarifen kann die Einlösung zum Festpreis besser sein als die Suche nach einem Award-Platz beim Transferpartner.",
        "Die Faustregel: Wenn der beste gefundene Award unter 1 Cent pro Punkt an Wert liegt, nehmen Sie die Einlösung nach Cashback-Art.",
      ],
    },
    "flying-blue-promo-rewards": {
      title: "Flying Blue Promo Rewards: erst den Kalender prüfen, dann transferieren",
      summary: "Monatlich wechselnde Rabatt-Awards senken den Punktebedarf um bis zu 50 %.",
      body: [
        "Flying Blue von Air France-KLM veröffentlicht jeden Monat eine wechselnde Liste vergünstigter 'Promo Rewards'-Strecken, teils zum halben Preis der Standardtabelle.",
        "Da sich die Liste monatlich und je Kabinenklasse ändert, lohnt ein Blick in die Kalenderansicht für Ihre Strecke, bevor Sie Punkte aus einem Bankprogramm übertragen.",
        "Promo-Rewards-Strecken in der Business Class bieten den besten Wert der Liste; Rabatte in der Economy fallen absolut meist kleiner aus.",
      ],
    },
    "avios-short-haul-distance-chart": {
      title: "Die Avios-Entfernungstabelle belohnt kurze Direktflüge",
      summary: "Flüge unter 650 Meilen können unter 10.000 Avios pro Strecke kosten.",
      body: [
        "British Airways bepreist Avios-Einlösungen nach Entfernung statt nach Kabinen- und Streckenzone, was sehr kurze Direktflüge überproportional günstig macht.",
        "Eine Economy-Einlösung unter 650 Meilen für eine Strecke kann deutlich unter 10.000 Avios zuzüglich moderater Gebühren liegen, oft günstiger als der Bartarif auf derselben Strecke.",
        "Das funktioniert am besten bei Direktverbindungen statt bei Umsteigeflügen, da jedes weitere Teilstück seinen eigenen entfernungsabhängigen Aufschlag hinzufügt.",
      ],
    },
    "amex-mr-to-marriott-bonus": {
      title: "Amex Membership Rewards → Marriott Bonvoy: 20 % Transferbonus",
      summary: "Marriotts hohe Punktzahlen machen Transferboni besonders wichtig.",
      body: [
        "American Express gewährt bis zum 25. September 20 % Bonus auf Membership-Rewards-Transfers zu Marriott Bonvoy, die erste Erhöhung dieser Kombination seit Monaten.",
        "Marriotts Kategorientabelle verlangt weit mehr Punkte pro Nacht als konkurrierende Hotelprogramme, wodurch Einlösungen in den höheren Kategorien kaum 1 Cent pro Punkt erreichen — erst der Transferbonus hebt viele Aufenthalte auf einen ordentlichen Wert.",
        "Am besten für einen konkret gebuchten Aufenthalt nutzen statt zum spekulativen Horten: erst den Barpreis prüfen und nur transferieren, wenn der bonusbereinigte Punktepreis darunter liegt.",
      ],
    },
    "alaska-mileage-plan-oneworld-sweet-spot": {
      title: "Der Oneworld-Deal von Alaska Mileage Plan besteht weiter",
      summary: "Eine der letzten Meilentabellen, die bei Partner-Awards nie dynamisch wurde.",
      body: [
        "Alaska Mileage Plan hat seine Oneworld-Partnervorteile beibehalten, während die meisten US-Programme auf dynamische Preise umstiegen, und die veröffentlichte Partnertabelle gilt weiterhin für Award-Plätze bei Cathay Pacific, Qatar Airways und Japan Airlines.",
        "Eine Business-Class-Einlösung nach Nordasien kann Tausende Meilen günstiger liegen als das, was das ausführende Programm für denselben Platz verlangen würde.",
        "Die Tabelle belohnt frühes Buchen: Partner-Award-Plätze werden lange im Voraus freigegeben und versiegen mit näher rückendem Abflug. Als Last-Minute-Strategie taugt das also nicht.",
      ],
    },
    "ethiopian-shebamiles-intra-africa": {
      title: "ShebaMiles ist der einzige vernünftige Weg, innerafrikanisch zu fliegen",
      summary: "Addis Abeba erreicht mehr vom Kontinent als jeder andere Hub, und sonst rechnet das niemand in Punkten ab.",
      body: [
        "Zwischen zwei afrikanischen Städten zu fliegen heißt meist bar zahlen, und teuer: auf den meisten dieser Strecken ist die Konkurrenz so dünn, dass ein One-Way mehr kostet als ein Transatlantikticket aus derselben Woche.",
        "Ethiopian bedient mehr vom Kontinent als jede andere Airline, fast alles über Addis Abeba, und ShebaMiles bepreist diese Abschnitte in einem niedrigen regionalen Band, statt sie am Barpreis mitlaufen zu lassen. Lagos, Nairobi, Accra und Johannesburg landen ab Addis alle im selben Band.",
        "Der Haken ist, überhaupt an die Meilen zu kommen. Keine Bank überträgt 1:1 in ShebaMiles, also sammelt man hier durch Fliegen oder durch Gutschrift von Star-Alliance-Flügen. Das richtet man besser vor der Reise ein als währenddessen.",
      ],
    },
    "hawaiian-inter-island-awards": {
      title: "Zwischen den Inseln gilt der letzte Festpreis auf Hawaii",
      summary: "Honolulu zu den Nachbarinseln kostet weiterhin gleich viele Punkte, egal was der Barpreis macht.",
      body: [
        "Hawaiian bepreist seine Festlandstrecken inzwischen nach dem Barpreis: ein Sommersamstag nach Honolulu kostet, was ein Sommersamstag kostet. Die Inselhüpfer sind dem nicht gefolgt.",
        "Honolulu nach Kahului, Kona oder Lihue liegt bei einem festen Awardpreis, unabhängig vom Datum, und genau in den Wochen, in denen die Barpreise zwischen den Inseln hochschießen, ist das der ganze Punkt. Eine vierköpfige Familie, die mitten in der Reise die Insel wechselt, holt es damit heraus.",
        "HawaiianMiles kommen 1:1 von Amex Membership Rewards und von Bilt, das Guthaben lässt sich also leicht auffüllen. Buche den Inselhüpfer mit Punkten und spare das Bargeld für den Teil der Reise, der nicht festgeschrieben ist.",
      ],
    },
    "citi-typ-to-thai-20-bonus": {
      title: "Citi ThankYou → Thai: 20% Transferbonus",
      summary: "Kurze Hüpfer durch Südostasien sind mit Royal Orchid Plus schon günstig; das macht sie günstiger.",
      body: [
        "Citi legt 20% drauf, wenn du ThankYou-Punkte zu Thai Royal Orchid Plus überträgst, bis Ende Oktober.",
        "Royal Orchid Plus ist auf der Langstrecke unauffällig und innerhalb Südostasiens richtig gut: Bangkok nach Singapur, Kuala Lumpur, Hanoi oder Ho-Chi-Minh-Stadt liegt in einem kurzen regionalen Band, und mit 20% obendrauf kommst du über 1,2 Meilen pro ThankYou-Punkt.",
        "Nimm es als Weg, die Anschlussabschnitte einer Reise zu zahlen, die du ohnehin machst, nicht als die Reise selbst. Ein Transfer lässt sich nicht rückgängig machen, übertrage also nur, was eine konkrete Buchung braucht.",
      ],
    },
    "icelandair-saga-stopover": {
      title: "Der kostenlose Stopover in Reykjavik ist weiter der Grund für Saga-Punkte",
      summary: "Die Awardtabelle ist gewöhnlich. Unterwegs eine Woche in Island zu bleiben ist es nicht.",
      body: [
        "Icelandairs Awardpreise zwischen Europa und Nordamerika sind unauffällig, und für sich genommen wären sie keinen Absatz wert.",
        "Was sie trotzdem lohnend macht, ist der Stopover. Keflavik liegt ungefähr auf halber Strecke, und Icelandair lässt dich dort auf einem Transatlantik-Award bis zu eine Woche bleiben, ohne zusätzliche Punkte. Aus einer Einlösung werden so zwei Reisen. Sonst bietet das über diesem Ozean niemand kostenlos an.",
        "Saga Club nimmt keinen 1:1-Banktransfer, die Punkte kommen also aus dem Fliegen oder aus der Kreditkarte. Lohnend, wenn Island ohnehin auf der Liste stand, nicht lohnend, wenn nicht.",
      ],
    },
  },
  fr: {
    "amex-mr-to-ana-30-bonus": {
      title: "Amex Membership Rewards → ANA : bonus de transfert de 30 %",
      summary: "Un bonus rare sur l'une des meilleures offres en classe affaires vers l'Asie.",
      body: [
        "American Express applique jusqu'au 15 octobre un bonus de 30 % sur les transferts de Membership Rewards vers ANA Mileage Club.",
        "Le barème kilométrique d'ANA situe toujours la classe affaires États-Unis–Japon bien en dessous de la plupart des programmes concurrents, et ce bonus porte le ratio de transfert effectif au-delà de 1,3 mile par point Amex.",
        "Le revers : le moteur de recherche d'ANA n'affiche souvent les disponibilités partenaires que quelques semaines à l'avance. Mieux vaut donc viser un voyage de dernière minute, ou surveiller une vue calendrier pour saisir les places qui se libèrent.",
      ],
    },
    "hyatt-category-1-4-sweet-spot": {
      title: "Le bon plan World of Hyatt catégories 1 à 4, expliqué",
      summary: "Pourquoi les nuits gratuites sous 15 000 points restent la meilleure utilisation de points hôteliers.",
      body: [
        "Le barème de World of Hyatt compte 8 catégories, et les catégories 1 à 4 — à partir de 3 500 points la nuit dans certains hôtels — dépassent régulièrement 2 cents par point.",
        "Contrairement à la plupart des programmes hôteliers, Hyatt n'est jamais passé à la tarification dynamique : le barème reste prévisible et se planifie des mois à l'avance.",
        "En combinant un transfert Chase Ultimate Rewards avec un hôtel de catégorie 1 à 4, un séjour à 150 $ peut coûter nettement moins de 10 000 points.",
      ],
    },
    "citi-turkish-airlines-25-bonus": {
      title: "Citi ThankYou Points → Turkish Airlines : bonus de 25 %",
      summary: "Le barème Star Alliance de Turkish Airlines est l'une des voies les moins chères vers la classe affaires.",
      body: [
        "Citi propose ce mois-ci un bonus de transfert de 25 % vers plusieurs compagnies partenaires, et les barèmes partenaires comme celui de Turkish restent l'un des moyens les moins chers de réserver la classe affaires Star Alliance.",
        "Comme ces barèmes tarifent à la distance et non selon la compagnie opérante, un siège en classe affaires États-Unis–Europe tombe souvent bien en dessous de ce que demanderait la compagnie elle-même.",
        "Comme toujours avec les barèmes partenaires, c'est la disponibilité qui limite, pas le prix. Consultez une vue calendrier sur une large plage de dates plutôt qu'un seul jour.",
      ],
    },
    "capital-one-portal-vs-transfer": {
      title: "Quand le portail voyage Capital One l'emporte sur un transfert",
      summary: "Une utilisation façon remise en argent bat parfois le passage par un barème aérien.",
      body: [
        "Les miles Capital One s'échangent à 1 cent par point fixe contre tout achat de voyage, ce qui pose un plancher sous leur valeur que les devises transférables seules n'ont pas.",
        "Sur les trajets où les places partenaires sont rares, ou quand un tarif en espèces est inhabituellement bas, l'échange au taux fixe peut l'emporter sur la chasse au siège primes chez un partenaire.",
        "La règle : si la meilleure prime trouvée vaut moins de 1 cent par point, prenez l'échange façon remise en argent.",
      ],
    },
    "flying-blue-promo-rewards": {
      title: "Flying Blue Promo Rewards : vérifiez le calendrier avant de transférer",
      summary: "Les primes réduites mensuelles peuvent abaisser le nombre de points requis de moitié.",
      body: [
        "Flying Blue d'Air France-KLM publie chaque mois une liste tournante de destinations 'Promo Rewards' à prix réduit, parfois à moitié prix par rapport au barème standard.",
        "Comme la liste change tous les mois et selon la cabine, il vaut mieux consulter la vue calendrier de votre trajet avant de transférer des points depuis un programme bancaire.",
        "Les Promo Rewards en classe affaires offrent la meilleure valeur de la liste ; les réductions en économie restent plus modestes en valeur absolue.",
      ],
    },
    "avios-short-haul-distance-chart": {
      title: "La tarification Avios à la distance récompense les courts vols directs",
      summary: "Les vols de moins de 650 miles peuvent coûter moins de 10 000 Avios l'aller.",
      body: [
        "British Airways tarife les primes Avios à la distance plutôt que par zone de cabine et de trajet, ce qui rend les vols directs très courts particulièrement bon marché.",
        "Un aller simple en économie de moins de 650 miles peut coûter nettement moins de 10 000 Avios plus des frais modérés, souvent moins qu'un billet payant sur le même trajet.",
        "Cela fonctionne mieux sur les vols directs que sur les correspondances, car chaque segment supplémentaire ajoute son propre supplément kilométrique.",
      ],
    },
    "amex-mr-to-marriott-bonus": {
      title: "Amex Membership Rewards → Marriott Bonvoy : bonus de transfert de 20 %",
      summary: "Les montants élevés de Marriott rendent les bonus de transfert d'autant plus importants.",
      body: [
        "American Express applique jusqu'au 25 septembre un bonus de 20 % sur les transferts Membership Rewards vers Marriott Bonvoy, la première hausse sur ce couple depuis des mois.",
        "Le barème par catégorie de Marriott demande bien plus de points par nuit que les programmes concurrents, si bien que les catégories élevées atteignent à peine 1 cent par point : c'est le bonus de transfert qui ramène beaucoup de séjours à une valeur correcte.",
        "À utiliser pour un séjour déjà réservé plutôt que pour accumuler à l'aveugle : vérifiez d'abord le prix en espèces et ne transférez que si le prix en points, bonus inclus, passe en dessous.",
      ],
    },
    "alaska-mileage-plan-oneworld-sweet-spot": {
      title: "Le bon plan Oneworld d'Alaska Mileage Plan tient toujours",
      summary: "L'un des derniers barèmes à n'être jamais passé au dynamique sur les primes partenaires.",
      body: [
        "Alaska Mileage Plan a conservé ses avantages partenaires Oneworld quand la plupart des programmes américains sont passés à la tarification dynamique, et le barème partenaire publié s'applique toujours aux places Cathay Pacific, Qatar Airways et Japan Airlines.",
        "Une prime en classe affaires vers l'Asie du Nord peut coûter des milliers de miles de moins que ce que demanderait le programme opérant pour le même siège.",
        "Le barème récompense la réservation anticipée : les places partenaires s'ouvrent longtemps à l'avance et se raréfient à l'approche du départ. Ce n'est donc pas une stratégie de dernière minute.",
      ],
    },
    "ethiopian-shebamiles-intra-africa": {
      title: "ShebaMiles est la seule façon sensée de payer un vol intra-africain",
      summary: "Addis-Abeba dessert plus du continent que n'importe quel autre hub, et personne d'autre ne le facture en points.",
      body: [
        "Voler entre deux villes africaines veut dire payer comptant, et cher : sur la plupart de ces lignes la concurrence est si mince qu'un aller simple coûte plus qu'un billet transatlantique acheté la même semaine.",
        "Ethiopian dessert plus du continent que toute autre compagnie, presque tout via Addis-Abeba, et ShebaMiles tarife ces segments dans une bande régionale basse au lieu de les indexer sur le tarif comptant. Lagos, Nairobi, Accra et Johannesburg tombent toutes dans la même bande au départ d'Addis.",
        "Le hic, c'est d'avoir les miles. Aucune banque ne transfère en 1:1 vers ShebaMiles : on y accumule en volant ou en créditant des vols Star Alliance. Mieux vaut donc s'en occuper avant le voyage visé que pendant.",
      ],
    },
    "hawaiian-inter-island-awards": {
      title: "Entre les îles, c'est le dernier prix fixe d'Hawaï",
      summary: "Honolulu vers les îles voisines coûte toujours le même nombre de points, quoi que fasse le tarif comptant.",
      body: [
        "Hawaiian tarife désormais ses lignes vers le continent d'après le prix comptant : un samedi d'été vers Honolulu coûte ce que coûte un samedi d'été. Les sauts inter-îles n'ont pas suivi.",
        "Honolulu vers Kahului, Kona ou Lihue reste à un prix prime fixe quelle que soit la date, et c'est précisément dans les semaines où les tarifs comptants entre les îles s'envolent que ça compte. Une famille de quatre qui change d'île en milieu de séjour s'y retrouve largement.",
        "Les HawaiianMiles arrivent en 1:1 depuis Amex Membership Rewards et depuis Bilt, le solde est donc facile à compléter. Réservez le saut d'île en points et gardez l'argent pour la partie du voyage qui n'est pas fixe.",
      ],
    },
    "citi-typ-to-thai-20-bonus": {
      title: "Citi ThankYou → Thai : 20% de bonus de transfert",
      summary: "Les courts sauts en Asie du Sud-Est sont déjà bon marché sur Royal Orchid Plus ; là ils le deviennent plus encore.",
      body: [
        "Citi ajoute 20% quand vous transférez des points ThankYou vers Thai Royal Orchid Plus, jusqu'à fin octobre.",
        "Royal Orchid Plus n'a rien de remarquable sur le long-courrier et devient vraiment bon à l'intérieur de l'Asie du Sud-Est : Bangkok vers Singapour, Kuala Lumpur, Hanoï ou Hô Chi Minh-Ville tombe dans une bande régionale courte, et 20% de plus porte le taux effectif au-delà de 1,2 mile par point ThankYou.",
        "Voyez-y un moyen de payer les segments de correspondance d'un voyage que vous faites déjà, pas le voyage lui-même. Un transfert est irréversible : ne transférez que ce qu'une réservation précise demande.",
      ],
    },
    "icelandair-saga-stopover": {
      title: "L'escale gratuite à Reykjavik reste la raison de garder des points Saga",
      summary: "Le barème des primes est ordinaire. Passer une semaine en Islande en chemin ne l'est pas.",
      body: [
        "Les primes d'Icelandair entre l'Europe et l'Amérique du Nord n'ont rien de remarquable, et à elles seules elles ne mériteraient pas un paragraphe.",
        "Ce qui vaut le coup, c'est l'escale. Keflavik se trouve à peu près à mi-chemin, et Icelandair vous laisse y rester jusqu'à une semaine sur une prime transatlantique sans points supplémentaires, ce qui transforme une réservation en deux voyages. Personne d'autre ne l'offre gratuitement sur cet océan.",
        "Saga Club n'accepte aucun transfert bancaire en 1:1 : les points viennent des vols ou de la carte co-brandée. À prévoir si l'Islande figurait déjà sur la liste, pas à courir après si ce n'était pas le cas.",
      ],
    },
  },
  es: {
    "amex-mr-to-ana-30-bonus": {
      title: "Amex Membership Rewards → ANA: 30 % de bonus por transferencia",
      summary: "Un bonus poco habitual en una de las mejores oportunidades de clase ejecutiva a Asia.",
      body: [
        "American Express aplica hasta el 15 de octubre un bonus del 30 % en las transferencias de Membership Rewards a ANA Mileage Club.",
        "La tabla por distancia de ANA sigue situando la clase ejecutiva EE. UU.–Japón muy por debajo de la mayoría de programas competidores, y este bonus eleva la proporción efectiva por encima de 1,3 millas por punto Amex.",
        "El inconveniente: el buscador de ANA suele mostrar la disponibilidad de socios solo unas semanas antes, así que conviene más para viajes de última hora, o combinado con una vista de calendario para cazar plazas según se liberan.",
      ],
    },
    "hyatt-category-1-4-sweet-spot": {
      title: "La oportunidad de World of Hyatt en categorías 1 a 4, explicada",
      summary: "Por qué las noches gratis por debajo de 15.000 puntos siguen siendo el mejor uso de puntos de hotel.",
      body: [
        "La tabla de World of Hyatt llega a 8 categorías, y las categorías 1 a 4 — desde 3.500 puntos por noche en algunos hoteles — superan de forma constante los 2 céntimos por punto.",
        "A diferencia de la mayoría de programas hoteleros, Hyatt nunca pasó a precios dinámicos, así que la tabla es predecible y permite planificar con meses de antelación.",
        "Combinando una transferencia de Chase Ultimate Rewards con un hotel de categoría 1 a 4, una estancia de 150 $ puede costar bastante menos de 10.000 puntos.",
      ],
    },
    "citi-turkish-airlines-25-bonus": {
      title: "Citi ThankYou Points → Turkish Airlines: 25 % de bonus",
      summary: "La tabla Star Alliance de Turkish Airlines es una de las vías más baratas a la clase ejecutiva.",
      body: [
        "Citi ofrece este mes un bonus del 25 % en transferencias a varias aerolíneas socias, y las tablas de socios como la de Turkish siguen siendo una de las formas más baratas de reservar clase ejecutiva en Star Alliance.",
        "Como estas tablas cobran por distancia y no según la aerolínea operadora, un asiento en ejecutiva EE. UU.–Europa suele quedar muy por debajo de lo que pediría la propia aerolínea.",
        "Como siempre con las tablas de socios, lo que limita es la disponibilidad, no el precio. Consulta una vista de calendario en un rango amplio de fechas en lugar de un solo día.",
      ],
    },
    "capital-one-portal-vs-transfer": {
      title: "Cuándo el portal de viajes de Capital One gana a una transferencia",
      summary: "Un canje tipo devolución en efectivo a veces supera al rodeo por una tabla aérea.",
      body: [
        "Las millas de Capital One se canjean a un céntimo fijo por punto contra cualquier compra de viaje, lo que pone un suelo a su valor que las monedas solo transferibles no tienen.",
        "En rutas con poca disponibilidad de socios, o cuando una tarifa en efectivo es inusualmente barata, canjear al tipo fijo puede ganar a buscar un asiento de premio en un socio.",
        "La regla práctica: si el mejor premio que encuentras vale menos de un céntimo por punto, quédate con el canje tipo devolución en efectivo.",
      ],
    },
    "flying-blue-promo-rewards": {
      title: "Flying Blue Promo Rewards: mira el calendario antes de transferir",
      summary: "Los premios rebajados mensuales pueden reducir los puntos necesarios hasta un 50 %.",
      body: [
        "Flying Blue de Air France-KLM publica cada mes una lista rotatoria de rutas 'Promo Rewards' con descuento, a veces a mitad del precio de la tabla estándar.",
        "Como la lista cambia cada mes y por cabina, conviene revisar la vista de calendario de tu ruta antes de mover puntos desde un programa bancario.",
        "Las rutas Promo Rewards en clase ejecutiva son las de mejor valor de la lista; los descuentos en turista suelen ser menores en términos absolutos.",
      ],
    },
    "avios-short-haul-distance-chart": {
      title: "El precio por distancia de Avios premia los vuelos directos cortos",
      summary: "Los vuelos de menos de 650 millas pueden costar menos de 10.000 Avios por trayecto.",
      body: [
        "British Airways cobra los canjes de Avios por distancia en lugar de por zona de cabina y ruta, lo que hace desproporcionadamente baratos los vuelos directos muy cortos.",
        "Un trayecto en turista de menos de 650 millas puede costar bastante menos de 10.000 Avios más unas tasas moderadas, a menudo menos que la tarifa en efectivo en la misma ruta.",
        "Funciona mejor en vuelos directos que en conexiones, porque cada segmento añade su propio recargo por distancia.",
      ],
    },
    "amex-mr-to-marriott-bonus": {
      title: "Amex Membership Rewards → Marriott Bonvoy: 20 % de bonus por transferencia",
      summary: "Las cifras altas de Marriott hacen que los bonus de transferencia importen más de lo normal.",
      body: [
        "American Express aplica hasta el 25 de septiembre un bonus del 20 % en transferencias de Membership Rewards a Marriott Bonvoy, la primera subida en esta combinación en meses.",
        "La tabla por categorías de Marriott pide muchos más puntos por noche que los programas competidores, lo que deja los canjes en las categorías altas rozando apenas un céntimo por punto: es el bonus de transferencia lo que lleva muchas estancias a un valor decente.",
        "Mejor usarlo para una estancia ya reservada que para acumular a ciegas: mira primero el precio en efectivo y transfiere solo si el precio en puntos, con el bonus aplicado, queda por debajo.",
      ],
    },
    "alaska-mileage-plan-oneworld-sweet-spot": {
      title: "La oportunidad Oneworld de Alaska Mileage Plan sigue abierta",
      summary: "Una de las últimas tablas de millas que nunca pasó a dinámica en los premios de socios.",
      body: [
        "Alaska Mileage Plan mantuvo intactas sus ventajas de socio Oneworld mientras la mayoría de programas estadounidenses pasaban a precios dinámicos, y la tabla de socios publicada sigue aplicándose a las plazas de Cathay Pacific, Qatar Airways y Japan Airlines.",
        "Un canje en clase ejecutiva al norte de Asia puede costar miles de millas menos de lo que pediría el propio programa operador por el mismo asiento.",
        "La tabla premia reservar pronto: las plazas de socios se abren con mucha antelación y se agotan según se acerca la salida, así que no es una estrategia de última hora.",
      ],
    },
    "ethiopian-shebamiles-intra-africa": {
      title: "ShebaMiles es la única forma sensata de pagar un vuelo dentro de África",
      summary: "Adís Abeba llega a más del continente que cualquier otro hub, y nadie más lo cobra en puntos.",
      body: [
        "Volar entre dos ciudades africanas suele significar pagar en efectivo, y caro: en la mayoría de estas rutas hay tan poca competencia que un sencillo cuesta más que un billete transatlántico comprado esa misma semana.",
        "Ethiopian vuela a más partes del continente que ninguna otra aerolínea, casi todo vía Adís Abeba, y ShebaMiles tarifica esos tramos en una banda regional baja en lugar de seguir la tarifa en efectivo. Lagos, Nairobi, Accra y Johannesburgo caen todas en la misma banda desde Adís.",
        "El problema es conseguir las millas. Ningún banco transfiere 1:1 a ShebaMiles, así que es un programa en el que se acumula volando o acreditando vuelos de Star Alliance. Conviene montarlo antes del viaje que quieres, no durante.",
      ],
    },
    "hawaiian-inter-island-awards": {
      title: "Entre islas está el último precio fijo de Hawái",
      summary: "Honolulú a las islas vecinas sigue costando los mismos puntos, haga lo que haga la tarifa en efectivo.",
      body: [
        "Hawaiian ya tarifica sus rutas al continente según la tarifa en efectivo: un sábado de verano a Honolulú cuesta lo que cuesta un sábado de verano. Los saltos entre islas no siguieron ese camino.",
        "Honolulú a Kahului, Kona o Lihue mantiene un precio premio plano sea cual sea la fecha, y justo en las semanas en que las tarifas en efectivo entre islas se disparan está todo el sentido. Una familia de cuatro que cambia de isla a mitad del viaje lo amortiza ahí.",
        "Las HawaiianMiles entran 1:1 desde Amex Membership Rewards y desde Bilt, así que el saldo es fácil de completar. Reserva el salto entre islas con puntos y guarda el dinero para la parte del viaje que no está fija.",
      ],
    },
    "citi-typ-to-thai-20-bonus": {
      title: "Citi ThankYou → Thai: 20% de bonus de transferencia",
      summary: "Los saltos cortos por el Sudeste Asiático ya son baratos con Royal Orchid Plus; esto los abarata más.",
      body: [
        "Citi añade un 20% cuando pasas puntos ThankYou a Thai Royal Orchid Plus, hasta final de octubre.",
        "Royal Orchid Plus no destaca en largo radio y es realmente bueno dentro del Sudeste Asiático: Bangkok a Singapur, Kuala Lumpur, Hanói o Ciudad Ho Chi Minh cae en una banda regional corta, y con un 20% encima el cambio efectivo supera las 1,2 millas por punto ThankYou.",
        "Tómalo como una manera de pagar los tramos de conexión de un viaje que ya ibas a hacer, no como el viaje en sí. Una transferencia no se deshace, así que mueve solo lo que una reserva concreta necesite.",
      ],
    },
    "icelandair-saga-stopover": {
      title: "La escala gratis en Reikiavik sigue siendo el motivo para tener puntos Saga",
      summary: "La tabla de premios es corriente. Pasar una semana en Islandia de camino no lo es.",
      body: [
        "Los premios de Icelandair entre Europa y Norteamérica no tienen nada de particular, y por sí solos no merecerían un párrafo.",
        "Lo que sí merece la pena es la escala. Keflavik queda más o menos a mitad de camino, e Icelandair te deja quedarte allí hasta una semana en un premio transatlántico sin puntos extra, con lo que una redención se convierte en dos viajes. Nadie más lo ofrece gratis en ese océano.",
        "Saga Club no admite transferencia bancaria 1:1, así que los puntos vienen de volar o de la tarjeta. Merece la pena si Islandia ya estaba en la lista, no merece la pena perseguirlo si no lo estaba.",
      ],
    },
  },
  it: {
    "amex-mr-to-ana-30-bonus": {
      title: "Amex Membership Rewards → ANA: bonus trasferimento del 30%",
      summary: "Un bonus raro su una delle migliori occasioni in business class verso l'Asia.",
      body: [
        "American Express applica fino al 15 ottobre un bonus del 30% sui trasferimenti di Membership Rewards verso ANA Mileage Club.",
        "La tabella a distanza di ANA colloca ancora la business class Stati Uniti–Giappone ben sotto la maggior parte dei programmi concorrenti, e questo bonus porta il rapporto effettivo oltre 1,3 miglia per punto Amex.",
        "Il rovescio: il motore di ricerca di ANA mostra spesso la disponibilità dei partner solo poche settimane prima, quindi conviene per viaggi last minute o abbinato a una vista calendario per cogliere i posti appena si liberano.",
      ],
    },
    "hyatt-category-1-4-sweet-spot": {
      title: "L'occasione World of Hyatt nelle categorie 1-4, spiegata",
      summary: "Perché le notti gratuite sotto i 15.000 punti restano il miglior uso dei punti hotel.",
      body: [
        "La tabella di World of Hyatt arriva a 8 categorie, e le categorie da 1 a 4 — da 3.500 punti a notte in alcuni hotel — superano con costanza i 2 centesimi per punto.",
        "A differenza della maggior parte dei programmi alberghieri, Hyatt non è mai passata ai prezzi dinamici: la tabella resta prevedibile e si pianifica con mesi di anticipo.",
        "Abbinando un trasferimento da Chase Ultimate Rewards a un hotel di categoria 1-4, un soggiorno da 150 $ può costare ben meno di 10.000 punti.",
      ],
    },
    "citi-turkish-airlines-25-bonus": {
      title: "Citi ThankYou Points → Turkish Airlines: bonus del 25%",
      summary: "La tabella Star Alliance di Turkish Airlines è una delle vie più economiche alla business class.",
      body: [
        "Questo mese Citi offre un bonus del 25% sui trasferimenti verso diverse compagnie partner, e le tabelle partner come quella di Turkish restano uno dei modi più economici per prenotare la business class Star Alliance.",
        "Poiché queste tabelle tariffano a distanza e non in base alla compagnia operante, un posto in business Stati Uniti–Europa finisce spesso ben sotto quanto chiederebbe la compagnia stessa.",
        "Come sempre con le tabelle partner, il limite è la disponibilità, non il prezzo. Controlla una vista calendario su un ampio intervallo di date invece che un solo giorno.",
      ],
    },
    "capital-one-portal-vs-transfer": {
      title: "Quando il portale viaggi di Capital One batte il trasferimento",
      summary: "Un riscatto in stile rimborso batte a volte il giro attraverso una tabella aerea.",
      body: [
        "Le miglia Capital One si riscattano a un centesimo fisso per punto su qualsiasi acquisto di viaggio, il che mette un pavimento al loro valore che le valute solo trasferibili non hanno.",
        "Sulle rotte con poca disponibilità partner, o quando una tariffa in contanti è insolitamente bassa, riscattare al tasso fisso può battere la caccia a un posto premio presso un partner.",
        "La regola pratica: se il miglior premio che trovi vale meno di un centesimo per punto, scegli il riscatto in stile rimborso.",
      ],
    },
    "flying-blue-promo-rewards": {
      title: "Flying Blue Promo Rewards: controlla il calendario prima di trasferire",
      summary: "I premi scontati mensili possono ridurre i punti necessari fino al 50%.",
      body: [
        "Flying Blue di Air France-KLM pubblica ogni mese un elenco a rotazione di rotte 'Promo Rewards' scontate, a volte a metà del prezzo della tabella standard.",
        "Poiché l'elenco cambia ogni mese e per cabina, conviene controllare la vista calendario della tua rotta prima di spostare punti da un programma bancario.",
        "Le rotte Promo Rewards in business class offrono il valore migliore dell'elenco; gli sconti in economy sono di solito più contenuti in valore assoluto.",
      ],
    },
    "avios-short-haul-distance-chart": {
      title: "La tariffazione a distanza Avios premia i voli diretti brevi",
      summary: "I voli sotto le 650 miglia possono costare meno di 10.000 Avios a tratta.",
      body: [
        "British Airways tariffa i riscatti Avios a distanza anziché per zona di cabina e rotta, il che rende i voli diretti molto brevi sproporzionatamente economici.",
        "Una tratta in economy sotto le 650 miglia può costare ben meno di 10.000 Avios più oneri contenuti, spesso meno della tariffa in contanti sulla stessa rotta.",
        "Funziona meglio sui voli diretti che sulle coincidenze, perché ogni segmento in più aggiunge il proprio supplemento a distanza.",
      ],
    },
    "amex-mr-to-marriott-bonus": {
      title: "Amex Membership Rewards → Marriott Bonvoy: bonus trasferimento del 20%",
      summary: "Gli alti fabbisogni di punti di Marriott rendono i bonus di trasferimento più importanti del solito.",
      body: [
        "American Express applica fino al 25 settembre un bonus del 20% sui trasferimenti di Membership Rewards verso Marriott Bonvoy, il primo aumento su questa coppia da mesi.",
        "La tabella per categorie di Marriott richiede molti più punti a notte dei programmi concorrenti, e i riscatti nelle categorie alte sfiorano appena un centesimo per punto: è il bonus di trasferimento a portare molti soggiorni a un valore decente.",
        "Meglio usarlo su un soggiorno già prenotato che per accumulare alla cieca: controlla prima il prezzo in contanti e trasferisci solo se il prezzo in punti, bonus incluso, resta sotto.",
      ],
    },
    "alaska-mileage-plan-oneworld-sweet-spot": {
      title: "L'occasione Oneworld di Alaska Mileage Plan è ancora aperta",
      summary: "Una delle ultime tabelle miglia mai passate al dinamico sui premi partner.",
      body: [
        "Alaska Mileage Plan ha lasciato intatti i vantaggi partner Oneworld mentre la maggior parte dei programmi statunitensi passava ai prezzi dinamici, e la tabella partner pubblicata vale ancora per i posti premio di Cathay Pacific, Qatar Airways e Japan Airlines.",
        "Un riscatto in business class verso l'Asia settentrionale può costare migliaia di miglia in meno di quanto chiederebbe il programma operante per lo stesso posto.",
        "La tabella premia chi prenota presto: i posti premio partner si aprono con largo anticipo e si esauriscono avvicinandosi alla partenza, quindi non è una strategia last minute.",
      ],
    },
    "ethiopian-shebamiles-intra-africa": {
      title: "ShebaMiles è l'unico modo sensato di pagare un volo dentro l'Africa",
      summary: "Addis Abeba raggiunge più continente di qualsiasi altro hub, e nessun altro lo mette in punti.",
      body: [
        "Volare fra due città africane di solito vuol dire pagare in contanti, e caro: su gran parte di queste rotte la concorrenza è così scarsa che un solo andata costa più di un biglietto transatlantico comprato nella stessa settimana.",
        "Ethiopian serve più continente di qualsiasi altra compagnia, quasi tutto via Addis Abeba, e ShebaMiles prezza quelle tratte in una banda regionale bassa invece di seguire la tariffa in contanti. Lagos, Nairobi, Accra e Johannesburg finiscono tutte nella stessa banda da Addis.",
        "Il problema è avere le miglia. Nessuna banca trasferisce 1:1 verso ShebaMiles, quindi è un programma in cui si accumula volando o accreditando voli Star Alliance. Meglio sistemarlo prima del viaggio che vuoi fare, non durante.",
      ],
    },
    "hawaiian-inter-island-awards": {
      title: "Fra le isole c'è l'ultimo prezzo fisso delle Hawaii",
      summary: "Honolulu verso le isole vicine costa sempre gli stessi punti, qualunque cosa faccia la tariffa in contanti.",
      body: [
        "Hawaiian ormai prezza le rotte verso il continente in base alla tariffa in contanti: un sabato d'estate per Honolulu costa quello che costa un sabato d'estate. I salti fra le isole non hanno seguito.",
        "Honolulu verso Kahului, Kona o Lihue resta a un prezzo premio fisso qualunque sia la data, e proprio nelle settimane in cui le tariffe in contanti fra le isole schizzano sta tutto il punto. Una famiglia di quattro che cambia isola a metà viaggio ci rientra lì.",
        "Le HawaiianMiles arrivano 1:1 da Amex Membership Rewards e da Bilt, quindi il saldo è facile da ricaricare. Prenota il salto fra le isole con i punti e tieni i contanti per la parte di viaggio che non è fissa.",
      ],
    },
    "citi-typ-to-thai-20-bonus": {
      title: "Citi ThankYou → Thai: 20% di bonus sul trasferimento",
      summary: "Le tratte brevi nel Sud-est asiatico sono già economiche con Royal Orchid Plus; così lo diventano di più.",
      body: [
        "Citi aggiunge il 20% quando sposti punti ThankYou verso Thai Royal Orchid Plus, fino a fine ottobre.",
        "Royal Orchid Plus non ha nulla di speciale sul lungo raggio ed è davvero buono dentro il Sud-est asiatico: Bangkok verso Singapore, Kuala Lumpur, Hanoi o Ho Chi Minh rientra in una banda regionale corta, e con il 20% in più il cambio effettivo supera 1,2 miglia per punto ThankYou.",
        "Prendilo come un modo di pagare le tratte di collegamento di un viaggio che stai già facendo, non come il viaggio stesso. Un trasferimento non si annulla, quindi sposta solo quello che serve a una prenotazione precisa.",
      ],
    },
    "icelandair-saga-stopover": {
      title: "Lo scalo gratuito a Reykjavík resta il motivo per tenere i punti Saga",
      summary: "La tabella premi è ordinaria. Passare una settimana in Islanda lungo la strada non lo è.",
      body: [
        "I premi di Icelandair fra Europa e Nord America non hanno nulla di notevole, e da soli non meriterebbero un paragrafo.",
        "Quello che vale è lo scalo. Keflavík sta più o meno a metà strada, e Icelandair ti lascia fermarti fino a una settimana su un premio transatlantico senza punti in più, così una prenotazione diventa due viaggi. Su quell'oceano non lo offre gratis nessun altro.",
        "Saga Club non accetta trasferimenti bancari 1:1, quindi i punti arrivano dai voli o dalla carta. Vale la pena se l'Islanda era comunque in lista, non vale la pena rincorrerlo se non lo era.",
      ],
    },
  },
  ja: {
    "amex-mr-to-ana-30-bonus": {
      title: "アメックス メンバーシップ・リワード → ANA：30%移行ボーナス",
      summary: "アジア行きビジネスクラスで最も有利な特典に、珍しいボーナスが付きます。",
      body: [
        "アメリカン・エキスプレスは10月15日まで、メンバーシップ・リワードからANAマイレージクラブへの移行に30%のボーナスを実施しています。",
        "ANAの距離制チャートは今も米国—日本のビジネスクラスを多くの競合プログラムより安く設定しており、このボーナスで実質の移行レートはアメックス1ポイントあたり1.3マイルを超えます。",
        "難点は、ANAの特典検索が提携社の空席を出発の数週間前にしか表示しないことが多い点です。直前の旅行向け、またはカレンダー表示と組み合わせて空席が出た瞬間を狙う使い方が向いています。",
      ],
    },
    "hyatt-category-1-4-sweet-spot": {
      title: "ワールド オブ ハイアット カテゴリー1〜4のお得さを解説",
      summary: "15,000ポイント未満の無料宿泊が、今もホテルポイントで最も有利な使い道である理由。",
      body: [
        "ワールド オブ ハイアットの特典チャートは8カテゴリーまであり、カテゴリー1〜4（一部のホテルでは1泊3,500ポイントから）は安定して1ポイントあたり2セント以上の価値になります。",
        "多くのホテルプログラムと違い、ハイアットは変動制に移行していません。チャートが読めるので、数か月先まで計画を立てられます。",
        "チェース アルティメット・リワードからの移行とカテゴリー1〜4のホテルを組み合わせれば、150ドル相当の宿泊が10,000ポイントをかなり下回ることもあります。",
      ],
    },
    "citi-turkish-airlines-25-bonus": {
      title: "シティ サンキューポイント → ターキッシュ エアラインズ：25%ボーナス",
      summary: "ターキッシュのスターアライアンス・チャートは、ビジネスクラスへの最も安い入口のひとつです。",
      body: [
        "シティは今月、複数の提携航空会社への移行に25%のボーナスを実施しており、ターキッシュ型の提携社チャートはスターアライアンスのビジネスクラスを予約する最も安い方法のひとつであり続けています。",
        "これらのチャートは運航会社ではなく距離で価格が決まるため、米国—欧州のビジネスクラスは運航会社自身が求める水準をかなり下回ることが多くあります。",
        "提携社チャートで制約になるのはいつも価格ではなく空席です。1日だけでなく、広い期間のカレンダー表示で確認してください。",
      ],
    },
    "capital-one-portal-vs-transfer": {
      title: "キャピタル・ワンの旅行ポータルが移行に勝つとき",
      summary: "キャッシュバック型の使い方が、航空会社チャート経由を上回ることがあります。",
      body: [
        "キャピタル・ワンのマイルは、あらゆる旅行の支払いに対して1ポイント＝1セント固定で使えます。移行専用の通貨にはない価値の下限がここにあります。",
        "提携社の特典枠が少ない路線や、現金運賃が異常に安い場合は、固定レートで使うほうが提携社の特典席を探すより有利になり得ます。",
        "目安はこうです。見つけた最良の特典が1ポイントあたり1セントを下回るなら、キャッシュバック型で使いましょう。",
      ],
    },
    "flying-blue-promo-rewards": {
      title: "フライングブルー プロモリワード：移行の前にカレンダーを確認",
      summary: "毎月の割引特典で、必要ポイントが最大50%下がることがあります。",
      body: [
        "エールフランス–KLMのフライングブルーは毎月、割引対象の「プロモリワード」路線を入れ替えて公開しています。標準チャートの半額になることもあります。",
        "対象は毎月、またクラスごとに変わるため、銀行系プログラムからポイントを移す前に、自分の路線をカレンダー表示で確認する価値があります。",
        "一覧の中ではビジネスクラスのプロモリワードが最も有利です。エコノミーの割引は金額で見ると小さくなりがちです。",
      ],
    },
    "avios-short-haul-distance-chart": {
      title: "Aviosの距離制運賃は短距離の直行便に有利",
      summary: "650マイル未満の路線なら、片道10,000Avios未満になることがあります。",
      body: [
        "ブリティッシュ・エアウェイズはAviosの特典をクラスと路線ゾーンではなく距離で価格付けしており、ごく短い直行便が相対的に非常に安くなります。",
        "650マイル未満の片道エコノミー特典は、10,000Aviosを大きく下回る水準に少額の諸費用を加えるだけで済むことがあり、同じ路線の現金運賃より安いケースも珍しくありません。",
        "乗り継ぎより直行便で効果が出ます。区間が増えるたびに、その区間分の距離に応じた費用が加算されるためです。",
      ],
    },
    "amex-mr-to-marriott-bonus": {
      title: "アメックス メンバーシップ・リワード → マリオット ボンヴォイ：20%移行ボーナス",
      summary: "マリオットは必要ポイントが多いぶん、移行ボーナスの効き方が大きくなります。",
      body: [
        "アメリカン・エキスプレスは9月25日まで、メンバーシップ・リワードからマリオット ボンヴォイへの移行に20%のボーナスを実施しています。この組み合わせでは数か月ぶりの上乗せです。",
        "マリオットのカテゴリー制は競合ホテルより1泊あたりの必要ポイントがかなり多く、上位カテゴリーでは1ポイント1セントに届くかどうかという水準です。多くの宿泊をまともな価値に引き上げているのが、この移行ボーナスです。",
        "当てもなく貯めるより、予約済みの宿泊に合わせて使うのが得策です。まず現金の価格を確認し、ボーナス込みのポイント価格がそれを下回るときだけ移行してください。",
      ],
    },
    "alaska-mileage-plan-oneworld-sweet-spot": {
      title: "アラスカ マイレージプランのワンワールド特典はまだ健在",
      summary: "提携社特典で変動制に移行しなかった、数少ないマイルチャートのひとつです。",
      body: [
        "多くの米国プログラムが変動制へ移る中、アラスカ マイレージプランはワンワールド提携の条件を維持しました。公開されている提携社チャートは今もキャセイパシフィック、カタール航空、日本航空の特典枠に適用されます。",
        "北アジア行きのビジネスクラス特典は、同じ座席に対して運航側のプログラムが求める水準より数千マイル安くなることがあります。",
        "このチャートは早い予約に報います。提携社の特典枠はかなり前に開放され、出発が近づくほど減っていくため、直前狙いの戦略には向きません。",
      ],
    },
    "ethiopian-shebamiles-intra-africa": {
      title: "アフリカ域内を飛ぶなら、まともな選択肢はShebaMilesだけ",
      summary: "アディスアベバはどのハブよりも広く大陸をカバーし、それをポイントで払えるのはここだけです。",
      body: [
        "アフリカの都市間を飛ぶとたいてい現金払いになり、しかも高い。多くの路線で競争が乏しく、片道が同じ週に買う大西洋線の往復より高くつくこともあります。",
        "エチオピア航空はどの航空会社より広く大陸を飛び、そのほとんどがアディスアベバ経由です。ShebaMilesはこれらの区間を現金運賃に連動させず、低い地域ゾーンで価格づけします。ラゴス、ナイロビ、アクラ、ヨハネスブルグはアディス発ではどれも同じゾーンに入ります。",
        "難点はマイルを手に入れること。1:1で移行できる銀行ポイントはないので、搭乗するかスターアライアンス便を加算して貯める必要があります。行きたい旅の直前ではなく、前もって準備しておきたいプログラムです。",
      ],
    },
    "hawaiian-inter-island-awards": {
      title: "島間路線はハワイに残った最後の固定価格",
      summary: "ホノルルから近隣の島へは、現金運賃がどう動いても必要ポイントは変わりません。",
      body: [
        "ハワイアン航空は本土線を現金運賃連動にしました。夏の土曜のホノルル行きは、夏の土曜の値段になります。島間のホップはそれに追随しませんでした。",
        "ホノルルからカフルイ、コナ、リフエは日付にかかわらず特典価格が一定です。島間の現金運賃が跳ね上がる週こそ、この固定価格が効いてきます。旅の途中で島を移る4人家族なら、それだけで元が取れます。",
        "HawaiianMilesはAmexメンバーシップ・リワードとBiltから1:1で移行できるので、残高は補充しやすい。島間は特典で押さえて、現金は固定されていない部分に回しましょう。",
      ],
    },
    "citi-typ-to-thai-20-bonus": {
      title: "Citi ThankYou → タイ国際航空：20%移行ボーナス",
      summary: "東南アジアの短距離はロイヤルオーキッドプラスで元から安く、これでさらに安くなります。",
      body: [
        "Citiは10月末まで、ThankYouポイントをタイ国際航空ロイヤルオーキッドプラスへ移行すると20%上乗せします。",
        "ロイヤルオーキッドプラスは長距離では平凡ですが、東南アジア域内は本当に優秀です。バンコクからシンガポール、クアラルンプール、ハノイ、ホーチミンは短い地域ゾーンに収まり、20%上乗せで実質1ThankYouポイントあたり1.2マイルを超えます。",
        "すでに決まっている旅の乗り継ぎ区間を払う手段と考えるのがよく、旅そのものに使うものではありません。移行は取り消せないので、具体的な予約に必要な分だけ動かしてください。",
      ],
    },
    "icelandair-saga-stopover": {
      title: "レイキャビクの無料ストップオーバーは、いまもSagaポイントを持つ理由",
      summary: "特典チャートは普通。途中でアイスランドに1週間滞在できるのは普通ではありません。",
      body: [
        "ヨーロッパと北米を結ぶアイスランド航空の特典価格に、特筆すべきところはありません。それだけなら一段落を割く価値もないでしょう。",
        "価値があるのはストップオーバーです。ケプラヴィークはちょうど中間あたりにあり、大西洋線の特典で最大1週間、追加ポイントなしで滞在できます。1回の発券が2つの旅になるわけです。この大洋で無料でそれを認めている会社はほかにありません。",
        "Saga Clubに1:1の銀行移行はないので、ポイントは搭乗か提携カードから貯めます。もともとアイスランドが候補にあったなら計画する価値があり、なかったなら追いかけるほどではありません。",
      ],
    },
  },
};

/**
 * The article in the reader's language, falling back to the English
 * original. The fallback is a safety net for a deal added without
 * translations, which the test above makes hard to ship.
 */
export function dealText(deal: Deal, locale: Locale): DealText {
  if (locale === "en") return { title: deal.title, summary: deal.summary, body: deal.body };
  return DEAL_TEXT[locale]?.[deal.slug] ?? { title: deal.title, summary: deal.summary, body: deal.body };
}

/** True when every deal has copy in this locale. */
export function isFullyTranslated(locale: Locale): boolean {
  if (locale === "en") return true;
  const map = DEAL_TEXT[locale];
  return !!map && DEALS.every((d) => d.slug in map);
}
