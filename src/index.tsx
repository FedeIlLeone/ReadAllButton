import { common } from "replugged";
import { ReadAllButton } from "./components";
import "./style.css";
import { getChannels, lastMessageId } from "./utils";

const { fluxDispatcher, guilds } = common;

const BULK_ACK = "BULK_ACK";

function readChannels(guildIds: string[]) {
  const channelsList = guildIds
    .map((id) => getChannels(id).SELECTABLE.map(({ channel }) => channel.id))
    .flat();

  const dispatchChannels = channelsList.map((id) => ({
    channelId: id,
    readStateType: 0,
    messageId: lastMessageId(id, 0),
  }));
  if (!dispatchChannels.length) return;

  fluxDispatcher.dispatch({ type: BULK_ACK, channels: dispatchChannels, context: "APP" });
}

function markAsRead() {
  const guildIds = Object.keys(guilds.getGuilds());
  if (!guildIds) return;

  readChannels(guildIds);

  const eventChannels = guildIds.map((id) => ({
    channelId: id,
    readStateType: 1,
    messageId: lastMessageId(id, 0),
  }));
  if (!eventChannels.length) return;

  fluxDispatcher.dispatch({ type: BULK_ACK, channels: eventChannels, context: "APP" });
}

export function renderButton(): React.ReactElement {
  return <ReadAllButton onClick={markAsRead} />;
}
