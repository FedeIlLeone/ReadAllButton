import { Channel, Guild } from "discord-types/general";
import { webpack } from "replugged";
import type { Store } from "replugged/dist/renderer/modules/common/flux";

export enum ReadStateTypes {
  CHANNEL,
  GUILD_EVENT,
  NOTIFICATION_CENTER,
  GUILD_HOME,
  GUILD_ONBOARDING_QUESTION,
}

export enum UserNotificationSettings {
  ALL_MESSAGES,
  ONLY_MENTIONS,
  NO_MESSAGES,
  NULL,
}

enum ReadStateFlags {
  IS_GUILD_CHANNEL = 1,
  IS_THREAD = 2,
}

type ReadStateValue = boolean | number | string | GuildChannelUnreadState | null;

interface ChannelOverride {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  channel_id: string;
  collapsed: boolean;
  flags: number;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  message_notifications: UserNotificationSettings;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  mute_config: MuteConfig | null;
  muted: boolean;
}

interface GuildChannelUnreadState {
  hasNotableUnread: boolean;
  mentionCount: number;
}

interface MuteConfig {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  end_time: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  selected_time_window: number;
}

interface UnreadsSentinel {
  unreadsSentinel: number;
}

interface AnalyticsSectionOptions {
  section: string;
}

interface AckOptions {
  force?: boolean;
  immediate?: boolean;
  isExplicitUserAction?: boolean;
  local?: boolean;
  location?: AnalyticsSectionOptions;
  messageId: string | null;
  trackAnalytics?: boolean;
}

interface CompleteSerializedReadState {
  _ackMessageId: string | null;
  _ackMessageTimestamp: number;
  _guildId: string | null;
  _isActiveThread: boolean;
  _isJoinedThread: boolean;
  _isThread: boolean;
  _lastMessageId: string | null;
  _lastMessageTimestamp: number;
  _mentionCount: number;
  _oldestUnreadMessageId: string | null;
  _persisted: boolean;
  ackPinTimestamp: number;
  channelId: string;
  estimated: boolean;
  flags: ReadStateFlags;
  isManualAck: boolean;
  lastPinTimestamp: number;
  lastViewed: number | undefined;
  loadedMessages: boolean;
  oldestUnreadMessageIdStale: boolean;
  type: ReadStateTypes;
}

type SerializedReadState = Omit<
  CompleteSerializedReadState,
  | "_isActiveThread"
  | "_isJoinedThread"
  | "_isThread"
  | "_oldestUnreadMessageId"
  | "estimated"
  | "isManualAck"
  | "loadedMessages"
  | "oldestUnreadMessageIdStale"
> &
  Partial<Pick<CompleteSerializedReadState, "_isActiveThread" | "_isJoinedThread" | "_isThread">>;
declare class ReadState {
  public constructor(channelId: string, readStateType?: ReadStateTypes);

  private static _guildReadStateSentinels: Record<string, UnreadsSentinel>;
  private static _mentionChannels: Set<string>;
  private static _readStates: Array<Record<string, ReadState>>;

  public static clear: (channelId: string, readStateType?: ReadStateTypes) => boolean;
  public static clearAll: () => void;
  public static forEach: (callback: (readState: ReadState) => void) => void;
  public static get: (channelId: string, readStateType?: ReadStateTypes) => ReadState;
  public static getGuildSentinels: (guildId: string) => UnreadsSentinel;
  public static getIfExists: (
    channelId: string,
    readStateType?: ReadStateTypes,
  ) => ReadState | undefined;
  public static getMentionChannelIds: () => string[];
  public static getValue: (
    channelId: string,
    readStateType?: ReadStateTypes,
    callback?: (readState: ReadState) => ReadStateValue,
    defaultValue?: ReadStateValue,
  ) => ReadStateValue;
  public static resetGuildSentinels: () => void;

  private _ackMessageId: string | null;
  private _ackMessageTimestamp: number;
  private _guildId: string | null;
  private _isActiveThread: boolean;
  private _isJoinedThread: boolean;
  private _isResourceChannel: boolean;
  private _isThread: boolean;
  private _lastMessageId: string | null;
  private _lastMessageTimestamp: number;
  private _mentionCount: number;
  private _oldestUnreadMessageId: string | null;
  private _persisted: boolean;
  private _unreadCount: number;

  public ackMessageIdAtChannelSelect: string | null;
  public ackPinTimestamp: number;
  public channelId: string;
  public estimated: boolean;
  public flags: ReadStateFlags;
  public isManualAck: boolean;
  public lastPinTimestamp: number;
  public lastViewed: number | undefined;
  public loadedMessages: boolean;
  public oldestUnreadMessageIdStale: boolean;
  public outgoingAck: string | null;
  public outgoingAckTimer: NodeJS.Timeout | null;
  public type: ReadStateTypes;

