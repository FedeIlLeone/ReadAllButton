import type { RawModule } from "replugged/dist/types";

interface Settings {
  askConfirm?: boolean;
  blacklist?: string[];
  markChannels?: boolean;
  markDMs?: boolean;
  markGuildEvents?: boolean;
  roundButton?: boolean;
  text?: boolean;
  toasts?: boolean;
}

type Comparator<T> = (a: T, b: T) => boolean;
type Predicate<Arg> = (arg: Arg) => boolean;

interface GuildClasses extends RawModule {
  activityPanel: string;
  base: string;
  container: string;
  content: string;
  downloadProgressCircle: string;
  fullWidth: string;
  guilds: string;
  hasNotice: string;
  hidden: string;
  panels: string;
  sidebar: string;
}

interface GuildsNavProps {
  className: string;
  themeOverride: string;
}

interface GuildsNavComponent extends RawModule {
  $$typeof: symbol;
  compare: Comparator<unknown>;
  type: (props: GuildsNavProps) => React.ReactElement;
}
