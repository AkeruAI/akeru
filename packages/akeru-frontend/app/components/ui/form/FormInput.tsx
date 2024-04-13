import { InputHTMLAttributes } from "react";

type FormInputProps = InputHTMLAttributes<HTMLInputElement> & {
  type?: string;
  name: string;
  value?: string;
  handleInputChange: (value: string) => void;
};

function FormInput({
  type,
  name,
  value,
  handleInputChange,
  ...rest
}: FormInputProps) {
  return (
<div className="text-white bg-gray-800 text-lg py-2 px-4 w-full h-full sm:text-sm">

      <input
        type={type}
        name={name}
        className="bg-transparent border-none outline-none w-full h-full"
        value={value}
        onChange={(e) => handleInputChange(e.target.value)}
        {...rest}
      />
    </div>
  );
}

export default FormInput;
