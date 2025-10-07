export interface Review {
  id: number;
  semester: string;
  lecture: string;
  teacher_fullname: string;
  review: string;
  class_period: "before_noon" | "afternoon" | "evening"; 
  start_at: string; 
  end_at: string; 
  created_at: string;
  updated_at: string;
}

export interface ReviewsType {
  message: string;
  reviews: Review[];
}

interface User {
  id: number;
  role: string;
  name: string;
  email: string;
  phone: string;
  is_class_representative: boolean;
}

interface Classroom {
  id: number;
  academic_year: string;
  year_level: string;
  intake: string;
  department: string;
  class_label: string;
  class_status: string;
}

export interface ClassReviewType {
  id: number;
  semester: string;
  lecture: string;
  teacher_fullname: string;
  review: string;
  class_period: string;
  start_at: string;
  end_at: string;
  created_at: string;
  updated_at: string;
  user: User;
  classroom: Classroom;
}


