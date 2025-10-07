"use client";

import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Title from "../titles/title";
import InputField from "../Form/InputField";
import ErrorCard from "../Form/error";
import Button from "../Button/greenButton";
import CustomDropDown from "../Form/dropdown/customDropDown";
import { CreateReviewApi } from "@/app/api/reviewsApi/action";
import { useAppContext } from "@/app/context";

// Schema
const reviewSchema = z.object({
  semester: z.string().min(1, "Semester is required"),
  lecture: z.string().min(2, "Lecture is required"),
  teacher_fullname: z.string().min(3, "Teacher name is required"),
  review: z.string().min(5, "Review must be at least 5 characters"),
  class_period: z.string().min(3, "Class period is required"),
  start_at: z.string().regex(/^\d{2}:\d{2}$/, "Start time must be in HH:mm"),
  end_at: z.string().regex(/^\d{2}:\d{2}$/, "End time must be in HH:mm"),
});

export type CreateReviewFormValues = z.infer<typeof reviewSchema>;

export default function CreateReviewForm({ classId }: { classId?: number }) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { setActiveModalId } = useAppContext();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateReviewFormValues>({
    resolver: zodResolver(reviewSchema),
  });

  const onSubmit = async (data: CreateReviewFormValues) => {
    try {
      const result = await CreateReviewApi(data, classId);

      if (result.success) {
        setActiveModalId(null);
        router.refresh();
      } else {
        setErrorMessage(result.error?.message || "Failed to create review");
      }
    } catch (error) {
      setErrorMessage("Error creating review");
    }
  };

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 7000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  return (
    <div className="bg-white w-full max-w-2xl min-w-[400px] sm:min-w-[500px] rounded-md p-4 md:p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        <Title
          title="Create Review"
          description="Share feedback about your class session"
        />

        <InputField
          placeholder="Semester (e.g., 1)"
          type="text"
          registration={register("semester")}
          error={errors.semester}
          required
        />

        <InputField
          placeholder="Course (e.g., Computer Science)"
          type="text"
          registration={register("lecture")}
          error={errors.lecture}
          required
        />

        <InputField
          placeholder="Teacher Fullname (e.g., Dr John Doe)"
          type="text"
          registration={register("teacher_fullname")}
          error={errors.teacher_fullname}
          required
        />

        <Controller
          name="class_period"
          control={control}
          render={({ field }) => (
            <CustomDropDown
              placeholder="Class Period"
              items={["before_noon", "after_noon", "evening"]}
              selected={field.value}
              onChange={field.onChange}
              error={errors.class_period}
            />
          )}
        />
        <>
          <h1 className="text-sm text-gray-500 font-semibold">
            Specify the start and end time of the class.
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              placeholder="Start Time (HH:mm)"
              type="time"
              registration={register("start_at")}
              error={errors.start_at}
              required
            />
            <InputField
              placeholder="End Time (HH:mm)"
              type="time"
              registration={register("end_at")}
              error={errors.end_at}
              required
            />
          </div>
        </>

        <InputField
          placeholder="Your Feedback"
          type="text"
          registration={register("review")}
          error={errors.review}
          required
        />

        {errorMessage && <ErrorCard errorMessage={errorMessage} />}

        <Button
          title={isSubmitting ? "Submitting..." : "Submit Review"}
          disabled={isSubmitting}
          type="submit"
        />
      </form>
    </div>
  );
}
