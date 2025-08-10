import { Link } from "react-router";

const UnauthorizedAnonymousUserMessage = () => {
  return (
    <>
      <h1>Uautorisert tilgang</h1>
      <p>Du må være innlogget for å se denne siden.</p>
      <Link to="/login" title="Logg inn">
        Logg inn
      </Link>
    </>
  );
};

export default UnauthorizedAnonymousUserMessage;
