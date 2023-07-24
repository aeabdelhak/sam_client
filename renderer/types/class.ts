export interface Class {
    id: string;
    label: string;
    students?: (StudentsEntity)[] | null;
  }
  export interface StudentsEntity {
    id: string;
    firstName: string;
    lastName: string;
    gardienId: string;
    classId: string;
    fileId: string;
    Gardien: Gardien;
    Attendece?: (AttendeceEntity | null)[] | null;
    image: Image;
  }
  export interface Gardien {
    id: string;
    cardId: string;
    phoneNumber: string;
    name: string;
  }
  export interface AttendeceEntity {
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
  