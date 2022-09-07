import { Registration, User } from '~/generated/prisma';
import v8n from 'v8n';
import { db } from '~/utils/db.server';

function validateRegistration(data: FormData): { [key: string]: string } {
  const errors: { [key: string]: string } = {};
  if (!v8n().string().minLength(3).maxLength(50).test(data.get('firstName'))) {
    errors.firstName = 'The first name must be at least 3 characters long';
  }
  if (!v8n().string().minLength(3).maxLength(50).test(data.get('lastName'))) {
    errors.lastName = 'The last name must be at least 3 characters long';
  }
  if (
    !v8n()
      .optional(v8n().string().minLength(3).maxLength(50))
      .test(data.get('callBy'))
  ) {
    errors.callBy =
      'If entered, your nickname must be at least 3 characters long';
  }
  if (
    !v8n()
      .string()
      .length(1)
      .pattern(/f|m|d|n/)
      .test(data.get('gender'))
  ) {
    errors.gender = 'Please provide a valid value from the dropdown';
  }
  if (
    !v8n()
      .string()
      .includes('@')
      .minLength(3)
      .maxLength(50)
      .test(data.get('email'))
  ) {
    errors.email = 'Please enter a valid email address';
  }
  if (
    !v8n()
      .string()
      .minLength(3)
      .maxLength(50)
      .pattern(/[+][0-9]+/)
      .test(data.get('phone'))
  ) {
    errors.phone =
      'Please enter a valid phone number in the format +1234567890';
  }
  if (!v8n().string().length(2).test(data.get('country'))) {
    errors.country = 'Please select a country from the dropdown';
  }
  if (!v8n().string().minLength(3).maxLength(50).test(data.get('university'))) {
    errors.university = 'Please enter a valid university name';
  }
  if (
    !v8n()
      .string()
      .length(1)
      .pattern(/l|i|o|e/)
      .test(data.get('status'))
  ) {
    errors.status = 'Please select a valid status from the list';
  }
  if (!v8n().string().test(data.get('diet'))) {
    errors.diet = 'Please provide a valid diet from the list';
  }
  console.log(v8n().string().minLength(3).test(data.get('dinner')));
  console.log(data.get('dinner'));
  if (!v8n().string().minLength(3).test(data.get('dinner'))) {
    errors.dinner = 'Please select your meal for the kickoff dinner';
  }
  if (
    !v8n()
      .string()
      .pattern(/s|m|l|(?:xl)/)
      .test(data.get('size'))
  ) {
    errors.size = 'Please select a valid size from the list';
  }
  if (
    !v8n()
      .string()
      .pattern(/true|false/)
      .test(data.get('oldie'))
  ) {
    errors.oldie = 'Please indicate if you took part before';
  }
  if (
    !v8n().string().minLength(10).maxLength(300).test(data.get('expectations'))
  ) {
    errors.expectations = 'Please type 10 to 300 characters';
  }
  if (!v8n().not.null().test(data.get('pay'))) {
    errors.pay = 'Please accept this statement';
  }
  if (!v8n().not.null().test(data.get('friends'))) {
    errors.friends = 'Please accept this statement';
  }
  if (!v8n().not.null().test(data.get('covid'))) {
    errors.covid = 'Please accept this statement';
  }
  if (!v8n().not.null().test(data.get('vax'))) {
    errors.vax = 'Please confirm this statement';
  }
  return errors;
}

export async function createRegistration(
  data: FormData,
  user: User
): Promise<[{ [key: string]: string }, Registration | null]> {
  const errors = validateRegistration(data);
  if (Object.keys(errors).length > 0) {
    return [errors, null];
  }
  const values = Object.fromEntries(data);
  await db.user.update({
    where: { id: user.id },
    data: {
      firstName: values.firstName.toString(),
      lastName: values.lastName.toString(),
      email: values.email.toString(),
    },
  });
  const existingRegistration = await db.registration.findFirst({
    where: { user: { id: user.id } },
  });
  if (existingRegistration) {
    return [
      {
        form: 'It seems like you have already submitted a registration. Please reach out to us if you think this is an error.',
      },
      null,
    ];
  }
  const registration = await db.registration.create({
    data: {
      user: {
        connect: {
          id: user.id,
        },
      },
      callBy: values.callBy.toString(),
      gender: values.gender.toString(),
      phone: values.phone.toString(),
      country: values.country.toString(),
      university: values.university.toString(),
      status: values.status.toString(),
      diet: values.diet.toString(),
      esnSection: values.esnSection?.toString() ?? null,
      languages: values.languages?.toString() ?? null,
      dinner: values.dinner.toString(),
      size: values.size.toString(),
      oldie: values.oldie.toString() === 'true',
      expectations: values.expectations.toString(),
      requests: values.requests.toString(),
    },
  });
  return [{}, registration];
}
