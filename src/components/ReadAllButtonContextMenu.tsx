import {
  getFilteredGuildIds,
  markDMsAsRead,
  readChannels,
  readEvents,
  readOnboardingQuestions,
} from "@utils/MarkAsReadUtils";
import type React from "react";
import { common, components } from "replugged";
import { showClearedToast } from "..";

const { contextMenu, i18n } = common;
const { ContextMenu: Menu } = components;

export default (): React.ReactElement => {
  const guildIds = getFilteredGuildIds();

  return (
    <Menu.ContextMenu navId="readallbutton-context" onClose={contextMenu.close}>
      <Menu.MenuItem
        id="direct-messages"
        label={i18n.Messages.READALLBUTTON_READ_TYPE_DM}
        action={() => {
          markDMsAsRead();
          showClearedToast(i18n.Messages.READALLBUTTON_READ_TYPE_DM);
        }}
      />
      <Menu.MenuItem
        id="guild-channels"
        label={i18n.Messages.READALLBUTTON_READ_TYPE_GUILD_CHANNEL}
        action={() => {
          readChannels(guildIds);
          showClearedToast(i18n.Messages.READALLBUTTON_READ_TYPE_GUILD_CHANNEL);
        }}
      />
      <Menu.MenuItem
        id="guild-events"
        label={i18n.Messages.READALLBUTTON_READ_TYPE_GUILD_EVENT}
        action={() => {
          readEvents(guildIds);
          showClearedToast(i18n.Messages.READALLBUTTON_READ_TYPE_GUILD_EVENT);
        }}
      />
      <Menu.MenuItem
        id="guild-onboarding-questions"
        label={i18n.Messages.READALLBUTTON_READ_TYPE_GUILD_ONBOARDING_QUESTION}
        action={() => {
          readOnboardingQuestions(guildIds);
          showClearedToast(i18n.Messages.READALLBUTTON_READ_TYPE_GUILD_ONBOARDING_QUESTION);
        }}
      />
    </Menu.ContextMenu>
  );
};
