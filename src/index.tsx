import ReadAllButton from "@components/ReadAllButton";
import Settings from "@components/Settings";
import translations from "@i18n";
import type { MemoGuildsNavType } from "@types";
import { cfg } from "@utils/PluginSettingsUtils";
import { findInReactTree, forceUpdate } from "@utils/ReactUtils";
import type React from "react";
import { Injector, common, i18n, util, webpack } from "replugged";

const {
  i18n: { Messages },
  toast,
} = common;

export const inject = new Injector();

const classes = await webpack.waitForProps<Record<"guilds" | "sidebar", string>>(
  "guilds",
  "sidebar",
);

export function showClearedToast(readTypeString?: string): void {
  if (!cfg.get("toasts")) return;

  const message = readTypeString
    ? Messages.READALLBUTTON_CLEARED_TOAST.format({ type: readTypeString })
    : Messages.READALLBUTTON_CLEARED_EVERYTHING_TOAST;
  toast.toast(message, toast.Kind.SUCCESS);
}

async function patchGuildsNav(): Promise<void> {
  const MemoGuildsNav = await webpack.waitForModule<MemoGuildsNavType>(
    webpack.filters.bySource("guildsnav"),
  );

  inject.after(MemoGuildsNav, "type", ([props], res) => {
    const GuildsBar = findInReactTree(
      res,
      (node) => node.props?.className?.includes(props.className),
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
    const advancedScrollerNone = findInReactTree(res, (node) => node.props?.onScroll);
    if (!advancedScrollerNone?.props?.children) return res;

    const getIndexByKeyword = (keyword: string): number =>
      advancedScrollerNone.props.children.findIndex((child: React.ReactElement) =>
        child.type.toString().includes(keyword),
      );

    const homeButtonIndex = getIndexByKeyword("showProgressBadge");

    advancedScrollerNone.props.children.splice(homeButtonIndex + 1, 0, <ReadAllButton />);

    return res;
  });
}

export { Settings, cfg };

export async function start(): Promise<void> {
  i18n.loadAllStrings(translations);

  await patchGuildsNav();
}

export function stop(): void {
  inject.uninjectAll();

  forceUpdate(document.querySelector(`.${classes.guilds}`));
}
