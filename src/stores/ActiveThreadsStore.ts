import { webpack } from "replugged";

interface ThreadChannel {
  id: string;
  parentId: string;
}

export interface ActiveThreadsStore {
  forEachGuild: (
    callback: (guildId: string, threads: Record<string, Record<string, ThreadChannel>>) => void,
  ) => void;
  getThreadsForGuild: (guildId: string) => Record<string, Record<string, ThreadChannel>>;
  getThreadsForParent: (guildId: string, channelId: string) => Record<string, ThreadChannel>;
  hasLoaded: (guildId: string) => boolean;
  hasThreadsForChannel: (guildId: string, channelId: string) => boolean;
  isActive: (guildId: string, channelId: string, threadId: string) => boolean;
}

export default (await webpack
  .waitForProps(["getThreadsForGuild"])
  .then(Object.getPrototypeOf)) as ActiveThreadsStore;
