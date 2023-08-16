export interface Class {
    id: string;
    label: string;
    Students?: (StudentsEntity)[] | null;
  }
  export interface StudentsEntity {
    id: string;
    firstName: string;
    lastName: string;
    guardianId: string;
    classId: string;
    fileId: string;
    guardian: guardian;
    Attendances:AttendanceEntity[]
    Attendece?: (AttendanceEntity | null)[] | null;
    Image: Image;
  }
  export interface guardian {
    id: string;
    cardId: string;
    phoneNumber: string;
    name: string;
  }
  export interface AttendanceEntity {
    id: string;
    access_date: Date;
    dismission_date: Date;
    studentId: string;
  }
  export interface Image {
    id: string;
    path: string;
    name: string;
    type: string;
    url:string
  }
  