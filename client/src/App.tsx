import { useEffect } from "react";

export const App = () => {
  useEffect(() => {
    fetch("https://mono-press-5a039da642a5.herokuapp.com/:5000/api/hello")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  }, []);
  return (
    <>
      <h1>Welcome to bvla blal bla </h1>
    </>
  );
};

export default App;
