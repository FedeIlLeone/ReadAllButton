import classNames from "classnames";
import { common, components, webpack } from "replugged";
import { DoubleCheckmark, ListItemTooltip, ReadAllButtonContextMenu } from ".";
import { cfg } from "..";

const { contextMenu, React } = common;
const { Clickable, Text } = components;

interface ReadAllButtonProps {
  onClick?: () => void;
}

export type ReadAllButtonType = React.FC<ReadAllButtonProps>;

const classes = await webpack.waitForProps<Record<"listItem" | "unavailableBadge", string>>(
  "unavailableBadge",
);

export default ((props) => {
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
            <Text.Eyebrow style={{ fontWeight: 500, textAlign: "center" }}>Read All</Text.Eyebrow>
          ) : (
            <DoubleCheckmark />
          )}
        </Clickable>
      </ListItemTooltip>
    </div>
  );
}) as ReadAllButtonType;
