"use client";
import { useCallback, useState } from "react";
import Form from "../../ui/form/Form";

function HeroSection() {
  const [showForm, setShowForm] = useState(false);

  const handleWaitlistForm = useCallback(() => {
    setShowForm(true);
  }, []);

  return (
    <section className="w-2/4 text-center lg:w-3/5 air:w-4/6 md:w-4/5 sm:w-[95%]">
      <div>
        <h2 className="font-montserrat font-bold text-5xl capitalize m:text-4xl ">
          The best API to setup your AI Project{" "}
        </h2>
        <p className="font-montserrat mt-3 text-[#F5FFF5] text-base font-medium opacity-70 sm:text-sm">
          Lorem ipsum dolor sit amet consectetur. Turpis pellentesque praesent
          mattis a nisl augue. Ipsum nullam at facilisis tortor. Feugiat{" "}
        </p>
      </div>

      {showForm === false && (
        <div className="mt-5">
          <button
            onClick={handleWaitlistForm}
            className="font-montserrat text-sm bg-[#074707] py-2 w-3/12 rounded font-medium hover:bg-[#65ef65] hover:text-black transition-transform duration-500 sm:w-full"
          >
            Try Akeru
          </button>
        </div>
      )}

      {showForm && (
        <div className="w-full mt-5">
          <Form />
        </div>
      )}
    </section>
  );
}

export default HeroSection;
