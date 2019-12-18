export class UserSignUp {
  username: string;
  email: string;
  password: string;
  fullName: string;
  mssv: string;
}

export class UserProfile {
  // tslint:disable-next-line: variable-name
  uid: string;
  username?: string;
  email?: string;
  lastSign?: number;
  signed?: boolean;
  ctime?: number;
  displayName: string;
  role?: number;
  roleName?: string;
}


