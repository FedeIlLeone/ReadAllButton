import type React from "react";
import { components, util } from "replugged";
import { cfg } from "..";

const { FormItem, SwitchItem } = components;

export default (): React.ReactElement => {
  const useRoundButton = util.useSetting(cfg, "roundButton");
  const useText = util.useSetting(cfg, "text");
  const showToasts = util.useSetting(cfg, "toasts");

  return (
    <>
      <FormItem title="Appearance">
        <SwitchItem {...useRoundButton}>Use a round button</SwitchItem>
        <SwitchItem {...useText} note="Disables the tooltip as well">
          Display text instead of an icon
        </SwitchItem>
      </FormItem>
      <FormItem title="Other">
        <SwitchItem {...showToasts}>Show a confirmation toast</SwitchItem>
      </FormItem>
    </>
  );
};
