import type React from "react";

interface GuildsNavProps {
  className?: string;
  disableAppDownload?: boolean;
  isOverlay?: boolean;
  isVisible?: boolean;
  themeOverride?: string;
}

type GuildsNavType = (props: GuildsNavProps) => React.ReactElement;
export type MemoGuildsNavType = React.MemoExoticComponent<GuildsNavType>;
