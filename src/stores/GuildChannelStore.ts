import type { Channel } from "discord-types/general";
import { webpack } from "replugged";
import type { Store } from "replugged/dist/renderer/modules/common/flux";

interface ChannelListItem {
  channel: Channel;
  comparator: number;
}

interface ChannelList {
  ["4"]: ChannelListItem[];
  count: number;
  id: string;
  SELECTABLE: ChannelListItem[];
  VOCAL: ChannelListItem[];
}

export interface GuildChannelStore extends Store {
  getAllGuilds: () => Record<string, ChannelList>;
  getChannels: (guildId: string) => ChannelList;
  getDefaultChannel: (guildId: string) => Channel | null;
  getDirectoryChannelIds: (guildId: string) => string[];
  getSelectableChannelIds: (guildId: string) => string[];
  getSelectableChannels: (guildId: string) => ChannelListItem[];
  getTextChannelNameDisambiguations: (
    guildId: string,
  ) => Record<string, Extract<Channel, "id" | "name">>;
  getVocalChannelIds: (guildId: string) => string[];
  hasCategories: (guildId: string) => boolean;
  hasChannels: (guildId: string) => boolean;
  hasElevatedPermissions: (guildId: string) => boolean;
  hasSelectableChannel: (guildId: string, channelId: string) => boolean;
}

export default webpack.getByStoreName<GuildChannelStore>("GuildChannelStore")!;
