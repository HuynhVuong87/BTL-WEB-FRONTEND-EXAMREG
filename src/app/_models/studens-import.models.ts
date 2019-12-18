export interface StudentsImport {
  username: string;
  email: string;
  password: string;
  fullName: string;
  gender: number;
  homeTown: string;
  mssv: string;
  birthday: string;
  cmnd: string;
}

export interface StudentForCourse {
  fullName: string;
  mssv: string;
  active: boolean;
}
