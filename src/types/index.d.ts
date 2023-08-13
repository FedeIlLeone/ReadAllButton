import type { RawModule } from "replugged/dist/types";

type Comparator<T> = (a: T, b: T) => boolean;

interface GuildsNavProps {
  className: string;
  disableAppDownload?: boolean;
  isOverlay?: boolean;
  themeOverride: string;
}

interface GuildsNavComponent extends RawModule {
  $$typeof: symbol;
  compare: Comparator<unknown>;
  type: (props: GuildsNavProps) => React.ReactElement;
}
