import { common, components, webpack } from "replugged";
import { DoubleCheckmark, ListItemTooltip } from ".";

const { React } = common;
const { Clickable } = components;
const { filters, waitForModule } = webpack;

interface ReadAllButtonProps {
  onClick: () => void;
}

export type ReadAllButtonType = React.FC<ReadAllButtonProps>;

const classes = await waitForModule<Record<"listItem", string>>(
  filters.byProps("unavailableBadge"),
);

export default ((props) => {
  const [selected, setSelected] = React.useState(false);

  return (
    <div className={classes.listItem}>
      <ListItemTooltip text="Read All">
        <Clickable
          // ! onMouseEnter and onMouseLeave are not assignable to type ClickableType
          className={`readAllButton${selected ? " selected" : ""}`}
          onClick={props.onClick}
          onMouseEnter={() => setSelected(true)}
          onMouseLeave={() => setSelected(false)}>
          <DoubleCheckmark />
        </Clickable>
      </ListItemTooltip>
    </div>
  );
}) as ReadAllButtonType;
