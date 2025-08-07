const Error = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");

  console.log(code);

  if (code) {
    return <p>Loading...</p>;
  }

  return <div>error.component</div>;
};

export default Error;
