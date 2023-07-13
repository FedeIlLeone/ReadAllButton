import type { SnapshotStore } from "@types";
import { webpack } from "replugged";

interface GuildReadState {
  mentionCount: number;
  mentionCounts: Record<string, number>;
  ncMentionCount: number;
  sentinel: number;
  unread: boolean;
  unreadByType: Record<number, boolean>;
  unreadChannelId: string | null;
}

interface Snapshot {
  data: { guilds: Record<string, GuildReadState>; unreadGuilds: string[] };
  version: number;
}

export interface GuildReadStateStore extends SnapshotStore<Snapshot> {
  getGuildChangeSentinel: (guildId: string) => number;
  getGuildHasUnreadIgnoreMuted: (guildId: string) => boolean;
  getMentionCount: (guildId: string) => number;
  getMentionCountForChannels: (guildId: string, channelIds: string[]) => void;
  getMutableGuildReadState: (guildId: string) => GuildReadState;
  getMutableGuildStates: () => Record<string, GuildReadState>;
  getMutableUnreadGuilds: () => Set<string>;
  getPrivateChannelMentionCount: () => number;
  getStoreChangeSentinel: () => number;
  getTotalMentionCount: (guildId: string) => number;
  getTotalNotificationsMentionCount: (guildId: string) => number;
  hasAnyUnread: () => boolean;
  hasUnread: (guildId: string) => boolean;
  loadCache: () => void;
  takeSnapshot: () => Snapshot;
}

export default webpack.getByStoreName<GuildReadStateStore>("GuildReadStateStore")!;
