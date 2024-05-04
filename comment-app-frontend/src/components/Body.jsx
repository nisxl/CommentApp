import React from "react";
import Comments from "./Comments";

function Body() {
  return (
    <div className="flex flex-col items-center">
      <h1 className="font-bold text-5xl my-10">Nischal's Comment Section</h1>
      <Comments />
    </div>
  );
}

export default Body;
