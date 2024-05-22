'use server'

export type FormState = {
  message: string
  submitted: boolean
}

export const handleWaitlistSubmit = async (
  prevState: FormState,
  formData: FormData,
) => {
  const url = process.env.NEXT_GOOGLE_SHEETS_API!
  let rawFormData = { email: formData.get('email') }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rawFormData),
    })

    if (response.ok) {
      return { message: 'Email address sent successfully!', submitted: true }
    } else {
      console.error(
        'Failed to send email address. Status code:',
        response.status,
      )
    }
  } catch (error) {
    return { message: 'Email address not sent', submitted: false }
  }

  return { message: 'Email address not sent', submitted: false }
}
