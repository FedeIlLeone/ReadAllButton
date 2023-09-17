import ActiveJoinedThreadsStore from "@stores/ActiveJoinedThreadsStore";
import GuildChannelStore from "@stores/GuildChannelStore";
import GuildOnboardingPromptsStore from "@stores/GuildOnboardingPromptsStore";
import GuildReadStateStore from "@stores/GuildReadStateStore";
import ReadStateStore, { ReadStateTypes } from "@stores/ReadStateStore";
import { cfg } from "@utils/PluginSettingsUtils";
import { common } from "replugged";

const { fluxDispatcher: Dispatcher, guilds } = common;

// Utilities

/**
 * Given a list of ids and the read state type to which they belong, dispatches a BULK_ACK action.
 */
function bulkAckDispatch(list: string[], readStateType: ReadStateTypes): void {
  const isOnboardingQuestion = readStateType === ReadStateTypes.GUILD_ONBOARDING_QUESTION;

  const dispatchChannels = list.map((id) => ({
    channelId: id,
    readStateType,
    messageId: isOnboardingQuestion
      ? GuildOnboardingPromptsStore.ackIdForGuild(id)
      : ReadStateStore.lastMessageId(id, readStateType),
  }));
  if (!dispatchChannels.length) return;

  Dispatcher.dispatch({ type: "BULK_ACK", channels: dispatchChannels, context: "APP" });
}

/**
 * Gets an array of guild ids, filtered by the plugin settings (blacklist and markMuted).
 */
export function getFilteredGuildIds(): string[] {
  const guildIds = guilds.getGuildIds().filter((guildId) => {
    const blacklist = cfg.get("blacklist");
    const markMuted = cfg.get("markMuted");

    if (blacklist.includes(guildId)) return false;
    // GuildReadStateStore.hasUnread returns false if the guild is muted
    if (!markMuted) return GuildReadStateStore.hasUnread(guildId);

    return true;
  });
  return guildIds;
}

// Read Functions

/**
 * Given an array of guild ids, dispatches a BULK_ACK action
 * that marks all guild channels (text, voice and thread) as read.
 */
export function readChannels(guildIds: string[]): void {
  const selectableChannelsList = guildIds
    .map((id) => GuildChannelStore.getSelectableChannelIds(id))
    .flat();
  const vocalChannelsList = guildIds.map((id) => GuildChannelStore.getVocalChannelIds(id)).flat();
  const threadsList = guildIds
    .map((id) => Object.values(ActiveJoinedThreadsStore.getActiveJoinedThreadsForGuild(id)))
    .flat()
    .map((thread) => Object.keys(thread))
    .flat();

  const channelsList = [...selectableChannelsList, ...vocalChannelsList, ...threadsList];

  bulkAckDispatch(channelsList, ReadStateTypes.CHANNEL);
}

/**
 * Given an array of guild ids, dispatches a BULK_ACK action that marks all guild events as read.
 */
export function readEvents(guildIds: string[]): void {
  bulkAckDispatch(guildIds, ReadStateTypes.GUILD_EVENT);
}

/**
 * Given an array of guild ids, dispatches a BULK_ACK action that marks all guild onboarding questions as read.
 */
export function readOnboardingQuestions(guildIds: string[]): void {
  bulkAckDispatch(guildIds, ReadStateTypes.GUILD_ONBOARDING_QUESTION);
}

// Mark As Read Functions

/**
 * Marks all guilds as read, depending on the plugin settings.
 */
export function markGuildAsRead(): void {
  const guildIds = getFilteredGuildIds();
  if (guildIds.length === 0) return;

  if (cfg.get("markChannels")) readChannels(guildIds);
  if (cfg.get("markGuildEvents")) readEvents(guildIds);
  if (cfg.get("markOnboardingQuestions")) readOnboardingQuestions(guildIds);
}

/**
 * Marks all direct messages as read.
 */
export function markDMsAsRead(): void {
  const dmsList = common.channels
    .getSortedPrivateChannels()
    .map((dm) => dm.id)
    .filter((id) => ReadStateStore.hasUnread(id));

  bulkAckDispatch(dmsList, ReadStateTypes.CHANNEL);
}
