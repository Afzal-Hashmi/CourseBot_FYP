// src/pages/Signup.jsx
import InputField from "../components/InputField";
import PasswordField from "../components/PasswordField";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";

const SignUpPage = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#f5f6fa]">
      <Sidebar />

      <div className="w-full md:w-3/5 p-8 md:p-16 flex items-center justify-center">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-semibold mb-6">Create Account</h2>
          <form>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="w-full">
                <InputField type="text" placeholder="First Name" />
              </div>
              <div className="w-full">
                <InputField type="text" placeholder="Last Name" />
              </div>
            </div>

            <div className="mb-4">
              <InputField type="email" placeholder="Email Address" />
            </div>

            <div className="mb-4">
              <PasswordField placeholder="Password" />
            </div>

            <div className="mb-4">
              <PasswordField placeholder="Confirm Password" />
            </div>

            <button
              type="submit"
              className="w-full bg-[#3498db] text-white py-3 rounded-md text-lg mt-2"
            >
              Sign Up
            </button>
          </form>

          <div className="text-center mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-[#3498db] font-bold">
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
