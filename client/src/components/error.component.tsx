import CenterLayout from "./compositions/center-layouts/center-layout.component";
import LoadingSpinner from "./loading-spinner.component";

const Error = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");

  if (code) {
    return (
      <CenterLayout intrinsic center>
        <LoadingSpinner />
      </CenterLayout>
    );
  }

  return <div>404!!!!</div>;
};

export default Error;
