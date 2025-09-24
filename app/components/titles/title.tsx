import React from "react";

type Props = {
  title: string;
  description: string;
};

const Title = ({ title, description }: Props) => {
  return (
    <div className="space-y-2 w-full ">
      <h1 className="text-[#2A2F4E] font-bold text-2xl">{title}</h1>
      <p className="text-[#838AA2] font-medium text-base">{description}</p>
    </div>
  );
};

export default Title;
