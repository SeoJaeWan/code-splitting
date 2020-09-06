import React, { useState } from "react";
import RawSplit from "./View/RawSplit";
import Loadable from "./View/Loadable";

const App = () => {
  return (
    <div>
      <RawSplit />
      <Loadable />
    </div>
  );
};

export default App;
