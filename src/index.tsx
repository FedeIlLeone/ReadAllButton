import type { GuildsNavComponent } from "@types";
import type React from "react";
import { Injector, common, util, webpack } from "replugged";
import { ReadAllButton, Settings } from "./components";
import {
  ActiveJoinedThreadsStore,
  GuildChannelStore,
  GuildOnboardingPromptsStore,
  ReadStateStore,
} from "./stores";
import { ReadStateTypes } from "./stores/ReadStateStore";
import "./style.css";
import { cfg, findInReactTree, forceUpdate } from "./utils";

const { fluxDispatcher, guilds, modal, toast } = common;

export const inject = new Injector();

const classes = await webpack.waitForProps<Record<"guilds" | "sidebar", string>>(
  "guilds",
  "sidebar",
);

function bulkDispatch(list: string[], readStateType: ReadStateTypes): void {
  const isOnboardingQuestion = readStateType === ReadStateTypes.GUILD_ONBOARDING_QUESTION;

  const dispatchChannels = list.map((id) => ({
    channelId: id,
    readStateType,
    messageId: isOnboardingQuestion
      ? GuildOnboardingPromptsStore.ackIdForGuild(id)
      : ReadStateStore.lastMessageId(id, readStateType),
  }));
  if (!dispatchChannels.length) return;

  fluxDispatcher.dispatch({ type: "BULK_ACK", channels: dispatchChannels, context: "APP" });
}

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

  bulkDispatch(channelsList, ReadStateTypes.CHANNEL);
}

export function readEvents(guildIds: string[]): void {
  bulkDispatch(guildIds, ReadStateTypes.GUILD_EVENT);
}

export function readOnboardingQuestions(guildIds: string[]): void {
  bulkDispatch(guildIds, ReadStateTypes.GUILD_ONBOARDING_QUESTION);
}

function markGuildAsRead(): void {
  const guildIds = guilds
    .getGuildIds()
    .filter((guildId) => !cfg.get("blacklist").includes(guildId));
  if (!guildIds) return;

  if (cfg.get("markChannels")) readChannels(guildIds);
  if (cfg.get("markGuildEvents")) readEvents(guildIds);
  if (cfg.get("markOnboardingQuestions")) readOnboardingQuestions(guildIds);
}

export function markDMsAsRead(): void {
  const dmsList = common.channels
    .getSortedPrivateChannels()
    .map((dm) => dm.id)
    .filter((id) => ReadStateStore.hasUnread(id));

  bulkDispatch(dmsList, ReadStateTypes.CHANNEL);
}

export function showClearedToast(readTypeString?: string): void {
  const toastContent = readTypeString ? `Cleared ${readTypeString}!` : "Cleared everything!";

  if (cfg.get("toasts")) toast.toast(toastContent, toast.Kind.SUCCESS);
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
    showClearedToast();
  } catch (err) {
    toast.toast("Something went wrong!", toast.Kind.FAILURE);
    console.error(err);
  }
}

async function patchGuildsNav(): Promise<void> {
  const GuildsNav = await webpack.waitForModule<GuildsNavComponent>(
    webpack.filters.bySource("guildsnav"),
  );

  inject.after(GuildsNav, "type", ([props], res) => {
    const GuildsBar = findInReactTree(res, (node) =>
      node?.props?.className?.includes(props.className),
    );
    if (!GuildsBar) return res;

    patchGuildsBar(GuildsBar);

    return res;
  });

  util
    .waitFor(`.${classes.guilds}`)
    .then(forceUpdate)
    .catch(() => {});
}

function patchGuildsBar(component: JSX.Element): void {
  inject.after(component, "type", (_, res) => {
    const advancedScrollerNone = findInReactTree(res, (node) => node?.props?.onScroll);
    if (!advancedScrollerNone?.props?.children) return res;

    const getIndexByKeyword = (keyword: string): number =>
      advancedScrollerNone.props.children.findIndex((child: React.ReactElement) =>
        child?.type?.toString()?.includes(keyword),
      );

    const homeButtonIndex = getIndexByKeyword("showProgressBadge");

    advancedScrollerNone.props.children.splice(
      homeButtonIndex + 1,
      0,
      <ReadAllButton onClick={markAsRead} />,
    );

    return res;
  });
}

export { Settings, cfg };

export async function start(): Promise<void> {
  await patchGuildsNav();
}

export function stop(): void {
  inject.uninjectAll();

  forceUpdate(document.querySelector(`.${classes.guilds}`));
}
