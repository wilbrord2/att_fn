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
