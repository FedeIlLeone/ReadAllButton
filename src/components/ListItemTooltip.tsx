import type React from "react";
import { components, webpack } from "replugged";

const { Tooltip } = components;
const { filters, waitForModule } = webpack;

interface ListItemTooltipProps {
  color?: string;
  disabled?: boolean;
  disableWrapper?: boolean;
  forceOpen?: boolean;
  hideOnClick?: boolean;
  selected?: boolean;
  shouldShow?: boolean;
  text?: string;
  tooltipClass?: string;
}

export type ListItemTooltipType = React.FC<React.PropsWithChildren<ListItemTooltipProps>>;

const classes = await waitForModule<
  Record<"listItemTooltip" | "listItemWrapper" | "selected", string>
>(filters.byProps("listItemTooltip"));

export default ((props) => {
  const {
    disabled = false,
    disableWrapper = false,
    hideOnClick = true,
    selected = false,
    text = "",
    tooltipClass = "",
  } = props;

  return (
    <Tooltip
      color={props.color}
      forceOpen={props.forceOpen}
      hideOnClick={hideOnClick}
      position={Tooltip.Positions.RIGHT}
      shouldShow={props.shouldShow}
      spacing={20}
      text={disabled ? "" : text}
      tooltipClassName={`${classes.listItemTooltip} ${tooltipClass}`}>
      {disableWrapper ? (
        props.children
      ) : (
        <div className={`${classes.listItemWrapper} ${selected ? classes.selected : ""}`}>
          {props.children}
        </div>
      )}
    </Tooltip>
  );
}) as ListItemTooltipType;
