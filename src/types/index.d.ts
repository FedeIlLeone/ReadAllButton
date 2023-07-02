import type { Store } from "replugged/dist/renderer/modules/common/flux";
import type { RawModule } from "replugged/dist/types";

interface Settings {
  askConfirm?: boolean;
  blacklist?: string[];
  markChannels?: boolean;
  markDMs?: boolean;
  markGuildEvents?: boolean;
  markOnboardingQuestions?: boolean;
  roundButton?: boolean;
  text?: boolean;
  toasts?: boolean;
}

type Comparator<T> = (a: T, b: T) => boolean;
type Predicate<Arg> = (arg: Arg) => boolean;

interface GuildsNavProps {
  className: string;
  disableAppDownload?: boolean;
  isOverlay?: boolean;
  themeOverride: string;
}

interface GuildsNavComponent extends RawModule {
  $$typeof: symbol;
  compare: Comparator<unknown>;
  type: (props: GuildsNavProps) => React.ReactElement;
}

declare class SnapshotStore<Snapshot> extends Store {
  public static allStores: SnapshotStore[];

  public static clearAll: () => void;

  public get persistKey(): string;

  public clear: () => void;
  public getClass: () => typeof SnapshotStore;
  public readSnapshot: (version: number) => Snapshot | null;
  public registerActionHandlers: (actions: Parameters<Store["registerActionHandlers"]>[0]) => void;
  public save: () => void;
}
