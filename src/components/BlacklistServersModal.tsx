import { common, components } from "replugged";
import { LazyScroller } from ".";
import { cfg } from "..";
import { getFlattenedGuildIds } from "../utils";

const { guilds, React } = common;
const { Button, Checkbox, Flex, Modal, Text } = components;

enum ModalTransitionState {
  ENTERING,
  ENTERED,
  EXITING,
  EXITED,
  HIDDEN,
}

interface ModalProps {
  transitionState: ModalTransitionState;
  onClose(): Promise<void>;
}

export type BlacklistServersModalType = React.FC<ModalProps>;

export default ((props) => {
  const guildIds = getFlattenedGuildIds();

  const [list, setList] = React.useState(cfg.get("blacklist") || []);

  const handleList = React.useCallback(
    (guildId: string) => {
      setList((arr) => {
        const newArr = [...arr];
        if (newArr.includes(guildId)) {
          const index = newArr.indexOf(guildId);
          newArr.splice(index, 1);
        } else {
          newArr.push(guildId);
        }
        return newArr;
      });
    },
    [setList],
  );

  const handleRender = React.useCallback(
    (index: number) => {
      const guildId = guildIds[index];
      const guild = guilds.getGuild(guildId);
      const isBlacklisted = list.includes(guildId);

      return (
        <div className="readAllButton-blacklistItem">
          <Checkbox
            value={isBlacklisted}
            onChange={() => handleList(guildId)}
            type={Checkbox.Types.INVERTED}
            disabled={!guild}>
            <Flex>
              {guild?.icon && (
                <img
                  src={guild.getIconURL(20, true)}
                  width={20}
                  height={20}
                  className="readAllButton-blacklistItemIcon"
                />
              )}
              <Text
                color="header-primary"
                variant="text-md/normal"
                className="readAllButton-blacklistItemText">
                {guild ? guild.name : `N/A (${guildId})`}
              </Text>
            </Flex>
          </Checkbox>
        </div>
      );
    },
    [guildIds, handleList, list],
  );

  const handleSubmit = React.useCallback(() => {
    cfg.set("blacklist", list);
    void props.onClose();
  }, [list, props.onClose]);

  return (
    <Modal.ModalRoot transitionState={props.transitionState}>
      <Modal.ModalHeader direction={Flex.Direction.VERTICAL} separator={false}>
        <Text.H1 variant="heading-xl/semibold">Blacklist Servers</Text.H1>
      </Modal.ModalHeader>
      <Modal.ModalContent className="readAllButton-blacklistModalContent">
        <LazyScroller
          role="listbox"
          renderRow={handleRender}
          rowCount={guildIds.length}
          rowCountBySection={[guildIds.length]}
          rowHeight={36}
        />
      </Modal.ModalContent>
      <Modal.ModalFooter>
        <Button onClick={handleSubmit} type="submit">
          Done
        </Button>
        <Button onClick={props.onClose} look={Button.Looks.LINK} color={Button.Colors.PRIMARY}>
          Cancel
        </Button>
      </Modal.ModalFooter>
    </Modal.ModalRoot>
  );
}) as BlacklistServersModalType;
