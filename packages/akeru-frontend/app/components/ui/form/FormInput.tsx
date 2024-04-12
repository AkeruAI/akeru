import { InputHTMLAttributes } from "react";

type FormInputProps = InputHTMLAttributes<HTMLInputElement> & {
  type?: string;
  name: string;
  value?: string;
  handleInputChange: (name: string, value: string) => void;
};

function FormInput({
  type,
  name,
  value,
  handleInputChange,
  ...rest
}: FormInputProps) {
  return (
    <div className="text-[#ffffff] bg-[#32323C] text-[14px] p-[8px]  w-full h-full tablet_max:text-[13px]">
      <input
        type={type}
        name={name}
        className="bg-transparent border-none outline-none w-full h-full"
        value={value}
        onChange={(e) => handleInputChange(name, e.target.value)}
        {...rest}
      />
    </div>
  );
}

export default FormInput;
