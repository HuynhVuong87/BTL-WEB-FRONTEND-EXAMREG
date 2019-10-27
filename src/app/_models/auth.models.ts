export class UserSignUp {
  username: string;
  email: string;
  password: string;
  fullName: string;
  mssv: string;
}

export class UserProfile {
  // tslint:disable-next-line: variable-name
  _id?: string;
  username?: string;
  email?: string;
  lastSign?: number;
  signed: boolean;
  ctime?: number;
  role?: string;
}


