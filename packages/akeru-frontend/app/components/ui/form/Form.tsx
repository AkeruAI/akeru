"use client";

import { useState } from "react";
import FormInput from "./FormInput";

function Form() {
  const [, setInputValues] = useState({
    emailAddress: "",
  });

  const handleInputChange = (name: string, value: string) => {
    setInputValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <form className="w-[100%]">
      <div className="mt-[10px] tablet_max:mt-[8px] mobile_lg:mt-[15px]">
        <FormInput
          type="email"
          name="emailAddress"
          placeholder="Email Address"
          handleInputChange={handleInputChange}
          required
        />
      </div>
      <div className="mt-[10px] tablet_max:mt-[8px] mobile_lg:mt-[15px]">
        <button className="border border-solid border-white w-[100%] py-[4px] text-[14px] text-white transition-opacity duration-500 hover:opacity-60">
          GET AKERU
        </button>
      </div>
    </form>
  );
}

export default Form;
