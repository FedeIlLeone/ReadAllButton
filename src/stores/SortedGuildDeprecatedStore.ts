import type { Guild } from "discord-types/general";
import { webpack } from "replugged";

interface Folder {
  folderColor?: number;
  folderId?: number;
  folderName?: string;
  guilds: Guild[];
  index: number;
}

interface Snapshot {
  data: { folders: Folder[]; sortedGuilds: Folder[] };
  version: number;
}

export interface SortedGuildDeprecatedStore {
  guildFolders: Folder[];
  persistKey: string;

  getFlattenedGuilds: () => Guild[];
  getSortedGuilds: () => Folder[];
  takeSnapshot: () => Snapshot;
}

export default (await webpack
  .waitForProps("getFlattenedGuilds", "getSortedGuilds")
  .then(Object.getPrototypeOf)) as SortedGuildDeprecatedStore;
