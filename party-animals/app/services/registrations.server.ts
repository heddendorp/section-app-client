import { PrismaClient, Registration } from '~/generated/prisma';
import v8n from 'v8n';

const prisma = new PrismaClient();

export async function createRegistration(
  data: FormData
): Promise<[{ [key: string]: string }, Registration | null]> {
  const errors: { [key: string]: string } = {};
  if (!v8n().string().minLength(3).maxLength(50).test(data.get('firstName'))) {
    errors.firstName = 'The first name must be at least 3 characters long';
  }
  if (!v8n().string().minLength(3).maxLength(50).test(data.get('lastName'))) {
    errors.lastName = 'The last name must be at least 3 characters long';
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
      .not.includes('@')
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
  if (
    !v8n()
      .string()
      .length(1)
      .pattern(/s|m|l|xl/)
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
  if (
    !v8n()
      .optional(v8n().string().minLength(10).maxLength(300))
      .test(data.get('requests'))
  ) {
    errors.requests = 'Please type 10 to 300 characters';
  }
  if (!v8n().string().equal('on').test(data.get('pay'))) {
    errors.pay = 'Please accept this statement';
  }
  if (!v8n().string().equal('on').test(data.get('friends'))) {
    errors.friends = 'Please accept this statement';
  }
  if (Object.keys(errors).length > 0) {
    return [errors, null];
  }
  return [{}, null];
}
