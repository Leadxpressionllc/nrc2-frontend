export interface SignupFlow {
  id?: string;
  name?: string;
  createdOn?: string;
  heading: string;
  paragraph: string;
  backgroundImageUrl: string;
  formFields: SignupFormField[];
}

export interface SignupFormField {
  id?: string;
  label: string;
  name: string;
}
