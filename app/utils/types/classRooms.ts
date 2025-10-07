export type Classroom = {
  id: number;
  academic_year: string;
  year_level: string;
  intake: string;
  department: string;
  class_label: string;
  class_status: string;
  created_at: string; 
  updated_at: string; 
};

export type ClassroomType = {
  message: string;
  classrooms: Classroom[];
};

export interface ClassroomsWithRepType {
  message: string;
  classrooms: ClassroomWithRep[];
}

export interface ClassroomWithRep {
  id: number;
  academic_year: string;
  year_level: string;
  intake: string;
  department: string;
  class_label: string;
  class_status: string;
  created_at: string;
  user: ClassRepresentative;
}

export interface ClassRepresentative {
  id: number;
  role: string;
  name: string;
  email: string;
  phone: string;
  is_class_representative: boolean;
}
