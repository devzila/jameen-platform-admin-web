import React, { forwardRef } from "react";

const CustomDivToggle = forwardRef((props, ref) => (
  <div
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      if (props.onClick) {
        props.onClick(e);
      }
    }}
  >
    {props.children}
  </div>
));

CustomDivToggle.displayName = "CustomDivToggle";

export default CustomDivToggle;