export interface AuthInfo {
  user: LoggedInUser;
  token: string;
}

export interface LoggedInUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;

  password: string;
  phoneNumber: string;
}
