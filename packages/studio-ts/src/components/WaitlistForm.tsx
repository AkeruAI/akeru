'use client'
import { handleWaitlistSubmit } from '@/app/server'
import { useFormState, useFormStatus } from 'react-dom'

const initialState = {
  message: '',
  submitted: false,
}

function ArrowIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 16 6" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 3 10 .5v2H0v1h10v2L16 3Z"
      />
    </svg>
  )
}

function CheckMarkIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
      aria-hidden="true"
      {...props}
      viewBox="0 0 24 24"
    >
      <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
    </svg>
  )
}

export function WaitlistForm() {
  const [state, formAction] = useFormState(handleWaitlistSubmit, initialState)

  console.log(state?.submitted)

  return (
    <form className="max-w-sm" action={formAction}>
      <div className="relative mt-6">
        <input
          type="email"
          placeholder="Email address"
          autoComplete="email"
          required
          name={'email'}
          aria-label="Email address"
          className="block w-full rounded-2xl border border-neutral-300 bg-transparent py-4 pl-6 pr-20 text-base/6 text-neutral-950 ring-4 ring-transparent transition placeholder:text-neutral-500 focus:border-neutral-950 focus:outline-none focus:ring-neutral-950/5"
        />
        <div className="absolute inset-y-1 right-1 flex justify-end">
          <FormIconDisplay submitted={state?.submitted} />
        </div>
      </div>
    </form>
  )
}

function FormIconDisplay({ submitted }: { submitted: boolean | undefined }) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      aria-label="Submit"
      disabled={pending}
      className="flex aspect-square h-full items-center justify-center rounded-xl bg-neutral-950 text-white transition hover:bg-neutral-800"
    >
      {submitted ? (
        <CheckMarkIcon className="w-4" />
      ) : (
        <ArrowIcon className="w-4" />
      )}
    </button>
  )
}
