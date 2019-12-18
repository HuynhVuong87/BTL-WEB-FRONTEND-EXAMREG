interface StudentOfCourse {
  mssv: string;
  active: boolean;
  ho: string;
  ten: string;
}

export interface Course {
  id: string;
  course_name: string;
  course_code: string;
  course_teacher: string;
  course_of: string;
  students: Array<StudentOfCourse>;
}

export interface CourseForSession {
  course_name: string;
  course_code: string;
  id: string;
  sessions?: Session;
}

export interface Session {
  name?: string;
  date?: any;
  timeFrom?: number;
  time?: number;
  room?: {
    seat: number;
    students: string[];
  }[];
}
