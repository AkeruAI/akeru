"use client";
import { useCallback, useState } from "react";
import Form from "../../ui/form/Form";
import { useFormState } from "react-dom";
import { handleSubmit } from "@/app/server";

const initialState = {
  email: "",
};

function HeroSection() {
  const [showForm, setShowForm] = useState(false);
  const [state, formAction] = useFormState(handleSubmit, initialState);

  const handleWaitlistForm = useCallback(() => {
    setShowForm(true);
  }, []);

  return (
    <section className="w-2/4 text-center lg:w-3/5 air:w-4/6 md:w-4/5 sm:w-full">
      <div>
        <h2 className="font-montserrat font-bold text-5xl capitalize m:text-4xl sm:text-4xl ">
          The best API to setup your AI Project{" "}
        </h2>
        <p className="font-montserrat mt-3  text-base font-medium opacity-70 sm:text-sm">
          Lorem ipsum dolor sit amet consectetur. Turpis pellentesque praesent
          mattis a nisl augue. Ipsum nullam at facilisis tortor. Feugiat{" "}
        </p>
      </div>

      <div className="mt-5">
        <Form formAction={formAction} setShowForm={setShowForm} />
      </div>
    </section>
  );
}

export default HeroSection;
