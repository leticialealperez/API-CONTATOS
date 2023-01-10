export interface Contact {
    id: string;
    name: string;
    phone: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  contacts: Contact[];
}

export interface ResponseAPI {
    success: boolean;
    message: string;
    data: any;
}