import type React from "react";
import { common, components, util } from "replugged";
import { ReadAllButton } from ".";
import { cfg } from "..";

const { toast } = common;
const { FormItem, SwitchItem } = components;

function Preview(): React.ReactElement {
  return (
    <div className="readAllButton-preview">
      <ReadAllButton
        onClick={() => cfg.get("toasts") && toast.toast("Toasts are enabled!", toast.Kind.SUCCESS)}
      />
    </div>
  );
}

export default (): React.ReactElement => {
  const useRoundButton = util.useSetting(cfg, "roundButton");
  const useText = util.useSetting(cfg, "text");
  const showToasts = util.useSetting(cfg, "toasts");

  return (
    <>
      <FormItem title="Preview" style={{ marginBottom: 20 }}>
        <Preview />
      </FormItem>
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
