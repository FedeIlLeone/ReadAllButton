import LazyScroller from "@components/webpack/LazyScroller";
import SearchBar from "@components/webpack/SearchBar";
import SortedGuildStore from "@stores/SortedGuildStore";
import { cfg } from "@utils/PluginSettingsUtils";
import type { Guild } from "discord-types/general";
import { common, components } from "replugged";

import "./ServerBlacklistModal.css";

const { guilds, i18n, React } = common;
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
  onClose: () => Promise<void>;
}

function matchString(query: string, str: string): boolean {
  query = query.toLowerCase();

  const tokens = str.split("");
  let queryPosition = 0;

  tokens.forEach((char) => {
    if (char.toLowerCase() === query[queryPosition]) {
      queryPosition++;
      if (queryPosition >= query.length) {
        return false;
      }
    }
  });

  if (queryPosition !== query.length) return false;

  return true;
}

function search(guilds: Guild[], query: string): Guild[] {
  if (query === "") return guilds;

  query = query.toLowerCase();

  const matching = [];

  for (let i = 0; i < guilds.length; i++) {
    const guild = guilds[i];
    const name = guild.name.toLowerCase();

    if (name === query || guild.id === query) {
      return [guild];
    }

    if (matchString(query, name)) {
      matching.push(guild);
    }
  }

  return matching;
}

export default (props: ModalProps): React.ReactElement => {
  const { onClose } = props;

  const sortedGuilds = React.useMemo(() => {
    const guildIds = SortedGuildStore
      ? SortedGuildStore.getFlattenedGuildIds()
      : guilds.getGuildIds();

    const guildsList: Guild[] = [];

    guildIds.forEach((guildId) => {
      const guild = guilds.getGuild(guildId);

      if (guild) guildsList.push(guild);
    });

    return guildsList;
  }, []);

  const [query, setQuery] = React.useState("");
  const [list, setList] = React.useState(cfg.get("blacklist"));

  const searched = search(sortedGuilds, query);

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
      const guild = searched[index];
      const isBlacklisted = list.includes(guild.id);

      return (
        <div className="readAllButton-blacklistItem">
          <Checkbox
            value={isBlacklisted}
            onChange={() => handleList(guild.id)}
            type={Checkbox.Types.INVERTED}
            disabled={!guild}>
            <Flex>
              {guild.icon && (
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
                {guild.name}
              </Text>
            </Flex>
          </Checkbox>
        </div>
      );
    },
    [searched, handleList, list],
  );

  const handleSubmit = React.useCallback(() => {
    cfg.set("blacklist", list);
    void onClose();
  }, [list, onClose]);

  return (
    <Modal.ModalRoot transitionState={props.transitionState}>
      <Modal.ModalHeader direction={Flex.Direction.VERTICAL} separator={false}>
        <Text.H1 variant="heading-xl/semibold">
          {i18n.Messages.READALLBUTTON_SETTINGS_SERVER_BLACKLIST_TITLE}
        </Text.H1>
      </Modal.ModalHeader>
      <Modal.ModalContent className="readAllButton-blacklistModalContent">
        <SearchBar
          query={query}
          onChange={setQuery}
          onClear={() => setQuery("")}
          size={SearchBar.Sizes.MEDIUM}
          className="readAllButton-blacklistSearchBar"
        />
        <LazyScroller
          role="listbox"
          renderRow={handleRender}
          rowCount={searched.length}
          rowCountBySection={[searched.length]}
          rowHeight={36}
        />
      </Modal.ModalContent>
      <Modal.ModalFooter>
        <Button onClick={handleSubmit} type="submit">
          {i18n.Messages.DONE}
        </Button>
        <Button onClick={onClose} look={Button.Looks.LINK} color={Button.Colors.PRIMARY}>
          {i18n.Messages.CLOSE}
        </Button>
      </Modal.ModalFooter>
    </Modal.ModalRoot>
  );
};
