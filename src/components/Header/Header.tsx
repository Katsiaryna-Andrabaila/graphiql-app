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
  Flex,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { Link, useNavigate } from 'react-router-dom';
import GraphQLIcon from '../../assets/graphql-ar21.svg';
import { AppContext } from '../../HOC/Provider';
import useStyles, { HEADER_HEIGHT } from './styles';
import { HeaderResponsiveProps } from '../../types/types';

function HeaderResponsive({ links }: HeaderResponsiveProps) {
  const [opened, { toggle, close }] = useDisclosure(false);
  const link = String(location.pathname);
  const pathname = links.find((el) => el.link === link)
    ? links.filter((el) => el.link === link)[0].link
    : '';
  const [active, setActive] = useState('');
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
  const {
    isAuth,
    lang,
    handleClickLogin,
    handleClickRegister,
    handleClickLogout,
    handleChangeLanguage,
  } = useContext(AppContext);

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
          <Image src={GraphQLIcon} alt="GraphQL icon" />
        </ActionIcon>
        {isAuth ? (
          <Group spacing={5} className={classes.links}>
            {items}
          </Group>
        ) : null}
        <Group className={classes.links1}>
          {link === '/' ? null : (
            <SegmentedControl
              value={lang}
              onChange={handleChangeLanguage}
              data={[
                { label: 'RU', value: 'ru' },
                { label: 'EN', value: 'en' },
              ]}
            />
          )}
          {isAuth ? (
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
                  <SegmentedControl
                    mt={mobile ? '1rem' : ''}
                    value={lang}
                    onChange={handleChangeLanguage}
                    data={[
                      { label: 'RU', value: 'ru' },
                      { label: 'EN', value: 'en' },
                    ]}
                  />
                )}
                {isAuth ? (
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
