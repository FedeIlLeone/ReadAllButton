import DoubleCheckmark from "@components/DoubleCheckmark";
import ListItemTooltip from "@components/ListItemTooltip";
import ReadAllButtonContextMenu from "@components/ReadAllButtonContextMenu";
import { markDMsAsRead, markGuildAsRead } from "@utils/MarkAsReadUtils";
import { cfg } from "@utils/PluginSettingsUtils";
import classNames from "classnames";
import { common, components, webpack } from "replugged";
import { showClearedToast } from "..";

import "./ReadAllButton.css";

const {
  contextMenu,
  i18n: { Messages },
  React,
  modal,
  toast,
} = common;
const { Clickable, Text } = components;

const classes =
  await webpack.waitForProps<Record<"listItem" | "unavailableBadge", string>>("unavailableBadge");

export default (): React.ReactElement => {
  const [selected, setSelected] = React.useState(false);

  const useText = cfg.get("text");
  const useRoundButton = cfg.get("roundButton");

  const handleClick = React.useCallback(async () => {
    if (cfg.get("askConfirm")) {
      if (
        !(await modal.confirm({
          title: Messages.MARK_ALL_AS_READ,
          body: Messages.READALLBUTTON_MARK_ALL_READ_DESCRIPTION,
        }))
      )
        return;
    }

    try {
      markGuildAsRead();
      if (cfg.get("markDMs")) markDMsAsRead();
      showClearedToast();
    } catch (err) {
      toast.toast(Messages.READALLBUTTON_ERROR_GENERIC_TOAST, toast.Kind.FAILURE);
      console.error(err);
    }
  }, []);

  return (
    <div className={classes.listItem}>
      <ListItemTooltip text={Messages.READALLBUTTON_READ_ALL} shouldShow={!useText}>
        <Clickable
          className={classNames("readAllButton", { selected }, { round: useRoundButton })}
          onClick={handleClick}
          onMouseEnter={() => setSelected(true)}
          onMouseLeave={() => setSelected(false)}
          onContextMenu={(event) => contextMenu.open(event, ReadAllButtonContextMenu)}>
          {useText ? (
            <Text.Eyebrow className="readAllButton-buttonText">
              {Messages.READALLBUTTON_READ_ALL}
            </Text.Eyebrow>
          ) : (
            <DoubleCheckmark width={24} height={24} />
          )}
        </Clickable>
      </ListItemTooltip>
    </div>
  );
};
