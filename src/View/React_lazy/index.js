import React, { useState, Suspense } from "react";

const SplitMe = React.lazy(() => import("../../Splitting/SplitMe"));

const React_lazy = () => {
  const [visible, setVisible] = useState(false);
  const onClick = () => {
    setVisible(true);
  };
  return (
    <div>
      <p onClick={onClick}>Hello!</p>
      {visible && (
        <Suspense fallback={<div>loading...</div>}>
          {visible && <SplitMe />}
        </Suspense>
      )}
    </div>
  );
};

export default React_lazy;
