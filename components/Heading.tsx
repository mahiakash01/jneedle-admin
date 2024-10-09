import React from "react";

const Heading = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <>
      <h2 className="text-3xl font-bold">{title}</h2>
      <p className="text-sm text-black/50">{description}</p>
    </>
  );
};

export default Heading;
