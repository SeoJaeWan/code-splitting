import React, { useState } from "react";

const RawSplit = () => {
  const [render, setRender] = useState({ splitMe: null });

  const handleClick = async () => {
    const loadedModule = await import("../../Splitting/SplitMe");
    setRender({ splitMe: loadedModule.default });
    console.log(loadedModule.default);
  };

  return (
    <div>
      <p onClick={handleClick}>Hello!</p>
      {render.splitMe && <render.splitMe />}
    </div>
  );
};

export default RawSplit;
