"use client";

import { useState } from "react";
import FormInput from "./FormInput";

function Form() {
  const [emailAddress, setEmailAddress] = useState("");

  const handleInputChange = (value: string) => {
    setEmailAddress(value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const url =
      "https://sheet.best/api/sheets/6b8ad6e3-f87c-4649-b435-ef5a1051f4b3";
    const data = { email: emailAddress };

    console.log(data);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log("Email address sent successfully!");
      } else {
        console.error(
          "Failed to send email address. Status code:",
          response.status
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <div className="mt-2.5 tablet_max:mt-2 mobile_lg:mt-3.5">
        <FormInput
          type="email"
          name="emailAddress"
          placeholder="Email Address"
          handleInputChange={handleInputChange}
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
