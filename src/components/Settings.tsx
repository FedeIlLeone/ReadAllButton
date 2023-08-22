import ServerBlacklistModal from "@components/ServerBlacklistModal";
import { cfg } from "@utils/PluginSettingsUtils";
import type React from "react";
import { common, components, util } from "replugged";

import "./Settings.css";

const {
  i18n: { Messages },
  modal,
} = common;
const { Button, Checkbox, ErrorBoundary, Flex, FormItem, SwitchItem, Text } = components;

enum ReadType {
  DM,
  GUILD_CHANNEL,
  GUILD_EVENT,
  GUILD_ONBOARDING_QUESTION,
  MUTED_GUILD,
}

interface ReadListCheckboxProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  type: ReadType;
  value: boolean;
}

function ReadListCheckbox(props: ReadListCheckboxProps): React.ReactElement {
  const { type, ...setting } = props;
  const { onChange, value } = setting;
  let header = "";

  switch (props.type) {
    case ReadType.DM:
      header = Messages.READALLBUTTON_READ_TYPE_DM;
      break;
    case ReadType.GUILD_CHANNEL:
      header = Messages.READALLBUTTON_READ_TYPE_GUILD_CHANNEL;
      break;
    case ReadType.GUILD_EVENT:
      header = Messages.READALLBUTTON_READ_TYPE_GUILD_EVENT;
      break;
    case ReadType.GUILD_ONBOARDING_QUESTION:
      header = Messages.READALLBUTTON_READ_TYPE_GUILD_ONBOARDING_QUESTION;
      break;
    case ReadType.MUTED_GUILD:
      header = Messages.READALLBUTTON_READ_TYPE_MUTED_GUILD;
      break;
  }

  return (
    <div className="readAllButton-listContainer">
      <Text color="header-primary" variant="heading-sm/semibold">
        {header}
      </Text>
      <Checkbox
        value={value}
        onChange={onChange}
        type={Checkbox.Types.INVERTED}
        className="readAllButton-listCheckbox"
      />
    </div>
  );
}

export default (): React.ReactElement => {
  const markMuted = util.useSetting(cfg, "markMuted");
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
        title={Messages.READALLBUTTON_SETTINGS_SERVER_BLACKLIST_TITLE}
        // TODO: blacklist length doesn't update
        note={Messages.READALLBUTTON_SETTINGS_SERVER_BLACKLIST_NOTE.format({
          count: cfg.get("blacklist").length,
        })}
        style={{ marginBottom: 20 }}
        divider>
        <Button
          onClick={() =>
            modal.openModal((props) => (
              <ErrorBoundary>
                <ServerBlacklistModal {...props} />
              </ErrorBoundary>
            ))
          }
          size={Button.Sizes.SMALL}>
          {Messages.READALLBUTTON_SETTINGS_EDIT_BLACKLIST}
        </Button>
      </FormItem>
      <FormItem title={Messages.MARK_AS_READ} style={{ marginBottom: 20 }} divider>
        <Flex direction={Flex.Direction.VERTICAL} style={{ gap: 4 }}>
          <ReadListCheckbox {...markMuted} type={ReadType.MUTED_GUILD} />
          <ReadListCheckbox {...markChannels} type={ReadType.GUILD_CHANNEL} />
          <ReadListCheckbox {...markDMs} type={ReadType.DM} />
          <ReadListCheckbox {...markGuildEvents} type={ReadType.GUILD_EVENT} />
          <ReadListCheckbox
            {...markOnboardingQuestions}
            type={ReadType.GUILD_ONBOARDING_QUESTION}
          />
        </Flex>
      </FormItem>
      <FormItem title={Messages.APPEARANCE}>
        <SwitchItem {...useRoundButton}>
          {Messages.READALLBUTTON_SETTINGS_ROUND_BUTTON_TITLE}
        </SwitchItem>
        <SwitchItem {...useText} note={Messages.READALLBUTTON_SETTINGS_DISPLAY_TEXT_NOTE}>
          {Messages.READALLBUTTON_SETTINGS_DISPLAY_TEXT_TITLE}
        </SwitchItem>
      </FormItem>
      <FormItem title={Messages.OTHER}>
        <SwitchItem {...showConfirm}>
          {Messages.READALLBUTTON_SETTINGS_ASK_CONFIRM_TITLE}
        </SwitchItem>
        <SwitchItem {...showToasts}>{Messages.READALLBUTTON_SETTINGS_SHOW_TOAST_TITLE}</SwitchItem>
      </FormItem>
    </>
  );
};
