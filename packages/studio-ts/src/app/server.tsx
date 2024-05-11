'use server'

import { redirect } from 'next/navigation'

export const handleWaitlistSubmit = async (
  prevState: { message: string; submitted: boolean },
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
      console.log('Email address sent successfully!!!')
      return { message: 'Email address sent successfully!', submitted: true }
    } else {
      console.error(
        'Failed to send email address. Status code:',
        response.status,
      )
    }
  } catch (error) {
    console.error('Error:', error)
    return { message: 'Email address not sent', submitted: false}
  }
  //   redirect('/success')
}
