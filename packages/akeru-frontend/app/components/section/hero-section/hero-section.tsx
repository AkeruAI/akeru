"use client";
import { useCallback, useState } from "react";
import Form from "../../ui/form/Form";

function HeroSection() {
  const [showForm, setShowForm] = useState(false);

  const handleWaitlistForm = useCallback(() => {
    setShowForm(true);
  }, []);

  return (
    <section className="w-[45%] text-center lg:w-[60%] air:w-[70%] md:w-[80%] sm:w-[90%]">
      <div>
        <h2 className="font-montserrat font-[700] text-[50px] capitalize leading-[65px] sm:text-[40px] sm:leading-[50px]">
          The best API to setup your AI Project{" "}
        </h2>
        <p className="font-montserrat mt-[12px] text-[#F5FFF5] text-[16px] font-[500] opacity-70 sm:text-[14px]">
          Lorem ipsum dolor sit amet consectetur. Turpis pellentesque praesent
          mattis a nisl augue. Ipsum nullam at facilisis tortor. Feugiat{" "}
        </p>
      </div>

      {showForm === false && (
        <div className="mt-[20px] ">
          <button
            onClick={handleWaitlistForm}
            className="font-montserrat text-[14px] bg-[#074707] py-[9px] w-[25%] rounded-[5px] font-[500] hover:bg-[#65ef65] hover:text-black transition-transform duration-500 sm:w-[100%]"
          >
            Try Akeru
          </button>
        </div>
      )}

      {showForm && (
        <div className="w-[100%] mt-[20px]">
          <Form />
        </div>
      )}
    </section>
  );
}

export default HeroSection;
