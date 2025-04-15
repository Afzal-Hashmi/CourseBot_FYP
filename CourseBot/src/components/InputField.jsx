// src/components/InputField.jsx
const InputField = ({ type, placeholder, required = true }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      required={required}
      className="w-full p-3 border-2 border-gray-300 rounded-md text-base"
    />
  );
};

export default InputField;
