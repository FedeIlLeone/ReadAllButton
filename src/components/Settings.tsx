import type React from "react";
import { common, components, util } from "replugged";
import ServerBlacklistModal from "./ServerBlacklistModal";
import { ReadTypeStrings } from "../constants";
import { cfg } from "../utils/PluginSettingsUtils";

import "./Settings.css";

const { modal } = common;
const { Button, Checkbox, Flex, FormItem, SwitchItem, Text } = components;

enum ReadType {
  DM,
  GUILD_CHANNEL,
  GUILD_EVENT,
  GUILD_ONBOARDING_QUESTION,
}

interface ReadListCheckboxProps {
  onChange: (
    newValue: boolean | (Record<string, unknown> & { value: boolean | undefined }) | undefined,
  ) => void;
  type: ReadType;
  value: boolean;
}

function ReadListCheckbox(props: ReadListCheckboxProps): React.ReactElement {
  const { type, ...setting } = props;
  const { onChange, value } = setting;
  let header = "";

  switch (props.type) {
    case ReadType.DM:
      header = ReadTypeStrings.DM;
      break;
    case ReadType.GUILD_CHANNEL:
      header = ReadTypeStrings.GUILD_CHANNEL;
      break;
    case ReadType.GUILD_EVENT:
      header = ReadTypeStrings.GUILD_EVENT;
      break;
    case ReadType.GUILD_ONBOARDING_QUESTION:
      header = ReadTypeStrings.GUILD_ONBOARDING_QUESTION;
      break;
  }

  return (
    <div className="readAllButton-listContainer">
      <Text color="header-primary" variant="heading-sm/semibold">
        {header}
      </Text>
      <Checkbox
        value={value}
        onChange={(event) => onChange(event.target.checked)}
        type={Checkbox.Types.INVERTED}
        className="readAllButton-listCheckbox"
      />
    </div>
  );
}

export default (): React.ReactElement => {
  const markChannels = util.useSetting(cfg, "markChannels");
  const markDMs = util.useSetting(cfg, "markDMs");
  const markGuildEvents = util.useSetting(cfg, "markGuildEvents");
  const markOnboardingQuestions = util.useSetting(cfg, "markOnboardingQuestions");
  const useRoundButton = util.useSetting(cfg, "roundButton");
  const useText = util.useSetting(cfg, "text");
  const showConfirm = util.useSetting(cfg, "askConfirm");
  const showToasts = util.useSetting(cfg, "toasts");

  return (
    <>
      <FormItem
        title="Server Blacklist"
        note={`${cfg.get("blacklist").length} servers won't get marked as read.`}
        style={{ marginBottom: 20 }}
        divider>
        <Button
          onClick={() => modal.openModal((props) => <ServerBlacklistModal {...props} />)}
          size={Button.Sizes.SMALL}>
          Edit Blacklist
        </Button>
      </FormItem>
      <FormItem title="Mark As Read" style={{ marginBottom: 20 }} divider>
        <Flex direction={Flex.Direction.VERTICAL} style={{ gap: 4 }}>
          <ReadListCheckbox {...markChannels} type={ReadType.GUILD_CHANNEL} />
          <ReadListCheckbox {...markDMs} type={ReadType.DM} />
          <ReadListCheckbox {...markGuildEvents} type={ReadType.GUILD_EVENT} />
          <ReadListCheckbox
            {...markOnboardingQuestions}
            type={ReadType.GUILD_ONBOARDING_QUESTION}
          />
        </Flex>
      </FormItem>
      <FormItem title="Appearance">
        <SwitchItem {...useRoundButton}>Use a round button</SwitchItem>
        <SwitchItem {...useText} note="Disables the tooltip as well.">
          Display text instead of an icon
        </SwitchItem>
      </FormItem>
      <FormItem title="Other">
        <SwitchItem {...showConfirm}>Ask for confirmation before marking as read</SwitchItem>
        <SwitchItem {...showToasts}>Show a confirmation toast</SwitchItem>
      </FormItem>
    </>
  );
};
