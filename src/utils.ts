import type {
  ActiveThreadsStore,
  GuildChannelStore,
  Predicate,
  ReadStateStore,
  Settings,
} from "@types";
import type { ChannelStore } from "discord-types/stores";
import { settings, util, webpack } from "replugged";
import { inject } from ".";

const defaultSettings: Partial<Settings> = {
  roundButton: false,
  text: false,
  toasts: true,
};

export const cfg = await settings.init<Settings, keyof typeof defaultSettings>(
  "dev.fedeilleone.ReadAllButton",
  defaultSettings,
);

export const { getThreadsForGuild }: ActiveThreadsStore = await webpack
  .waitForModule(webpack.filters.byProps("getThreadsForGuild"))
  .then((mod) => Object.getPrototypeOf(webpack.getExportsForProps(mod, ["getThreadsForGuild"])));

export const { getSortedPrivateChannels }: ChannelStore = await webpack
  .waitForModule(webpack.filters.byProps("getSortedPrivateChannels"))
  .then((mod) =>
    Object.getPrototypeOf(webpack.getExportsForProps(mod, ["getSortedPrivateChannels"])),
  );

export const { getChannels }: GuildChannelStore = await webpack
  .waitForModule(webpack.filters.byProps("getChannels"))
  .then((mod) => Object.getPrototypeOf(webpack.getExportsForProps(mod, ["getChannels"])));

export const { hasUnread, lastMessageId }: ReadStateStore = await webpack
  .waitForModule(webpack.filters.byProps("lastMessageId"))
  .then((mod) => Object.getPrototypeOf(webpack.getExportsForProps(mod, ["lastMessageId"])));

// https://github.com/GriefMoDz/statistic-counter/blob/main/src/lib/util.ts#L6-L25
export function findInReactTree(
  node: React.ReactElement | React.ReactElement[],
  predicate: Predicate<React.ReactElement>,
): React.ReactElement | null {
  const stack = [node].flat();

  while (stack.length !== 0) {
    const node = stack.pop();

    if (node && predicate(node)) {
      return node;
    }

    if (node?.props?.children) {
      stack.push(...[node.props.children].flat());
    }
  }

  return null;
}

// https://github.com/GriefMoDz/statistic-counter/blob/main/src/lib/util.ts#L27-L40
export function forceUpdate(element: Element | null): void {
  if (!element) return;

  const instance = util.getOwnerInstance(element);
  if (instance) {
    const forceRerender = inject.instead(instance, "render", () => {
      forceRerender();

      return null;
    });

    instance.forceUpdate(() => instance.forceUpdate(() => {}));
  }
}
