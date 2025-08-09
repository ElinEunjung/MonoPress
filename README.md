# MonoPress

## Inspirasjoner for prosjekt farge:

- https://colorkit.co/palette/d1d1d3-e1dbd6-e2e2e4-f9f6f2-fefefe/

## Noe tanker på som kan være forbedring

---

### LocalStorage vs Cookies

---

Jeg har ikke funnet en mulighet at OAuth 2.0 fra Google sender meg tilbake en callback uri med cookies. Derfor har jeg laget en "naiv" løsning, som vi bruker local storage for å lagre access token

## Link til repo

- [GitHub](https://github.com/kristiania-pg6301-2024/pg6301-2025-konte-ElinEunjung)
- [Heroku](https://mono-press-5a039da642a5.herokuapp.com/)
- [Test Rapport][(add-link-here)]

## Egenutfylling av funksjonelle krav

- [ ] Anonyme brukere skal se nyhetsaker når de kommer til nettsiden (legg inn noen nyhetssaker for a demonstrere)
- [ ] Brukere kan logge seg inn. Du kan velge brukere skal kunne registrere seg med brukernavn og passord (anbefales ikke) eller om brukere skal logge inn med Google eller Entra ID
- [ ] En bruker som er logget inn kan se pa sin profilside
- [x] Brukere skal forbli logget inn når de refresher websiden
- [ ] En bruker som er logget inn kan klikke på et innlegg for hvem som har reagert på innlegget og kommentarer. Detaljene skal inkludere en overskrift, tekst, navn og bilde (om tilgjengelig) på den som publiserte den\*\*
- [ ] Redaksjonelle brukere kan logge seg inn

  o NB: Her var det meningen at man skulle bruke Entra ID (Active Directory), men det ser ut som Microsoft har endret dette. Entra ID er ikke lenger en forventning, men om du mot formodning får det til betyr det bonuspoeng

- [ ] Redaksjonelle brukere kan publisere nye nyhetsartikler
- [ ] Nyhetsartikkel skal inneholde en kategori valgt fra en nedtrekksliste ( <select> ), tittel ( <input> ) og tekst ( <textarea> )

- [ ] Dersom noen allerede har publisert en nyhetsartikkel med samme tittel skal serveren sende HTTP status kode 400 og en feilmelding
- [ ] Brukeren skal forhindres fra å sende inn en nyhetsartikkel som mangler kategori, tittel eller tekst
- [ ] En redaksjonell bruker skal kunne redigere en artikkel de selv har publisert
- [ ] En redaksjonell bruker skal kunne slette en bruker de selv har publisert
- [ ] Alle feil fra serves skal presenteres til bruker på en pen mate, med mulighet for brukeren til a prøve igjen

## Egenutfylling av tekniske krav

- [x] Oppsett av package.json, vite, express, prettier

- [x] React Router

- [x] Express app

- [x] Kommunikasjon mellom frontend (React) og backend (Express)

- [x] Deployment til Heroku

- [x] Bruk av MongoDB

- [x] OpenID Connect (Google)

- [] Tester med dokumentert testdekning
  _ (komment)_
