import { Dispatch, SetStateAction } from "react";
import FormInput from "./FormInput";
import { IoMdClose } from "react-icons/io";

type FormProps = {
  formAction: (payload: FormData) => void;
  setShowForm: Dispatch<SetStateAction<boolean>>;
};

function Form({ formAction, setShowForm }: FormProps) {
  return (
    <form
      className="w-full  px-6 rounded-xl h-fit pb-10 pt-5 flex flex-col gap-2.5"
      action={formAction}
    >
      <span className=" text-center text-opacity-90 sm:text-sm">
        Stay in the loop! Enter your email address to receive an exclusive
        notification when Akeru goes live.
      </span>
      <div className="tablet_max:mt-2 mobile_lg:mt-3.5">
        <FormInput
          type="email"
          name="emailAddress"
          placeholder="Email Address"
          required
        />
      </div>
      <div className="tablet_max:mt-2 mobile_lg:mt-3.5">
        <button className="bg-green-900 w-full py-3 rounded-md duration-200 hover:opacity-80">
          Get Akeru
        </button>
      </div>
    </form>
  );
}

export default Form;
