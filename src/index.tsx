import ReadAllButton from "@components/ReadAllButton";
import Settings from "@components/Settings";
import type { GuildsNavComponent } from "@types";
import { markDMsAsRead, markGuildAsRead } from "@utils/MarkAsReadUtils";
import { cfg } from "@utils/PluginSettingsUtils";
import { findInReactTree, forceUpdate } from "@utils/ReactUtils";
import type React from "react";
import { Injector, common, util, webpack } from "replugged";

const { modal, toast } = common;

export const inject = new Injector();

const classes = await webpack.waitForProps<Record<"guilds" | "sidebar", string>>(
  "guilds",
  "sidebar",
);

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
    const GuildsBar = findInReactTree(
      res,
      (node) => node?.props?.className?.includes(props.className),
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
      advancedScrollerNone.props.children.findIndex(
        (child: React.ReactElement) => child?.type?.toString()?.includes(keyword),
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
