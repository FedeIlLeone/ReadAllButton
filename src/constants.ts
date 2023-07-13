export enum ReadStateTypes {
  CHANNEL,
  GUILD_EVENT,
  NOTIFICATION_CENTER,
  GUILD_HOME,
  GUILD_ONBOARDING_QUESTION,
}

export const ReadTypeStrings = {
  DM: "Direct Messages",
  GUILD_CHANNEL: "Guild Channels",
  GUILD_EVENT: "Guild Events",
  GUILD_ONBOARDING_QUESTION: "Guild Onboarding Questions",
  MUTED_GUILD: "Muted Guilds",
};
