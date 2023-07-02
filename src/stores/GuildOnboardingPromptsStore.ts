import { webpack } from "replugged";
import type { Store } from "replugged/dist/renderer/modules/common/flux";

enum OnboardingPromptTypes {
  MULTIPLE_CHOICE,
  DROPDOWN,
}

interface OnboardingPrompt {
  disabled: boolean | undefined;
  hasNewAnswers: boolean;
  id: string;
  isNew: boolean;
  isOnboarding: boolean;
  options: OnboardingPromptOption[];
  required: boolean;
  singleSelect: boolean;
  title: string;
  type: OnboardingPromptTypes;
}

interface OnboardingPromptOption {
  channelIds: string[];
  description: string;
  emoji: { id: string | null; name: string; animated: boolean };
  id: string;
  isUnseen: boolean;
  roleIds: string[];
  title: string;
}

export interface GuildOnboardingPromptsStore extends Store {
  ackIdForGuild: (guildId: string) => string;
  getDefaultChannelIds: (guildId: string) => string[];
  getEnabled: (guildId: string) => boolean;
  getEnabledOnboardingPrompts: (guildId: string) => OnboardingPrompt[];
  getOnboardingPrompt: (onboardingPromptId: string) => OnboardingPrompt;
  getOnboardingPrompts: (guildId: string) => OnboardingPrompt[];
  getOnboardingPromptsForOnboarding: (guildId: string) => OnboardingPrompt[];
  getOnboardingResponses: (guildId: string) => string[];
  getOnboardingResponsesForPrompt: (guildId: string, onboardingPromptId: string) => string[];
  getPendingResponseOptions: () => void;
  getSelectedOptions: (guildId: string) => OnboardingPromptOption[];
  isAdvancedMode: (guildId: string) => boolean;
  isLoading: () => boolean;
  lastFetchedAt: (guildId: string) => number;
  shouldFetchPrompts: (guildId: string, time?: number) => boolean;
}

export default webpack.getByStoreName<GuildOnboardingPromptsStore>("GuildOnboardingPromptsStore")!;
