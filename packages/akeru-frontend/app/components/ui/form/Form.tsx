import { useCallback, useState } from "react";
import FormInput from "./FormInput";
import { handleSubmit } from "@/app/server";

type FormProps = {
  formAction: (payload: FormData) => void;
};

function Form({ formAction}: FormProps) {
  return (
    <form className="w-full" action={formAction}>
      <div className="mt-2.5 tablet_max:mt-2 mobile_lg:mt-3.5">
        <FormInput
          type="email"
          name="emailAddress"
          placeholder="Email Address"
          required
        />
      </div>
      <div className="mt-2.5 tablet_max:mt-2 mobile_lg:mt-3.5">
        <button className="border border-solid border-white w-full py-1 text-sm text-white transition-opacity duration-500 hover:opacity-60">
          GET AKERU
        </button>
      </div>
    </form>
  );
}

export default Form;
