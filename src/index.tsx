import type { GuildClasses, GuildsNavComponent } from "@types";
import { Injector, common, util, webpack } from "replugged";
import { ReadAllButton, Settings } from "./components";
import "./style.css";
import {
  cfg,
  findInReactTree,
  forceUpdate,
  getChannels,
  getSortedPrivateChannels,
  getThreadsForGuild,
  hasUnread,
  lastMessageId,
} from "./utils";

const { fluxDispatcher, guilds, modal, toast } = common;

export const inject = new Injector();

let classes: Record<string, GuildClasses | Record<string, string>> = {};

enum READ_STATES {
  CHANNEL,
  GUILD_EVENT,
  GUILD_HOME,
  GUILD_ONBOARDING_QUESTION,
  NOTIFICATION_CENTER,
}

function bulkDispatch(list: string[], event: number): void {
  const dispatchChannels = list.map((id) => ({
    channelId: id,
    readStateType: event,
    messageId: lastMessageId(id, event),
  }));
  if (!dispatchChannels.length) return;

  fluxDispatcher.dispatch({ type: "BULK_ACK", channels: dispatchChannels, context: "APP" });
}

function readChannels(guildIds: string[]): void {
  const textChannelsList = guildIds
    .map((id) => getChannels(id).SELECTABLE.map(({ channel }) => channel.id))
    .flat();
  const threadsList = guildIds
    .map((id) => Object.values(getThreadsForGuild(id)))
    .flat()
    .map((thread) => Object.keys(thread))
    .flat();

  const channelsList = [...textChannelsList, ...threadsList].filter((id) => hasUnread(id));

  bulkDispatch(channelsList, READ_STATES.CHANNEL);
}

function readEvents(guildIds: string[]): void {
  bulkDispatch(guildIds, READ_STATES.GUILD_EVENT);
}

function markGuildAsRead(): void {
  const guildIds = Object.keys(guilds.getGuilds());
  if (!guildIds) return;

  if (cfg.get("markChannels")) readChannels(guildIds);
  if (cfg.get("markGuildEvents")) readEvents(guildIds);
}

function markDMsAsRead(): void {
  const dmsList = getSortedPrivateChannels()
    .map((dm) => dm.id)
    .filter((id) => hasUnread(id));

  bulkDispatch(dmsList, READ_STATES.CHANNEL);
}

async function markAsRead(): Promise<void> {
  if (cfg.get("askConfirm")) {
    if (
      !(await modal.confirm({
        title: "Mark All As Read",
        body: "Are you sure you want to mark everything as read?",
      }))
    )
      return;
  }

  try {
    markGuildAsRead();
    if (cfg.get("markDMs")) markDMsAsRead();
    if (cfg.get("toasts")) toast.toast("Cleared everything!", toast.Kind.SUCCESS);
  } catch (err) {
    toast.toast("Something went wrong!", toast.Kind.FAILURE);
    console.error(err);
  }
}

export async function patchGuildsNav(): Promise<void> {
  const GuildsNav = await webpack.waitForModule<GuildsNavComponent>(
    webpack.filters.bySource("guildsnav"),
  );

  inject.after(GuildsNav, "type", ([props], res) => {
    const GuildsNavBar = findInReactTree(res, (node) =>
      node?.props?.className?.includes(props.className),
    );
    if (!GuildsNavBar) return res;

    patchGuildsNavBar(GuildsNavBar);

    return res;
  });

  util
    .waitFor(`.${classes.guildClasses.guilds}`)
    .then(forceUpdate)
    .catch(() => {});
}

function patchGuildsNavBar(component: JSX.Element): void {
  inject.after(component, "type", (_, res) => {
    const NavScroll = findInReactTree(res, (node) => node?.props?.onScroll);
    if (!NavScroll?.props?.children) return res;

    let index = 2;

    const getIndexByKeyword = (keyword: string): number =>
      NavScroll.props.children.findIndex((child: React.ReactElement) =>
        child?.type?.toString()?.includes(keyword),
      );

    const StudentHubsIndex = getIndexByKeyword("isOnHubVerificationRoute");
    if (index !== -1) {
      index = StudentHubsIndex - 1;
    }

    NavScroll.props.children.splice(index, 0, <ReadAllButton onClick={markAsRead} />);

    return res;
  });
}

export { Settings, cfg };

export async function start(): Promise<void> {
  classes.guildClasses = await webpack.waitForProps<string, GuildClasses>(["guilds", "sidebar"]);

  await patchGuildsNav();
}

export function stop(): void {
  inject.uninjectAll();

  forceUpdate(document.querySelector(`.${classes.guildClasses.guilds}`));
}
