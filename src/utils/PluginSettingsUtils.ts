import { settings } from "replugged";

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

const defaultSettings = {
  askConfirm: false,
  blacklist: [],
  markChannels: true,
  markDMs: true,
  markGuildEvents: true,
  markOnboardingQuestions: true,
  roundButton: false,
  text: false,
  toasts: true,
} satisfies Partial<Settings>;

export const cfg = await settings.init<Settings, keyof typeof defaultSettings>(
  "dev.fedeilleone.ReadAllButton",
  defaultSettings,
);
