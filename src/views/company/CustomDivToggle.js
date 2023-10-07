import { forwardRef } from "react";

type CustomToggleProps = {
  children?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

const CustomDivToggle = forwardRef(
  (props: CustomToggleProps, ref: React.Ref<HTMLDivElement>) => (
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
  )
);

CustomDivToggle.displayName = "CustomDivToggle"; // fix for ESlint, see https://stackoverflow.com/questions/67992894/component-definition-is-missing-display-name-for-forwardref

export default CustomDivToggle;