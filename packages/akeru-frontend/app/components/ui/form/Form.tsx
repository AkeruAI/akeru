import FormInput from "./FormInput";

type FormProps = {
  formAction: (payload: FormData) => void;
};

function Form({ formAction }: FormProps) {
  return (
    <form
      className="border border-white border-opacity-30 backdrop-blur-lg w-full px-6 md:px-16 rounded-xl h-fit flex flex-col gap-4 bg-white max-w-2xl mx-auto py-10 bg-opacity-20 shadow-2xl shadow-green-900"
      action={formAction}
    >
      <span className="text-green-50 text-opacity-80 text-sm md:text-base">
        Stay in the loop! Enter your email address to receive an exclusive
        notification when Akeru goes live.
      </span>
      <FormInput
        type="email"
        name="emailAddress"
        placeholder="Email Address"
        required
      />
      <div className="">
        <button className="bg-gradient-to-b text-sm md:text-base from-green-800 to-green-900 shadow-md w-full py-3 rounded-md duration-200 hover:shadow-lg">
          Get Akeru
        </button>
      </div>
    </form>
  );
}

export default Form;
