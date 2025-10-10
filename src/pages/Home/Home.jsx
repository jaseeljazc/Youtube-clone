import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Feed from "../../components/Feed";

const Home = ({ sidebar }) => {
  const[category, setCategory] = useState(0);
  return (
    <>
      <Sidebar
        sidebar={sidebar}
        category={category}
        setCategory={setCategory}
      />
      <div
        className={`${
          sidebar ? "sm:ml-54" : "sm:ml-20"
        } transition-[margin] duration-300 ease-in-out p-2 sm:p-4`}
      >
        <Feed category={category} />
      </div>
    </>
  );
};

export default Home;
