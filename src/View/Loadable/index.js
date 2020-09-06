import React, { useState, Suspense } from "react";

import loadable from "@loadable/component";

const SplitMe = loadable(() => import("../../Splitting/SplitMe"), {
  fallback: <div>loading ...</div>,
});

const onMouseOver = () => {
  SplitMe.preload();
};

const Loadable = () => {
  const [visible, setVisible] = useState(false);
  const onClick = () => {
    setVisible(true);
  };
  return (
    <div>
      <p onClick={onClick} onMouseOver={onMouseOver}>
        Hello!
      </p>
      {visible && (
        <Suspense fallback={<div>loading...</div>}>
          {visible && <SplitMe />}
        </Suspense>
      )}
    </div>
  );
};

export default Loadable;
