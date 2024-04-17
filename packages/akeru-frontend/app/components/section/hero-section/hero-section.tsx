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
    <section className="w-2/4 text-center lg:w-3/5 air:w-4/6 md:w-4/5 sm:w-[95%]">
      <div>
        <h2 className="font-montserrat font-bold text-5xl capitalize m:text-4xl ">
          The best API to setup your AI Project{" "}
        </h2>
        <p className="font-montserrat mt-3  text-base font-medium opacity-70 sm:text-sm">
          Lorem ipsum dolor sit amet consectetur. Turpis pellentesque praesent mattis a nisl augue. Ipsum
          nullam at facilisis tortor. Feugiat{" "}
        </p>
      </div>
      <button
        onClick={handleWaitlistForm}
        className="mt-5 w-full max-w-xs font-montserrat text-sm lg:bg-green-900 bg-green-950 py-3 rounded font-medium hover:bg-green-600 shadow-green-950 shadow-md hover:shadow-green-950 hover:shadow-xl duration-200 sm:w-full">
        Try Akeru
      </button>

      {showForm && (
        <div className="fixed top-0 z-10 h-screen bg-black w-full left-0 flex items-center justify-center bg-opacity-20 backdrop-blur-sm">
          <Form formAction={formAction} setShowForm={setShowForm} />
        </div>
      )}
    </section>
  );
}

export default HeroSection;
