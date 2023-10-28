import type React from "react";
import { webpack } from "replugged";

interface DoubleCheckmarkProps extends React.ComponentPropsWithoutRef<"svg"> {
  foreground?: string;
}

export type DoubleCheckmarkType = React.FC<DoubleCheckmarkProps>;

export default await webpack.waitForModule<DoubleCheckmarkType>(
  webpack.filters.bySource("66668ZM14"),
);
