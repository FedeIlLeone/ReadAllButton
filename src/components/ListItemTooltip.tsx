import classNames from "classnames";
import { common, components, webpack } from "replugged";

const { React } = common;
const { Tooltip } = components;

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

const classes =
  await webpack.waitForProps<Record<"listItemTooltip" | "listItemWrapper" | "selected", string>>(
    "listItemTooltip",
  );

export default ((props) => {
  const {
    disabled = false,
    disableWrapper = false,
    hideOnClick = true,
    selected = false,
    text = "",
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
      tooltipClassName={classNames(classes.listItemTooltip, props.tooltipClass)}>
      {disableWrapper ? (
        React.cloneElement(React.Children.only(props.children) as React.ReactElement, props)
      ) : (
        <div className={classNames(classes.listItemWrapper, { [classes.selected]: selected })}>
          {props.children}
        </div>
      )}
    </Tooltip>
  );
}) as ListItemTooltipType;
