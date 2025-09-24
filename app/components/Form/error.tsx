import React from "react";

const ErrorCard = ({ errorMessage }: { errorMessage: string }) => {
  return (
    <p className="text-[#B54708] font-medium px-4 py-3 bg-[#FFFAEB] rounded-lg  text-xs text-center">
      {errorMessage}
    </p>
  );
};

export default ErrorCard;
