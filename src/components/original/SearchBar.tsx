import type React from "react";
import { webpack } from "replugged";

const { filters, waitForModule } = webpack;

interface SearchBarProps {
  autoComplete?: boolean;
  autoFocus?: boolean;
  className?: string;
  disabled?: boolean;
  iconClassName?: string;
  isLoading?: boolean;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onChange?: (value: string) => void;
  onClear?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  query?: string;
  size?: string;
  style?: React.CSSProperties;
}

export type SearchBarType = React.FC<React.PropsWithChildren<SearchBarProps>> & {
  defaultProps: SearchBarProps;
  Sizes: Record<"SMALL" | "MEDIUM" | "LARGE", string>;
};

export default (await waitForModule(
  filters.bySource(/\.autoComplete.+inputProps/),
)) as SearchBarType;
