import DoubleCheckmark from "@components/DoubleCheckmark";
import ListItemTooltip from "@components/ListItemTooltip";
import ReadAllButtonContextMenu from "@components/ReadAllButtonContextMenu";
import { cfg } from "@utils/PluginSettingsUtils";
import classNames from "classnames";
import { common, components, webpack } from "replugged";

import "./ReadAllButton.css";

const { contextMenu, React } = common;
const { Clickable, Text } = components;

interface ReadAllButtonProps {
  onClick?: () => void;
}

const classes =
  await webpack.waitForProps<Record<"listItem" | "unavailableBadge", string>>("unavailableBadge");

export default (props: ReadAllButtonProps): React.ReactElement => {
  const [selected, setSelected] = React.useState(false);

  const useText = cfg.get("text");
  const useRoundButton = cfg.get("roundButton");

  return (
    <div className={classes.listItem}>
      <ListItemTooltip text="Read All" shouldShow={!useText}>
        <Clickable
          className={classNames("readAllButton", { selected }, { round: useRoundButton })}
          onClick={props.onClick}
          onMouseEnter={() => setSelected(true)}
          onMouseLeave={() => setSelected(false)}
          onContextMenu={(event) => contextMenu.open(event, () => <ReadAllButtonContextMenu />)}>
          {useText ? (
            <Text.Eyebrow className="readAllButton-buttonText">Read All</Text.Eyebrow>
          ) : (
            <DoubleCheckmark width={24} height={24} />
          )}
        </Clickable>
      </ListItemTooltip>
    </div>
  );
};
