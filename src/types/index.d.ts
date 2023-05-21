import type { RawModule } from "replugged/dist/types";

interface Settings {
  askConfirm?: boolean;
  blacklist?: string[];
  markChannels?: boolean;
  markDMs?: boolean;
  markGuildEvents?: boolean;
  markOnboardingQuestions?: boolean;
  roundButton?: boolean;
  text?: boolean;
  toasts?: boolean;
}

type Comparator<T> = (a: T, b: T) => boolean;
type Predicate<Arg> = (arg: Arg) => boolean;

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
