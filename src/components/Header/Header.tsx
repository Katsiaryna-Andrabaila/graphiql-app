import { useTranslation } from 'react-i18next';
import { useContext, useEffect, useRef, useState } from 'react';
import {
  Header,
  Container,
  Group,
  Burger,
  Paper,
  Transition,
  Text,
  Button,
  ActionIcon,
  Image,
  SegmentedControl,
  useMantineColorScheme,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../../HOC/Provider';
import useStyles, { HEADER_HEIGHT } from './styles';
import { HeaderResponsiveProps } from '../../types/types';
import { IconSun, IconMoonStars } from '@tabler/icons-react';
import { availableLanguages } from '../../constants/constants';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../utils/firebase';

function HeaderResponsive({ links }: HeaderResponsiveProps) {
  const [user] = useAuthState(auth);
  const [opened, { toggle, close }] = useDisclosure(false);
  const link = String(location.pathname);
  const pathname = links.find((el) => el.link === link)
    ? links.filter((el) => el.link === link)[0].link
    : '';
  const [active, setActive] = useState('');
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const { classes, cx } = useStyles();
  const rootRef = useRef(null);
  const mobile = useMediaQuery('(max-width: 48em)');

  useEffect(() => {
    setActive(pathname);
  }, [pathname]);

  const items = links.map((link) => (
    <Text
      component={Link}
      key={link.label}
      to={link.link}
      className={cx(classes.link, { [classes.linkActive]: active === link.link })}
      onClick={() => {
        close();
      }}
    >
      {link.label}
    </Text>
  ));

  const { t } = useTranslation();
  const navigate = useNavigate();
  const { lang, handleClickLogin, handleClickRegister, handleClickLogout, handleChangeLanguage } =
    useContext(AppContext);

  window.addEventListener('scroll', () => {
    if (rootRef.current) {
      if (document.body.scrollTop > 1 || document.documentElement.scrollTop > 1) {
        (rootRef.current! as HTMLElement).style.background = 'rgb(213 214 220 / 62%)';
        (rootRef.current! as HTMLElement).style.boxShadow =
          '0px 10px 0px 0px rgb(213 214 220 / 62%)';
      } else {
        (rootRef.current! as HTMLElement).style.background = '';
        (rootRef.current! as HTMLElement).style.boxShadow = '';
      }
    }
  });

  return link === '/login' ? null : (
    <Header height={HEADER_HEIGHT} className={classes.root} ref={rootRef}>
      <Container className={classes.header}>
        <ActionIcon component={Link} to="/" className={classes.logo}>
          <Image src="./graphql-ar21.svg" alt="GraphQL icon" />
        </ActionIcon>
        {user ? (
          <Group spacing={5} className={classes.links}>
            {items}
          </Group>
        ) : null}
        <Group className={classes.links1}>
          {link === '/' ? null : (
            <>
              <Group position="center" my="xl">
                <ActionIcon
                  onClick={() => toggleColorScheme()}
                  size="lg"
                  sx={(theme) => ({
                    backgroundColor:
                      theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                    color:
                      theme.colorScheme === 'dark' ? theme.colors.yellow[4] : theme.colors.blue[6],
                  })}
                >
                  {colorScheme === 'dark' ? (
                    <IconSun size="1.2rem" />
                  ) : (
                    <IconMoonStars size="1.2rem" />
                  )}
                </ActionIcon>
              </Group>
            </>
          )}
          {user ? (
            <Button
              onClick={() => {
                if (handleClickLogout) {
                  handleClickLogout(() => navigate('/login'));
                }
              }}
            >
              {t('logOut')}
            </Button>
          ) : (
            <Group>
              <Button
                variant="default"
                onClick={() => {
                  if (handleClickLogin) {
                    handleClickLogin(() => navigate('/login'));
                  }
                }}
              >
                {t('loginLink')}
              </Button>
              <Button
                onClick={() => {
                  if (handleClickRegister) {
                    handleClickRegister(() => navigate('/login'));
                  }
                }}
              >
                {t('signUp')}
              </Button>
            </Group>
          )}
        </Group>

        <Transition transition="pop-top-right" duration={200} mounted={opened}>
          {(styles) => (
            <Paper className={classes.dropdown} withBorder style={styles}>
              {items}
              <Group
                spacing={0}
                sx={{
                  justifyContent: mobile ? 'center' : 'end',
                  flexDirection: mobile ? 'column' : 'row',
                }}
              >
                {link === '/' ? null : (
                  <>
                    <Group position="center" my="sm">
                      <ActionIcon
                        onClick={() => toggleColorScheme()}
                        size="lg"
                        sx={(theme) => ({
                          backgroundColor:
                            theme.colorScheme === 'dark'
                              ? theme.colors.dark[6]
                              : theme.colors.gray[0],
                          color:
                            theme.colorScheme === 'dark'
                              ? theme.colors.yellow[4]
                              : theme.colors.blue[6],
                        })}
                      >
                        {colorScheme === 'dark' ? (
                          <IconSun size="1.2rem" />
                        ) : (
                          <IconMoonStars size="1.2rem" />
                        )}
                      </ActionIcon>
                    </Group>
                    <SegmentedControl
                      value={lang}
                      onChange={handleChangeLanguage}
                      data={availableLanguages}
                    />
                  </>
                )}
                {user ? (
                  <Button
                    m={mobile ? '0.5rem 0' : ''}
                    onClick={() => {
                      if (handleClickLogout) {
                        handleClickLogout(() => navigate('/login'));
                      }
                    }}
                  >
                    {t('logOut')}
                  </Button>
                ) : (
                  <Group m={mobile ? '0.5rem' : ''}>
                    <Button
                      variant="default"
                      onClick={() => {
                        if (handleClickLogin) {
                          handleClickLogin(() => navigate('/login'));
                        }
                      }}
                    >
                      {t('loginLink')}
                    </Button>
                    <Button
                      onClick={() => {
                        if (handleClickRegister) {
                          handleClickRegister(() => navigate('/login'));
                        }
                      }}
                    >
                      {t('signUp')}
                    </Button>
                  </Group>
                )}
              </Group>
            </Paper>
          )}
        </Transition>

        <Burger opened={opened} onClick={toggle} className={classes.burger} size="sm" />
      </Container>
    </Header>
  );
}
export default HeaderResponsive;
