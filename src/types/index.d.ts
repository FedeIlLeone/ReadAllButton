import type { Channel } from "discord-types/general";
import type { RawModule } from "replugged/dist/types";

interface Settings {
  askConfirm?: boolean;
  markChannels?: boolean;
  markDMs?: boolean;
  markGuildEvents?: boolean;
  roundButton?: boolean;
  text?: boolean;
  toasts?: boolean;
}

type Comparator<T> = (a: T, b: T) => boolean;
type Predicate<Arg> = (arg: Arg) => boolean;

interface ThreadChannel {
  id: string;
  parentId: string;
}

interface ActiveThreadsStore {
  getThreadsForGuild: (id: string) => Record<string, Record<string, ThreadChannel>>;
}

interface GuildChannelStore {
  getChannels: (id: string) => {
    count: number;
    id: string;
    SELECTABLE: Array<{ channel: Channel; comparator: number }>;
    VOCAL: Array<{ channel: Channel; comparator: number }>;
  };
}

interface ReadStateStore {
  hasUnread: (id: string) => boolean;
  lastMessageId: (id: string, event: number) => string;
}

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

interface GuildsNavComponent extends RawModule {
  $$typeof: symbol;
  compare: Comparator<unknown>;
  type: (props: GuildsNavProps) => React.ReactElement;
}

interface GuildsNavProps {
  className: string;
  themeOverride: string;
}
