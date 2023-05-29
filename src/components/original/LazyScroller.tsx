import type React from "react";
import { webpack } from "replugged";

interface SectionData {
  sectionIndex: number;
  sectionRowIndex: number;
}

interface LazyScrollerProps {
  className?: string;
  fade?: boolean;
  hideScrollbar?: boolean;
  initialScrollTop?: number;
  listHeaderHeight?: number | (() => number);
  listPadding?: number[];
  onResize?: (size: { width: number; height: number }) => void;
  onScroll?: (position: number) => void;
  renderListHeader?: () => React.ReactElement;
  renderRow: (index: number, section: SectionData) => React.ReactElement;
  renderSection?: (index: number, elements: React.ReactElement[]) => React.ReactElement;
  renderSectionFooter?: (index: number) => React.ReactElement;
  renderSectionHeader?: (index: number) => React.ReactElement;
  role?: string;
  rowCount: number;
  rowCountBySection?: number[];
  rowHeight: number | ((index: number, section: SectionData) => number);
  sectionFooterHeight?: number | ((index: number) => number);
  sectionHeaderHeight?: number | ((index: number) => number);
  sectionMarginBottom?: number | ((index: number) => number);
  stickyHeaders?: boolean;
}

export type LazyScrollerType = React.ForwardRefExoticComponent<LazyScrollerProps> & {
  render: React.ForwardRefRenderFunction<unknown, LazyScrollerProps>;
};

export default (await webpack.waitForModule(
  webpack.filters.bySource(".stickyHeaders"),
)) as LazyScrollerType;
