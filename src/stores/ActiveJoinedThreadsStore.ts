import { Channel } from "discord-types/general";
import { webpack } from "replugged";

interface ActiveJoinedThread {
  channel: Channel;
  joinTimestamp: number;
}

export interface ActiveJoinedThreadsStore {
  computeAllActiveJoinedThreads: (guildId: string) => Channel[];
  getActiveJoinedRelevantThreadsForGuild: (
    guildId: string,
  ) => Record<string, Record<string, ActiveJoinedThread>>;
  getActiveJoinedRelevantThreadsForParent: (
    guildId: string,
    channelId: string,
  ) => Record<string, ActiveJoinedThread>;
  getActiveJoinedThreadsForGuild: (
    guildId: string,
  ) => Record<string, Record<string, ActiveJoinedThread>>;
  getActiveJoinedThreadsForParent: (
    guildId: string,
    channelId: string,
  ) => Record<string, ActiveJoinedThread>;
  getActiveJoinedUnreadThreadsForGuild: (
    guildId: string,
  ) => Record<string, Record<string, ActiveJoinedThread>>;
  getActiveJoinedUnreadThreadsForParent: (
    guildId: string,
    channelId: string,
  ) => Record<string, ActiveJoinedThread>;
  getActiveThreadCount: (guildId: string, channelId: string) => number;
  getActiveUnjoinedThreadsForGuild: (guildId: string) => Record<string, Record<string, Channel>>;
  getActiveUnjoinedThreadsForParent: (
    guildId: string,
    channelId: string,
  ) => Record<string, Channel>;
  getActiveUnjoinedUnreadThreadsForGuild: (
    guildId: string,
  ) => Record<string, Record<string, Channel>>;
  getActiveUnjoinedUnreadThreadsForParent: (
    guildId: string,
    channelId: string,
  ) => Record<string, Channel>;
  getNewThreadCount: (guildId: string, channelId: string) => number;
  getNewThreadCountsForGuild: (guildId: string) => Record<string, number>;
  hasActiveJoinedUnreadThreads: (guildId: string, channelId: string) => boolean;
}

export default (await webpack
  .waitForProps("getActiveJoinedThreadsForGuild")
  .then(Object.getPrototypeOf)) as ActiveJoinedThreadsStore;
