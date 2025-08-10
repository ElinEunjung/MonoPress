import { Link } from "react-router";

const UnauthorizedNoneEditorUserMessage = () => {
  return (
    <>
      <h1>Uautorisert tilgang</h1>
      <p>Du må ha rollen som redaktør for å se innholdet.</p>
      <Link to="/" title="Gå tilbake til hovedsiden">
        Gå tilbake til hovedsiden
      </Link>
    </>
  );
};

export default UnauthorizedNoneEditorUserMessage;
