const Error = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");

  if (code) {
    return;
  }

  return <div>error.component</div>;
};

export default Error;
