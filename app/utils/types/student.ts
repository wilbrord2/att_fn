export interface Student {
  id: number;
  role: "student" | "admin";
  name: string;
  email: string;
  phone: string;
  is_class_representative: boolean;
}

export interface StudentType {
  message: string;
  students: Student[];
}
