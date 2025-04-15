// src/components/PasswordField.jsx
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const PasswordField = ({ placeholder }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        required
        className="w-full p-3 border-2 border-gray-300 rounded-md text-base"
      />
      <span
        className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-500 cursor-pointer"
        onClick={() => setShow(!show)}
      >
        {show ? <FaEyeSlash /> : <FaEye />}
      </span>
    </div>
  );
};

export default PasswordField;
