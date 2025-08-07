import { useNavigate } from "react-router";
import { BASE_GLOBAL_URI } from "../constants/base-global-uri";

const DashboardComponent = () => {
  const navigate = useNavigate();

  async function handleLogout() {
    const accessToken = localStorage.getItem("accessToken");

    await fetch(`${BASE_GLOBAL_URI.BACKEND}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ accessToken }),
    }).then((response) => {
      if (response.ok) {
        localStorage.removeItem("accessToken");

        navigate("/");
      }
    });
  }

  return (
    <div>
      Dashboard Component
      <button type="button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default DashboardComponent;
