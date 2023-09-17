import type React from "react";

interface DoubleCheckmarkProps {
  color?: string;
  foreground?: string;
  height?: number;
  width?: number;
}

export default (props: DoubleCheckmarkProps): React.ReactElement => {
  const { color = "currentColor", foreground, height = 16, width = 16 } = props;

  return (
    <svg aria-hidden role="img" width={width} height={height} viewBox="0 0 16 16" fill="none">
      <path
        d="M12 4.66668L11.06 3.72668L6.83332 7.95335L7.77332 8.89335L12 4.66668ZM14.8266 3.72668L7.77332 10.78L4.98665 8.00002L4.04665 8.94002L7.77332 12.6667L15.7733 4.66668L14.8266 3.72668ZM0.273315 8.94002L3.99998 12.6667L4.93998 11.7267L1.21998 8.00002L0.273315 8.94002Z"
        fill={color}
        className={foreground}
      />
    </svg>
  );
};
