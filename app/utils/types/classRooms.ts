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
