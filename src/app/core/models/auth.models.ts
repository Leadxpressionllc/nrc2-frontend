import { User } from './user.models';

export interface AuthInfo {
  user: User;
  sourceInfo: UserSourceInfo;
  token: string;
}

export interface UserSourceInfo {
  id: string;
  trafficType: string;
  sourceId?: string;
  subSource1?: string;
  subSource2?: string;
  subSource3?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
  gender: string;
  phone: string;
  streetAddress: string;
  zipCode: string;

  jornayaId: string;
  sourceInfo?: SignupSourceInfo;
}

export interface SignupSourceInfo {
  sid: string;
  subid1: string;
  subid2: string;
  subid3: string;
  subid4: string;
}
