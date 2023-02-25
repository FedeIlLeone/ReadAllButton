import { Channel } from "discord-types/general";
import { webpack } from "replugged";

interface ReadStateStore {
  lastMessageId: (id: string, event: number) => string;
}

export const { lastMessageId }: ReadStateStore = await webpack
  .waitForModule(webpack.filters.byProps("lastMessageId"))
  .then((mod) => Object.getPrototypeOf(webpack.getExportsForProps(mod, ["lastMessageId"])));

interface GuildChannelStore {
  getChannels: (id: string) => {
    SELECTABLE: Array<{ channel: Channel; comparator: number }>;
    VOCAL: Array<{ channel: Channel; comparator: number }>;
    count: number;
    id: string;
  };
}

export const { getChannels }: GuildChannelStore = await webpack
  .waitForModule(webpack.filters.byProps("getChannels"))
  .then((mod) => Object.getPrototypeOf(webpack.getExportsForProps(mod, ["getChannels"])));
