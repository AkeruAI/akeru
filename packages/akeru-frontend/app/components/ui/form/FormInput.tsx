import { InputHTMLAttributes } from "react";

type FormInputProps = InputHTMLAttributes<HTMLInputElement> & {
  type?: string;
  name: string;
  value?: string;
};

function FormInput({
  type,
  name,
  value,

  ...rest
}: FormInputProps) {
  return (
    <div className="text-green-950 border bg-gray-50 rounded-md text-lg py-2 px-4 w-full h-full sm:text-sm">
      <input
        type={type}
        name={name}
        className="bg-transparent placeholder:text-gray-300 border-none outline-none w-full h-full"
        value={value}
        {...rest}
      />
    </div>
  );
}

export default FormInput;
