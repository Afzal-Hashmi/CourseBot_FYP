import useNavigate from "react-router-dom";
import Cookies from "js-cookie";
const navigate = useNavigate();
const HandleLogout = () => {
  Cookies.remove("token", { path: "/" });
  Cookies.remove("user", { path: "/" });
  Cookies.remove("role", { path: "/" });
  if (!Cookies.get("token") && !Cookies.get("user") && !Cookies.get("role")) {
    navigate("/");
  } else {
    console.error("Logout failed. Cookies still exist.");
  }
};

export default HandleLogout;
