import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const GoogleSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const role = params.get("role");
        const userRaw = params.get("user");

        console.log("Google Success Params:", { token, role, userRaw });

        try {
            if (token && role && userRaw) {
                const user = JSON.parse(decodeURIComponent(userRaw));

                Cookies.set("token", token, { path: "/", expires: 30 / 1440 });
                Cookies.set("role", role, { path: "/", expires: 30 / 1440 });
                Cookies.set("user", JSON.stringify(user), { path: "/", expires: 30 / 1440 });
                Cookies.set("isGoogleLogin", true, { path: "/", expires: 30 / 1440 });


                navigate("/student/dashboard");
            } else {
                navigate("/");
            }
        } catch (err) {
            console.error("Failed to process Google login:", err);
            navigate("/");
        }
    }, [navigate]);

    return <div>Logging you in with Google...</div>;
};

export default GoogleSuccess;
