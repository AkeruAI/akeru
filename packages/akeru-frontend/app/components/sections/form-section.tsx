"use client";

import { useFormState } from "react-dom";
import { handleSubmit } from "@/app/server";
import Form from "../ui/form/Form";

const initialState = {
  email: "",
};

function FormSection() {
  const [state, formAction] = useFormState(handleSubmit, initialState);
  return (
    <section className="text-center mt-10 md:mt-32">
      <Form formAction={formAction} />
    </section>
  );
}

export default FormSection;
