import { Injector, common, util, webpack } from "replugged";
import { ReadAllButton, Settings } from "./components";
import "./style.css";
import type { GuildClasses, GuildsNavComponent } from "@types";
import { cfg, findInReactTree, forceUpdate, getChannels, lastMessageId } from "./utils";

const { fluxDispatcher, guilds, toast } = common;

export const inject = new Injector();

let classes: Record<string, GuildClasses | Record<string, string>> = {};

enum READ_STATES {
  CHANNEL,
  GUILD_EVENT,
  GUILD_HOME,
  GUILD_ONBOARDING_QUESTION,
  NOTIFICATION_CENTER,
}

function readChannels(guildIds: string[]): void {
  const channelsList = guildIds
    .map((id) => getChannels(id).SELECTABLE.map(({ channel }) => channel.id))
    .flat();

  const dispatchChannels = channelsList.map((id) => ({
    channelId: id,
    readStateType: READ_STATES.CHANNEL,
    messageId: lastMessageId(id, READ_STATES.CHANNEL),
  }));
  if (!dispatchChannels.length) return;

  fluxDispatcher.dispatch({ type: "BULK_ACK", channels: dispatchChannels, context: "APP" });
}

function readEvents(guildIds: string[]): void {
  const eventChannels = guildIds.map((id) => ({
    channelId: id,
    readStateType: READ_STATES.GUILD_EVENT,
    messageId: lastMessageId(id, READ_STATES.GUILD_EVENT),
  }));
  if (!eventChannels.length) return;

  fluxDispatcher.dispatch({ type: "BULK_ACK", channels: eventChannels, context: "APP" });
}

function markAsRead(): void {
  const guildIds = Object.keys(guilds.getGuilds());
  if (!guildIds) return;

  try {
    readChannels(guildIds);
    readEvents(guildIds);
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

    const GuildSeparatorIndex = getIndexByKeyword("guildSeparator");
    if (index !== -1) {
      index = GuildSeparatorIndex - 1;
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
