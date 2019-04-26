# Web Design @cmda-minor-web 1819
**Buien radar gemaakt voor Larissa.**

![images](images-readme/Screenshot&#32;2019-04-26&#32;at&#32;12.30.03.png)

 ## User scenario:
- **Wie**
Larissa (blind), ze heeft een achtergrond in de ICT en is ook user tester voor de HvA. Ze woont op texel, op een boerderij en werkt daar ook. Ze is para-cyclist en heeft een zilveren medaille gewonnen op de spelen in Rio en is nu bezig met trainen voor de aankomende spelen. Ze doet ook aan paardrijden en doet dat ook op een best hoog niveau.

- **Wat**
Buienradar kunnen gebruiken, zonder het aan iemand hoeven te vragen wat er staat.

- **Hoe**
een formulier dat goede omschrijvende labels en koppen bevat. Het formulier geeft feedback terug aan de (blinde)gebruiker wanneer zij iets fout of goed heeft ingevuld. Feedback terug krijgen wat er op de buienradar kaart staat

**user scenario**
> Larissa woont op Texel en moet naar Amsterdam toe reizen. Ze wilt op buienradar checken wat de weersverwachting is voor de komende paar uur, zodat ze niet voor verassingen komt te staan. Ze wilt op een prettige en snelle manier haar huidige locatie kunnen invullen en van daaruit de kaart kunnen uitlezen met haar screenreader.

## Week 1
Tijdens de eerste ontmoeting zijn we vooral kennis gaan maken met Larissa. Wij konden niet testen, omdat ze haar laptop niet bij zich had.

Dit zijn mijn insights van de kennismaking:

- skip link naar hoofdnav
- drop down menus zijn kut, door js enz
- hoe fancier het menu/formulier, hoe on toegankelijker het wordt
- nvda opensource screenreader om mee te testen, jaws voor eigen gebruik. Jaws mag niet voor test doeleinden gebruikt worden.
- nav boven aan, of met een skiplink 
- niet verstoppen op een plek waar je hem niet gelijk ziet of dat je m pas na een paar tabs vindt
- sneltoets dat je ’t menu kan vinden
-geen sites die dat gebruiken

- Op fb shortcuts alt + de cijfers, maar die conflicteren met bepaalde screenreaders
- kruimel pad, niet altijd zichtbaar

- goed omschrijvende koppen, labels etc.
- sites van luchtmaatschappijen, zijn bijvoorbeeld vervelend.

- gebruiker niet overspoelen met informatie
- lege alt tags

- braille regel, om spelling of cijfers te begrijpen. Op de teken specifiek…
- ctrl home, om boven aan de pagina te komen, als je verdwaalt bent.
- voorbeeld, nieuwe hva website, want zat er een iframe in.
- iframe is not done, komt alleen ellende van -> cookie popups

**fijne toegankelijke sites:**
- ns 
- site van stichting accessibility 
- audio game

- tabellen zijn lastig om uit te lezen
- spraak wordt populairder dan braille

- feedback met geluidjes, toetsen met goed of fout, dat je daar ook feedback van krijgt.

**sites die ze graag zou willen gebruiken:**
- luchtvaartmaatschappij
- buienradar
- boekingsysysteem voor hva lokalen
- tabellen
- kaarten van iPhone zelf, werkt wel oké. Je hebt alleen niet echt een overzicht van wat start in de noordelijke richting. Geen bevestiging als je goed en fout loopt.

## Week 2

Met de info van week 1 ben ik mij gaan richten op buienrader. Ik ben mij gaan focussen op dropdown/autocomplete invulvelden.

ze vertelde namelijk hoe fancier de UI, hoe kutter het is voor mij als blinde gebruiker. Ik zelf dacht toen, waarom zou het voor haar dan niet fancy kunnen?

**User test**
Voor de user test heb ik een autocomplete invul veld gemaakt, die feedback terug geeft hoe veel resultaten er over zijn in het lijstje. En of ze iets invult, dat niet overeen komt met de data in het invoer veld.

Ik heb haar de opdracht gegeven om gewoon door de site te gaan, zonder dat ik haar erbij help. Zo kon ik meteen zien, wat voor haar natuurlijk aanvoelt.

**Insights:**
- Larissa tabt als eerste door een pagina heen. Ik was ervanuit gegaan dat ze pijltjes toetsen gebruikt. Dit ging dan niet zo lekker...
- Labels waren op mac wel gekoppeld, maar op haar windows pc werkte hij niet.
- Houdt rekening met de context van de autocomplete, niet dat je eerst iets invult en dan iets anders wilt invullen en het dan niet werkt.
- Wanneer je iets selecteert in het autocomplete veld, verandert het de context en kan ze de rest van resultaten niet meer horen.
  
  [link naar eerste versie](https://monikaas.github.io/web-design-1819/eerste-versie.html)

  ![images](images-readme/Screenshot&#32;2019-04-26&#32;at&#32;11.45.17.png)

  ## Week 3

  [User test final](https://monikaas.github.io/webdesign-test/)

Voor deze user test wilde ik mij gaan focussen op geluid, die het weer laten horen. Ik heb daarvoor 3 versies gemaakt:
1. versie 1 om de context te testen, snapt zij wat ik bedoelde met de geluiden
2. Versie 2 om de volledige tekst de screenreader te laten voorlezen en het geluid tegelijk af te laten spelen
3. versie 3 om het geluid later in te laten komen, dan de screenreader

algemene insights:
- Labels waren nu goed, input veld werkt alleen niet lekker op mac(maar dat maakt niet, want Larissa heeft een windows)
- Doordat ik tabindex ben gaan gebruiken, werkte mijn aria live invoervelden buggy en kon je er niet meer heen tabben.
- beter linkjes gebruiken, waar ze door heen kan tabben. Dan tabindex

![images](images-readme/Screenshot&#32;2019-04-26&#32;at&#32;11.59.09.png)

**versie 1:**
insights:
- contexts was te begrijpen, ze snapte wat ik bedoelde met de geluiden
- regen niveau's waren niet meteen duidelijk
  
  ![image](images-readme/Screenshot&#32;2019-04-26&#32;at&#32;12.11.50.png)

  **versie 2:**
  insights:
- Volledige weersvoorspelling en text vond ze fijn, voor de context
- Het geluid mag iets zachter, maar ze vond het ook wel wat hebben. Ze had met het geluid van de hoosbui meteen het gevoel dat ze buitenstond en dat je elkaar niet kan horen
- Deze versie vond ze daarom ook het aller leukst

![images](images-readme/Screenshot&#32;2019-04-26&#32;at&#32;11.45.17.png)

**versie 3:**
- Geluid pas later inkomen, wanneer de screenreader klaar is met lezen is het erg lastig om te timen. Want dat heeft te maken met de instellingen die je hebt ingesteld. Ze zei ook dat ik dit idee beter kon laten, maar dat het wel een leuk expirement was.

![images](images-readme/Screenshot&#32;2019-04-26&#32;at&#32;12.28.09.png)

## Exclusive design principes

**Study Situation**:
- Larissa ervaart de wereld met gehoor en gevoel.
- De weer geluiden gaven haar het gevoel dat ze ook echt buitenstond.
- Larissa tabt door de pagina's heen en haalt eerst alle koppen en linkjes op.
- Feedback op het input veld vond ze erg prettig, ik moest alleen geen autocomplete zetten op het selecteren van een optie. Ze wilt graag de andere opties ook kunnen gebruiken.
  
**Ignore conventions**:
- Autocomplete velden geven feedback aan de gebruiker, hoeveel restultaten er zijn en of je iets invoert wat niet in de database staat.
- Geluiden tijdens het tabben

**Prioritise Identity**:
- Ik wil graag het weer simpel en duidelijk te horen krijgen.
- Geen lange zinnen of aangeven hoeveel mm regen er valt. Larissa heeft daar niks aan.

**Add nonsense:**
- Geluiden die het weer laten horen
  
## wat ik nog graag had willen toevoegen/testen
- mobiele versie
- weer API er aan koppelen
- meer locaties