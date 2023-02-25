import { types } from "replugged";

const exportsStr = "window.replugged.plugins.getExports('dev.fedeilleone.ReadAllButton')";

const patches: types.PlaintextPatch[] = [
  {
    replacements: [
      {
        match: /GUILD_DISCOVERY_TOOLTIP}\):null,/,
        replace: `GUILD_DISCOVERY_TOOLTIP}):null,${exportsStr}&&${exportsStr}.renderButton(),`,
      },
    ],
  },
];

export default patches;
