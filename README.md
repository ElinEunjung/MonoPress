# PG6301 Konte : MonoPress

## Table of Content

1. [Redaktør-innlogginsdetaljer](#Redakt%C3%B8r-innlogginsdetaljer)
2. [Lenker](#Lenker)
3. [Funksjonelle Krav (oppfylt)](<#Funksjonelle%20Krav%20(oppfylt)>)
4. [Tekniske Krav (Oppfylt)](<#Tekniske%20Krav%20(Oppfylt)>)
5. [General Design Og Mappestruktur](#General%20Design%20Og%20Mappestruktur)
   1. [Arkitektur Av Prosjektet](#Arkitektur%20Av%20Prosjektet)
      1. [Frontend - Client](#Frontend%20-%20Client)
      2. [Backend - Server](#Backend%20-%20Server)
6. [Mer Detalj om Teknisk løsning](#Mer%20Detalj%20om%20Teknisk%20l%C3%B8sning)
   1. [Server Validering Med JWT-token](#Server%20Validering%20Med%20JWT-token)
   2. [Bildeopplasting](#Bildeopplasting)
7. [Kilder](#Kilder)

---

## ‼️Redaktør-innlogginsdetaljer

- **Email**: editor@monopress.com
- **Password**: admin

  > 📌Viktig!
  > Brukere some logger inn via Google (SSO) er ikke redaktører. Dette er KUN brukt some demo eksempel for innlevering. Innlogginsdetaljene er allerede lagret på forhånd i MongoDB.
  > For å teste tilgang til den beskyttede siden (`/dashboard`) some kun er tilgjengelig for redaktører, må du bruke redaktør-innloggingsdetaljene over.

---

## Lenker

- [GitHub-repo](https://github.com/kristiania-pg6301-2024/pg6301-2025-konte-ElinEunjung)
- [Heroku-deployment](https://mono-press-5a039da642a5.herokuapp.com/)
- [Test-Rapport](https://github.com/ElinEunjung/MonoPress/actions)

  > ⚠️ Problemer! <br>
  > Jeg opplevde problemer med å koble classroom-repoet til Heroku-serveren via Github Action[A](docs/github-action.png), derfor har laget et nytt repo [B](docs/heroku.png) for tilkobling, og aktiverte automatisk deploy i [C,D](docs/heroku.png). I Heroku-serverens build-logg [E](docs/heroku-2.png), kan vi se både build og deploy er gjennomført [F](docs/heroku-3.png), og endringene blir publisert til serveren.

---

## Funksjonelle Krav (oppfylt)

- Anonyme brukere kan se nyhetsartikler uten innlogging (_Eksempelartikler er lagt inn for demonstrasjon_)

- Innlogging for brukere:
  - Brukere some logger inn i Google SSO får automatisk tildelt rolle some `none-editor`, og de blir lagret i MongoDB.
  - Redaktører har rolle `editor` kan logge inn med brukernavn og passord.
  - Dashboard (`/dashboard`) er beskyttet. Brukere uten rettigheter får meldingen om "Uautorisert tilgang".

- Profilside er kun synlig for innloggede brukere.

- Ved refresh forblir brukere innlogget.

- Visning av reaksjoner og kommentarer på et innlegg.
  - Innloggede brukere kan **lage/endre/slette** kommentarer, samt reagere (tommer opp/ned) på artikler.

    > Av tidshensyn støttes det ikke funksjonen for å endre/slette kommentarer av egne forfatter

    > 💡 Potensial forbredning <br>
    > Bildeopplasting håndteres med `multer` bibliotek some hjelper oss med å lagre bildene i vår locale PC i mappe strukturen `./server/public/uploads`.
    >
    > Når bilder latest opp via den locale serveren _(min datamaskin)_, vil de ikke vises på Heroku serveren. Årsaken er at i Node koden har, så har definert at alle opplastede bilder får en referanse til Herokus testserver URL. Dette gjør at bilder some latest opp i et lokalt PC-miljø lagres i lokalt, og ikke på Heroku-serveren. Resultatet er at hvis du besøker nettsiden på Heroku, vil ett eller flere bilder fremstå some tomme. Logger du derimot inn some redaktør på Heroku-serveren og laster opp bilder der, lagres de some forventet på Heroku-serveren.
    >
    > En bedre løsning kunne vært å opprette en egen MongoDB-kolleksjon for testmiljøet some peker til den locale PC-ens URL, og en annen for Heroku, slik at alle lagringer der skjer direkte mot Heroku. Dette ville gitt en tydeligere _separation of concerns_, lettere å se visuelt hva some foregår i frontend, men på grunn av tidsbegrensninger fikk jeg ikke gjennomført det.

- Innlogging for redaksjonelle brukere

- Publisering av nye artikler av redaktør.

- Nyhetsartikkel inneholder kategori html `<select>`, tittel `<input>` og text `<textarea>`

- Unik tittel-validering: serveren returnerer HTTP 400 hvis tittel allerede finnes.

- Validering: forhindrer innsending av artikler uten kategori, tittel eller text.

- Redigering av egne artikler for redaktør.

- Sletting av bruker publisert av redaktør

  > Jeg tolket det some _sletting av egne artikler_, da brukere opprettes via Google-login.

- Feilhåndtering med brukervennlige meldinger, some for eksempel:
  - "Failed to retrieve news"
  - "Failed to update news"
  - "Article not found"
  - "Failed to delete news"

---

## Tekniske Krav (Oppfylt)

- Oppsett av `package.json`, `vite`, `express`, `prettier`, `Concurrently`, `Vitest`, `Husky
- React Router.
- Express app.
- Kommunikasjon mellom frontend (React) og backend (Express).
  - `Axios` er brukt for å håndtere respons med jwt-token fra serveren. `Axios` fanger opp responsen fra serveren før den blir behandlet av klienten hvis access token og JWT verifisering er ugyldig og retunerer error.

- Deployment til `Heroku`.

- Bruk av `MongoDB`.
  - `Mongoose` biblioteket er brukt for å håndtere data fra MongoDB

- OpenID Connect (Google OAuth 2.0)

- Tester med dokumentert testdekning

- God layout med CSS Grid og horisontal navigasjonsmeny
  - Modulbaserte og gjenbrukbare layoutkomponenter i `client/src/components/compositions`. Begrepet [compositions](https://cube.fyi/composition.html) er tatt i metodikk fra Andy Bell.
  - Strukturen inkluderer bl.a `box-layouts`, `center-layout`, `cluster-layout`, `grid-layouts`, `stack-layouts`, `switcher-layout`,`wrapper-layouts`.
    - Styling er kun delvis fullført pga. tidsbegrensning
- Valgfritt: Loading-spinner [loading.io](https://loading.io/)

---

## General Design Og Mappestruktur

MonoPress følger en **monorepo-struktur** med både frontend (`client/`) og backend (`server/`) i samme rotmappe,
organisert etter en **feature-basert struktur** for bedre modularitet, gjenbruk og vedlikehold. Angående dyp nøstet filene, har jeg forsøkt å plassere filer some er avhengige av hverandre sammen.

### Arkitektur Av Prosjektet

I `src` mappen, er alle mapper tilgjengelig some "globalt" ressurs. Eks. i frontend CSS, så er det en fil some heter `src/styles/utilities/background-color.css`. Disse bakgrunns farge av CSS er tilgjengelig globalt på frontend applikasjonen.

#### Frontend - Client

Bygget med **React**, **TypeScript** og **Axios**, strukturert etter funksjonelle områder:

```
└── /client/src/
    ├── api         # Funksjoner for kommunikasjon med backend-API (håndteres av Axios)
    ├── assets      # App-ikoner og andre statiske ressurser
    ├── components  # Gjenbrukbare UI/UX-komponenter
    ├── constants   # Globale konstanter brukt på tvers av applikasjonen
    ├── contexts    # React Context Providers for global state (f.eks. brukerinfo)
    ├── hooks       # Egendefinerte hooks for logikkgjenbruk (f.eks. login callback-håndtering)
    ├── layouts     # Layout-komponenter for sideoppsett
    ├── pages       # Sider som representerer ruter i applikasjonen
    ├── router      # React Router-konfigurasjon
    ├── styles      # Globale og modulbaserte stilark (CSS)
    ├── test        # Testfiler
    ├── types       # TypeScript-typer og interfaces
    └── utils       # Hjelpefunksjoner som brukes på tvers
```

#### Backend - Server

```
└── /server/src/
    ├── configs # Konfigurasjonsfiler (f.eks. miljøvariabler)
    ├── constants # Globale konstanter for serveren (f.eks. JWT-secret)
    ├── controllers # Funksjoner some håndterer innkommende API-forespørsler
    ├── databases # Databaseoppsett og tilkoblingslogikk (MongoDB via Mongoose)
    ├── middleware # Egendefinerte middleware for autentisering, validering og feilhåndtering
    ├── models # Mongoose-modeller some definerer datastrukturen (f.eks. news, users)
    ├── routes # API-endepunkter organisert etter ressurs
    ├── services # Forretningslogikk og kommunikasjon med tredjepartstjenester
    └── utils # Server-spesifikke hjelpefunksjoner
```

Hvis mappe strukturen er nøstet innover, så er formålet med å innkapsle kunnskap der filer some jobber sammen bor nærme sammen:

```
└── /client
    └── src
        └── pages
            └── dashboards
                ├── components
                │ └── protected-routes
                │ ├── components
                │ │ ├── unauthorized-anonymous-user-message.component.tsx
                │ │ └── unauthorized-none-editor-user-message.component.tsx
                │ └── protected-routes.component.tsx
                └── dashboard-page.component.tsx
```

Her set du f.eks. `protected-routes.component.tsx` jobber kun sammen med:

- `unauthorized-anonymous-user-message.component.tsx`
- og `unauthorized-none-editor-user-message.component.tsx`.

Hvis vi i prakis hadde lagt alt inne i en `components` mappe på topp nivå av frontend applikasjonen, så hadde det vært ett problem på sikt, pga. det er vanskelig å forstå tilhørighet, og kunnskapene av hva ulike filene gjør med hverandre. Her er eksempel:

```
src/
├── App.tsx
└── components/
    ├── AnalyticsTracker.ts
    ├── AnimatedSplashScreen.component.tsx
    ├── AuthValidator.ts
    ├── ConfigLoader.ts
    ├── CurrencyConverterAPI.ts
    ├── DataTable.component.tsx
    ├── DatePickerModal.component.tsx
    ├── ErrorToast.component.tsx
    ├── FooterLinks.component.tsx
    ├── GlobalHeader.component.tsx
    ├── ImageCarousel.component.tsx
    ├── LegacyDataProcessor.ts
    ├── MarkdownRenderer.component.tsx
    ├── MarketingBanner.component.tsx
    ├── NotificationService.ts
    ├── PriceCalculator.component.tsx
    ├── ProductGallery.component.tsx
    ├── SidebarNav.component.tsx
    ├── SubscriptionForm.component.tsx
    └── UserProfileCard.component.tsx
```

Eksempelen jeg har gitt har jeg fått inspirasjon fra:

- [Bulletproof-react](https://github.com/alan2207/bulletproof-react?tab=readme-ov-file)
- [React - The Road To Enterprise](https://theroadtoenterprise.com/books/react-the-road-to-enterprise/typescript)

> Noen filene ligger ikke i riktig mappe fordi jeg kunne ikke rydde opp pga tidsbegrense av eksamen

---

## Mer Detalj Om Teknisk Løsning

### Server Validering Med JWT-token

- For validering mellom servere bruker jeg some standard et `jwt-token` some inneholder et `access token` generert av Google OAuth.
- For mock user (editor) genererer jeg `jwt-token` ved hjelp av Node.js sin innebygde bibliotek `crypto`, slik at jeg slipper å håndtere unødvedige edge cases.

- For å generere `JWT_SECRET` brukte jeg følende kommando i terminalen, så måtte jeg skrive `node` for å aktivere REPLIT, og deretter skrive følgende kommando under for å generer en tilfeldig krypto verdi.

```bash
 require("crypto".randomBytes(64).toString("hex")
```

- På backend har jeg implementert `policy` (rettigheter):
  - read
  - write
  - update
  - delete

Det er knyttet til at i frontend skal kunne bruke disse verdiene for å validere om brukeren har rettigheter ved å reagere på artikkel reaksjon, og i tillegg kommentarer. Desverre, fikk jeg ikke muligheten til å implementere det, pga. tidsbegrensning for innlevering av eksamen.

### Bildeopplasting

- Opplastede bilder lagres i `server/public/uploads/` ved hjelp av `multer`.

> En bedre forbedring potensialitet er å lagre bilder i en skytjeneste f.eks. [Cloudinary](https://cloudinary.com/) i stedet for lokalt på serveren for bedre skalerbarhet.

---

## Kilder

- **Ikon** - https://loading.io/
- **Farge inspirasjon**: https://colorkit.co/palette/d1d1d3-e1dbd6-e2e2e4-f9f6f2-fefefe/
- **Frontend Layout inspirasjon**: https://every-layout.dev/
- **Prosjekt arkitektur**:https://theroadtoenterprise.com/books/react-the-road-to-enterprise/typescript
  - Chapter 3. Scalable and Maintainable Project Architecture
- Gemini modell 2.5 Pro
- VCS Copilot modell Claude Sonnet 4
