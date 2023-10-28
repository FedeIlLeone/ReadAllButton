import type React from "react";
import { webpack } from "replugged";

interface ListItemTooltipProps {
  children: React.ReactNode;
  color?: string;
  disabled?: boolean;
  disableWrapper?: boolean;
  forceOpen?: boolean;
  hideOnClick?: boolean;
  selected?: boolean;
  shouldShow?: boolean;
  text: string;
  tooltipClass?: string;
}

export type ListItemTooltipType = React.FC<ListItemTooltipProps>;

export default await webpack.waitForModule<ListItemTooltipType>(
  webpack.filters.bySource(".listItemWrapper"),
);
