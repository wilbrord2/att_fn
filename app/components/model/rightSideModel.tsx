"use client";

import { ReactNode } from "react";
import { IoClose } from "react-icons/io5";
import { useAppContext } from "../../context";

const RightModal = ({
  children,
  id,
}: {
  children: ReactNode;
  id: string | null | undefined;
}) => {
  const { activeModalId, setActiveModalId } = useAppContext();

  const closeModal = () => {
    if (id !== "not-found") {
      setActiveModalId(null);
    }
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className={`${activeModalId ? "block absolute" : "hidden"}`}>
      {activeModalId === id && (
        <div
          className="fixed inset-0 bg-black/50 flex justify-end max-md:items-end items-center z-50"
          onClick={closeModal}
        >
          <div
            className={`bg-white h-screen w-full md:w-2/3 lg:w-1/2 2xl:w-1/3 rounded-l-lg shadow-lg p-4 overflow-y-scroll hide-scrollbar transform transition-all duration-500 ease-out `}
            onClick={handleModalClick}
          >
            <button
              onClick={closeModal}
              className="text-red-500 font-bold px-2 py-2 rounded"
            >
              <IoClose size={20} />
            </button>

            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default RightModal;
