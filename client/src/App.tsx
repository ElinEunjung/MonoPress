import { BASE_GLOBAL_URI } from "./constants/base-global-uri";

export const App = () => {
  return (
    <>
      <h1>Welcome to bvla blal bla </h1>

      <a href={`${BASE_GLOBAL_URI.BACKEND}/auth/login`}>Login with Google</a>
    </>
  );
};

export default App;