  public get ackMessageId(): string | null;
  public set ackMessageId(ackMessageId: string | null);
  public get guildId(): string | null;
  public get lastMessageId(): string | null;
  public set lastMessageId(lastMessageId: string | null);
  public get lastMessageTimestamp(): number;
  public get mentionCount(): number;
  public set mentionCount(count: number);
  public get oldestUnreadMessageId(): string | null;
  public set oldestUnreadMessageId(oldestUnreadMessageId: string | null);
  public get oldestUnreadTimestamp(): number;
  public get unreadCount(): number;
  public set unreadCount(count: number);

  private _ack: (location: AnalyticsSectionOptions, track: boolean) => void;
  private _nonChannelAck: () => void;
  private _shouldAck: (force?: boolean, local?: boolean, isExplicitUserAction?: boolean) => boolean;

  public ack: (ackOptions: AckOptions) => boolean;
  public ackPins: (timestamp?: number | null) => boolean;
  public canBeUnread: () => boolean;
  public canHaveMentions: () => boolean;
  public canTrackUnreads: () => boolean;
  public clearOutgoingAck: () => void;
  public delete: (remote?: boolean) => void;
  public deserializeForOverlay: (readState: ReadState) => void;
  public getAckTimestamp: () => number;
  public getGuildChannelUnreadState: (
    channel: Channel,
    optInEnabledForGuild?: boolean,
    guildUnreadsExperimentEnabled?: boolean,
    channelOverrides?: Record<string, ChannelOverride>,
    channelMuted?: boolean,
    channelUnread?: boolean,
  ) => GuildChannelUnreadState;
  public getMentionCount: () => number;
  public guessAckMessageId: () => string | null;
  public handleGuildEventRemoval: (guildId: string, guildScheduledEventId: string) => void;
  public hasMentions: () => boolean;
  public hasNotableUnread: () => boolean;
  public hasRecentlyVisitedAndRead: () => boolean;
  public hasUnread: () => boolean;
  public hasUnreadOrMentions: () => boolean;
  public incrementGuildUnreadsSentinel: () => void;
  public isForumPostUnread: () => boolean;
  public isPrivate: () => boolean;
  public rebuildChannelState: (
    messageId?: string,
    resetMentionCount?: boolean,
    newMentionCount?: number,
  ) => void;
  public recalculateFlags: () => ReadStateFlags;
  public recordLastViewedTime: () => void;
  public serialize: (complete?: boolean) => SerializedReadState | CompleteSerializedReadState;
  public shouldDeleteReadState: () => boolean;
  public syncThreadSettings: () => boolean;
}

export interface ReadStateStore extends Store {
  ackMessageId: (channelId: string, readStateType?: ReadStateTypes) => string | null;
  getAllReadStates: (complete?: boolean) => SerializedReadState[] | CompleteSerializedReadState[];
  getForDebugging: (channelId: string, readStateType?: ReadStateTypes) => ReadState | undefined;
  getGuildChannelUnreadState: (
    channel: Channel,
    optInEnabledForGuild?: boolean,
    guildUnreadsExperimentEnabled?: boolean,
    channelOverrides?: Record<string, ChannelOverride>,
    channelMuted?: boolean,
    channelUnread?: boolean,
  ) => GuildChannelUnreadState;
  getGuildUnreadsSentinel: (guildId: string) => number;
  getMentionChannelIds: () => string[];
  getMentionCount: (channelId: string, readStateType?: ReadStateTypes) => number;
  getNotifCenterReadState: (channelId: string) => ReadState;
  getOldestUnreadMessageId: (channelId: string, readStateType?: ReadStateTypes) => string | null;
  getOldestUnreadTimestamp: (channelId: string, readStateType?: ReadStateTypes) => number;
  getReadStatesByChannel: () => Record<string, ReadState>;
  getTrackedAckMessageId: (channelId: string, readStateType?: ReadStateTypes) => string | null;
  getUnreadCount: (channelId: string, readStateType?: ReadStateTypes) => number;
  hasNotableUnread: (channelId: string, readStateType?: ReadStateTypes) => boolean;
  hasOpenedThread: (channelId: string, readStateType?: ReadStateTypes) => boolean;
  hasRecentlyVisitedAndRead: (channelId: string, readStateType?: ReadStateTypes) => boolean;
  hasRelevantUnread: (channelId: string, readStateType?: ReadStateTypes) => boolean;
  hasTrackedUnread: (channelId: string, readStateType?: ReadStateTypes) => boolean;
  hasUnread: (channelId: string, readStateType?: ReadStateTypes) => boolean;
  hasUnreadPins: (channelId: string) => boolean;
  isEstimated: (channelId: string, readStateType?: ReadStateTypes) => boolean;
  isForumPostUnread: (channelId: string, readStateType?: ReadStateTypes) => boolean;
  isNewForumThread: (threadId: string, channelId: string, guild: Guild) => boolean;
  lastMessageId: (channelId: string, readStateType?: ReadStateTypes) => string | null;
  lastMessageTimestamp: (channelId: string, readStateType?: ReadStateTypes) => number;
  lastPinTimestamp: (channelId: string) => number | null;
}

export default webpack.getByStoreName<ReadStateStore>("ReadStateStore")!;
