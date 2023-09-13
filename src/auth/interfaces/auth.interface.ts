/* eslint-disable prettier/prettier */
export interface SignUpParams {
  email: string;
  password: string;
  username: string;
  phone_number: string;
  address: string;
}

export interface SignInParams {
  email: string;
  password: string;
}
