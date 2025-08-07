import { useEffect } from "react";

export const App = () => {
  useEffect(() => {
    fetch("https://mono-press-5a039da642a5.herokuapp.com/api/hello")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  }, []);

  useEffect(() => {
    // Extract code from URL if present
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      fetch(
        `http://localhost:3000/api/login/google/callback?code=${code}`
      ).then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            // data = "http://localhost:3000/auth"
            // sign-up
            //location.href = //";
          });
          // location.href = "http://localhost:3000/";
        }
      });
    }
  }, []);

  return (
    <>
      <h1>Welcome to bvla blal bla </h1>

      <a href="http://localhost:3000/api/login/google/start">
        Login with Google
      </a>
    </>
  );
};

export default App;
