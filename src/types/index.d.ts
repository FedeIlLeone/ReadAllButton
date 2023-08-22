import type React from "react";

interface GuildsNavProps {
  className: string;
  disableAppDownload?: boolean;
  isOverlay?: boolean;
  themeOverride: string;
}

type GuildsNavComponentType = (props: GuildsNavProps) => React.ReactElement;
export type GuildsNavComponent = React.MemoExoticComponent<GuildsNavComponentType>;
