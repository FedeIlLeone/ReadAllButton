import type React from "react";
import { webpack } from "replugged";

interface SearchBarProps extends Omit<React.ComponentPropsWithoutRef<"div">, "onChange"> {
  "aria-label"?: string;
  autoComplete?: boolean;
  autoFocus?: boolean;
  className?: string;
  disabled?: boolean;
  hideSearchIcon?: boolean;
  iconClassName?: string;
  inputProps?: React.ComponentPropsWithoutRef<"input">;
  isLoading?: boolean;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onChange?: (value: string) => void;
  onClear?: React.MouseEventHandler<HTMLDivElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  onKeyPress?: React.KeyboardEventHandler<HTMLInputElement>;
  onKeyUp?: React.KeyboardEventHandler<HTMLInputElement>;
  placeholder?: string;
  query?: string;
  size?: string;
  style?: React.CSSProperties;
}

export type SearchBarType = React.FC<React.PropsWithChildren<SearchBarProps>> & {
  defaultProps: SearchBarProps;
  Sizes: Record<"SMALL" | "MEDIUM" | "LARGE", string>;
};

export default await webpack.waitForModule<SearchBarType>(
  webpack.filters.bySource(/\.autoComplete.+inputProps/),
);
