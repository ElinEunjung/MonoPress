

# PG6301 konte : MonoPress

## 📌 Lenker

- [GitHub](https://github.com/kristiania-pg6301-2024/pg6301-2025-konte-ElinEunjung)
- [Heroku](https://mono-press-5a039da642a5.herokuapp.com/)
- [Test Rapport][(add-link-here)]

---

## 🔍 Funksjonelle krav (oppfylt)

- ✅ Anonyme brukere skal se nyhetsaker når de kommer til nettsiden (Det er lagt inn noen nyhetssaker for a demonstrere)
- ✅ Brukere kan logge seg inn. Du kan velge brukere skal kunne registrere seg med brukernavn og passord (anbefales ikke) eller om brukere skal logge inn med Google eller Entra ID
  > Generelle brukere (`non-editor`) kan logge inn med Google. Registrerte redaktører (`editor`) kan logge inn med brukernavn og passord. Denne løsningen er for å vise protected routes, som f.eks (`/dashboard`) for redaktør. Når generelle brukere trykker "dashboard" (`/dashboard`), får de se "Uauthorisert tilgang" melding
- ✅ En bruker som er logget inn kan se pa sin profilside
  > "Profil"-menyen vises i navigasjonsfeltet kun når en bruker er innlogget, for å gjøre det tydelig.  
- ✅ Brukere skal forbli logget inn når de refresher websiden
- ❌ En bruker som er logget inn kan klikke på et innlegg for hvem som har reagert på innlegget og kommentarer. Detaljene skal inkludere en overskrift, tekst, navn og bilde (om tilgjengelig) på den som publiserte den
  > For bildeopplasting er `multer` brukt som middleware på serveren. Av tidshensyn lagres bildene lokalt på serveren (`server/public/uploads`) og ikke i en tredjepartstjeneste.
- ✅ Redaksjonelle brukere kan logge seg inn
  > 👉 Bruk `email: editor@monopress.com` og `password: password` for å logge inn som redaktør.
- ✅ Redaksjonelle brukere kan publisere nye nyhetsartikler
- ✅ Nyhetsartikkel skal inneholde en kategori valgt fra en nedtrekksliste ( <select> ), tittel ( <input> ) og tekst ( <textarea> )
- ✅ Dersom noen allerede har publisert en nyhetsartikkel med samme tittel skal serveren sende HTTP status kode 400 og en feilmelding
      > Brukeren får melding som "Nyhets artikkelen av samme navn eksisterer allerede"
- ✅ Brukeren skal forhindres fra å sende inn en nyhetsartikkel som mangler kategori, tittel eller tekst
     > Brukeren får meldingen som "Kategori, tittel eller tekst er påkrevd"
- ✅ En redaksjonell bruker skal kunne redigere en artikkel de selv har publisert
- ✅ En redaksjonell bruker skal kunne slette en bruker de selv har publisert
- ✅ Alle feil fra serves skal presenteres til bruker på en pen mate, med mulighet for brukeren til a prøve igjen
     > Eksempler på feilmelidnger er "Failed to retrieve news", "Failed to update news", "Failed to add news", "Article not found" og"Failed to delete news"

---

## 🛠️ Tekniske krav (Oppfylt)

- ✅ Oppsett av `package.json`, `vite`, `express`, `prettier`.

- ✅ React Router.

- ✅ Express app.

- ✅ Kommunikasjon mellom frontend (React) og backend (Express).
     > `Axios` er brukt for å håndtere respons med jwt-token fra serveren. `Axios` fanger opp responsen fra serveren før den ble behandles av klienten hvis access token er ugyldig og retunerer error.

- ✅ Deployment til `Heroku`.

- ✅ Bruk av `MongoDB`.
     > `Mongoose` er brukt for å håndtere data fra MongoDB

- ✅ OpenID Connect (Google)

- ❌ Tester med dokumentert testdekning
     > (under arbeid)

---

## 💡 Mulige forbedringer
- Implementer bildelagring i en skytjeneste (f.eks. `Cloudinary` ) i stedet for lokalt på serveren for bedre skalerbarhet.
- Integrerer en tredje part tekst editor som `Tiptap` i stedet for ren html på "opprett ny artikkel"-siden.


---

## 📚 Kilder
 - Gratis ikon: [(https://loading.io/)]
 - Inspirasjoner for prosjekt farge: [(https://colorkit.co/palette/d1d1d3-e1dbd6-e2e2e4-f9f6f2-fefefe/)]
