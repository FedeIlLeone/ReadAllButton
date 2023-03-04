import { common, components, webpack } from "replugged";
import { DoubleCheckmark, ListItemTooltip } from ".";
import { cfg } from "..";

const { React } = common;
const { Clickable, Text } = components;
const { filters, waitForModule } = webpack;

interface ReadAllButtonProps {
  onClick?: () => void;
}

export type ReadAllButtonType = React.FC<ReadAllButtonProps>;

const classes = await waitForModule<Record<"listItem", string>>(
  filters.byProps("unavailableBadge"),
);

export default ((props) => {
  const [selected, setSelected] = React.useState(false);

  const useText = cfg.get("text");
  const useRoundButton = cfg.get("roundButton");

  return (
    <div className={classes.listItem}>
      <ListItemTooltip text="Read All" shouldShow={!useText}>
        <Clickable
          className={`readAllButton${selected ? " selected" : ""}${useRoundButton ? " round" : ""}`}
          onClick={props.onClick}
          onMouseEnter={() => setSelected(true)}
          onMouseLeave={() => setSelected(false)}>
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
