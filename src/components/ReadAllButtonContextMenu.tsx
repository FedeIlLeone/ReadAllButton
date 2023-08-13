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
import { ReadTypeStrings } from "../constants";

const { contextMenu } = common;
const { ContextMenu: Menu } = components;

export type ReadAllButtonContextMenuType = React.FC;

export default (() => {
  const guildIds = getFilteredGuildIds();

  return (
    <Menu.ContextMenu navId="readallbutton-context" onClose={contextMenu.close}>
      <Menu.MenuItem
        id="direct-messages"
        label={ReadTypeStrings.DM}
        action={() => {
          markDMsAsRead();
          showClearedToast(ReadTypeStrings.DM);
        }}
      />
      <Menu.MenuItem
        id="guild-channels"
        label={ReadTypeStrings.GUILD_CHANNEL}
        action={() => {
          readChannels(guildIds);
          showClearedToast(ReadTypeStrings.GUILD_CHANNEL);
        }}
      />
      <Menu.MenuItem
        id="guild-events"
        label={ReadTypeStrings.GUILD_EVENT}
        action={() => {
          readEvents(guildIds);
          showClearedToast(ReadTypeStrings.GUILD_EVENT);
        }}
      />
      <Menu.MenuItem
        id="guild-onboarding-questions"
        label={ReadTypeStrings.GUILD_ONBOARDING_QUESTION}
        action={() => {
          readOnboardingQuestions(guildIds);
          showClearedToast(ReadTypeStrings.GUILD_ONBOARDING_QUESTION);
        }}
      />
    </Menu.ContextMenu>
  );
}) as ReadAllButtonContextMenuType;
