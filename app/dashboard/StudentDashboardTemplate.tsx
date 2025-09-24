import React, { ReactNode } from "react";
import Mainnavbar from "../admin/components/navbar";

const StudentDashboardTemplate = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative p-4 space-y-4 bg-[#b4b453] ">
      {" "}
      <Mainnavbar />
      <main className="flex items-start gap-8 h-[85vh] overflow-hidden">
        <div className="h-full w-full overflow-y-scroll no-scrollbar rounded-2xl bg-white p-4">
          {children}
        </div>
      </main>
    </div>
  );
};

export default StudentDashboardTemplate;
