import React, { ReactNode } from "react";
import SideBarNav from "./components/sidenavbar";
import Mainnavbar from "./components/navbar";

const AdminDashboardTemplate = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative p-4 space-y-5 bg-[#fbfbf9] ">
      {" "}
      <Mainnavbar />
      <main className="flex items-start gap-8 h-[85vh] overflow-hidden">
        <SideBarNav />
        <div className="h-full w-full overflow-y-scroll no-scrollbar rounded-t-2xl bg-white px-4 py-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardTemplate;
