import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-[60vh] w-full">
      <div className="w-12 h-12 border-4 border-green-500 border-t-transparent border-b-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default Loading;
