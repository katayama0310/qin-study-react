import { useState, useEffect } from 'react';
import { Container, Avatar, UnstyledButton, Group, Text, Menu, Tabs, Burger, rem } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconLogout,
  IconHeart,
  IconStar,
  IconMessage,
  IconSettings,
  IconPlayerPause,
  IconTrash,
  IconSwitchHorizontal,
  IconChevronDown,
} from '@tabler/icons-react';
import { MantineLogo } from '@mantine/ds';
import { useHeaderStyles } from './useHeaderStyle';
import { useRouter } from 'next/router';
import { TABS } from '@templates/defaultTemplate';

interface HeaderTabsProps {
  user: { name: string; image: string };
  tabs: typeof TABS;
}

export const HeaderTabs = ({ user, tabs }: HeaderTabsProps) => {
  const { classes, theme, cx } = useHeaderStyles();
  const [opened, { toggle }] = useDisclosure(false);
  const [userMenuOpened, setUserMenuOpened] = useState<boolean>(false);
  const router = useRouter();

  // pathを受け取って、tabに変換する
  const pathToTab = (path: string): (typeof TABS)[number] => {
    switch (path) {
      case '/home':
        return 'Home';
        break;
      case '/newChallenge':
        return 'NewChallenge';
        break;
      case '/myChallenge':
        return 'My30daysChallenge';
        break;
      case '/account':
        return 'Account';
        break;
      case '/settings':
        return 'Settings';
        break;
      case '/help':
        return 'Help';
        break;
      default:
        return 'Home';
        break;
    }
  };

  const tabToPushPath = async (tab: (typeof TABS)[number]): Promise<void> => {
    switch (tab) {
      case 'Home':
        await router.push('/home');
        break;
      case 'NewChallenge':
        await router.push('/newChallenge');
        break;
      case 'My30daysChallenge':
        await router.push('/myChallenge');
        break;
      case 'Account':
        await router.push('/account');
        break;
      case 'Settings':
        await router.push('/settings');
        break;
      case 'Help':
        await router.push('/help');
        break;
      default:
        break;
    }
  };

  const items = tabs.map((tab) => (
    <Tabs.Tab value={tab} key={tab}>
      {tab}
    </Tabs.Tab>
  ));

  return (
    <div className={classes.header}>
      <Container className={classes.mainSection}>
        <Group position='apart'>
          <MantineLogo size={28} />

          <Burger opened={opened} onClick={toggle} className={classes.burger} size='sm' />

          <Menu
            width={260}
            position='bottom-end'
            transitionProps={{ transition: 'pop-top-right' }}
            onClose={() => setUserMenuOpened(false)}
            onOpen={() => setUserMenuOpened(true)}
            withinPortal
          >
            <Menu.Target>
              <UnstyledButton
                className={cx(classes.user, {
                  [classes.userActive]: userMenuOpened,
                })}
              >
                <Group spacing={7}>
                  <Avatar
                    // src={user.image}
                    // alt={user.name}
                    radius='xl'
                    size={20}
                  />
                  <Text weight={500} size='sm' sx={{ lineHeight: 1 }} mr={3}>
                    {/* {user.name} */}
                  </Text>
                  <IconChevronDown size={rem(12)} stroke={1.5} />
                </Group>
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item icon={<IconHeart size='0.9rem' color={theme.colors.red[6]} stroke={1.5} />}>
                Liked posts
              </Menu.Item>
              <Menu.Item icon={<IconStar size='0.9rem' color={theme.colors.yellow[6]} stroke={1.5} />}>
                Saved posts
              </Menu.Item>
              <Menu.Item icon={<IconMessage size='0.9rem' color={theme.colors.blue[6]} stroke={1.5} />}>
                Your comments
              </Menu.Item>

              <Menu.Label>Settings</Menu.Label>
              <Menu.Item icon={<IconSettings size='0.9rem' stroke={1.5} />}>Account settings</Menu.Item>
              <Menu.Item icon={<IconSwitchHorizontal size='0.9rem' stroke={1.5} />}>Change account</Menu.Item>
              <Menu.Item icon={<IconLogout size='0.9rem' stroke={1.5} />}>Logout</Menu.Item>

              <Menu.Divider />

              <Menu.Label>Danger zone</Menu.Label>
              <Menu.Item icon={<IconPlayerPause size='0.9rem' stroke={1.5} />}>Pause subscription</Menu.Item>
              <Menu.Item color='red' icon={<IconTrash size='0.9rem' stroke={1.5} />}>
                Delete account
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Container>
      <Container>
        <Tabs
          value={pathToTab(router.pathname)}
          variant='outline'
          onTabChange={(tab) => {
            tabToPushPath(tab as (typeof TABS)[number]);
          }}
          classNames={{
            root: classes.tabs,
            tabsList: classes.tabsList,
            tab: classes.tab,
          }}
        >
          <Tabs.List>{items}</Tabs.List>
        </Tabs>
      </Container>
    </div>
  );
};
