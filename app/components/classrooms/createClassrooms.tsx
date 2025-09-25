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
import { CreateClassroomApi } from "@/app/api/classrooms/action";
import CustomDropDown from "../Form/dropdown/customDropDown";
import { useAppContext } from "@/app/context";

const classSchema = z.object({
  academic_year: z.string().min(4, "Academic year is required"),
  year_level: z.string().min(1, "Year level is required"),
  intake: z.string().min(1, "Intake is required"),
  department: z.string().min(2, "Department is required"),
  class_label: z.string().min(1, "Class label is required"),
});

export type CreateClassFormValues = z.infer<typeof classSchema>;

export default function CreateClassForm() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {activeModalId, setActiveModalId } = useAppContext();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateClassFormValues>({
    resolver: zodResolver(classSchema),
  });

  const onSubmit = async (data: CreateClassFormValues) => {

    try {
      const result = await CreateClassroomApi(data);
   
      if (result.success) {
        router.push("/dashboard");
        setActiveModalId(null);
      } else {
        setErrorMessage("Failed to create classroom");
      }
    } catch (error) {
      setErrorMessage("Error creating classroom");
    }
  };

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 7000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  return (
    <div className=" bg-white min-w-[500px]  w-full overflow-y-scroll rounded-md p-4 md:p-8 flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-lg space-y-6"
      >
        <Title
          title="Create Classroom"
          description="Fill out the form below to create a new classroom"
        />

        <InputField
          placeholder="Academic Year (e.g., 2024/2025)"
          type="text"
          registration={register("academic_year")}
          error={errors.academic_year}
          required
        />

        <InputField
          placeholder="Year Level (e.g., Level 2)"
          type="text"
          registration={register("year_level")}
          error={errors.year_level}
          required
        />

        <Controller
          name="intake"
          control={control}
          render={({ field }) => (
            <CustomDropDown
              placeholder="Intake (e.g., September)"
              items={["July", "September", "February", "March"]}
              selected={field.value}
              onChange={field.onChange}
              error={errors.intake}
            />
          )}
        />

        <InputField
          placeholder="Department (e.g., Computer Science)"
          type="text"
          registration={register("department")}
          error={errors.department}
          required
        />

        <InputField
          placeholder="Class Label (e.g., CS202)"
          type="text"
          registration={register("class_label")}
          error={errors.class_label}
          required
        />

        {errorMessage && <ErrorCard errorMessage={errorMessage} />}

        <Button
          title={isSubmitting ? "Creating..." : "Create Classroom"}
          disabled={isSubmitting}
          type="submit"
        />
      </form>
    </div>
  );
}
