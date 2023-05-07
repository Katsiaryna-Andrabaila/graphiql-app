import { useTranslation } from 'react-i18next';
import { useContext, useState } from 'react';
import {
  createStyles,
  Header,
  Container,
  Group,
  Burger,
  Paper,
  Transition,
  rem,
  Text,
  Button,
  ActionIcon,
  Image,
  SegmentedControl,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../../utils/context';
import { endSession } from '../../utils/storage';
import GraphQLIcon from '../../assets/graphql-ar21.svg';

const HEADER_HEIGHT = rem(60);

const useStyles = createStyles((theme) => ({
  root: {
    position: 'relative',
    zIndex: 1,
  },

  logo: {
    width: 86,
    height: 43,
  },

  dropdown: {
    position: 'absolute',
    top: HEADER_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    overflow: 'hidden',

    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
  },

  links: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  burger: {
    [theme.fn.largerThan('47.95em')]: {
      display: 'none',
    },
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },

    [theme.fn.smallerThan('sm')]: {
      borderRadius: 0,
      padding: theme.spacing.md,
    },
  },

  linkActive: {
    '&, &:hover': {
      backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
      color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
    },
  },
}));

interface HeaderResponsiveProps {
  links: { link: string; label: string }[];
}

function HeaderResponsive({ links }: HeaderResponsiveProps) {
  const [opened, { toggle, close }] = useDisclosure(false);
  // console.log((location.pathname))
  console.log((String(location.pathname))[0].link)
  const pathname =
    String(location.pathname) !== '/404'
      ? links.filter((el) => el.link === String(location.pathname))[0].link
      : null;
  const [active, setActive] = useState(pathname);
  const { classes, cx } = useStyles();

  const items = links.map((link) => (
    <Text
      component={Link}
      key={link.label}
      to={link.link}
      className={cx(classes.link, { [classes.linkActive]: active === link.link })}
      onClick={() => {
        setActive(link.link);
        close();
      }}
    >
      {link.label}
    </Text>
  ));

  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { setIsLogin, isAuth, setIsAuth, lang, setLang } = useContext(AppContext);

  const handleClickLogin = () => {
    setIsLogin && setIsLogin(true);
    navigate('/login');
  };

  const handleClickRegister = () => {
    setIsLogin && setIsLogin(false);
    navigate('/login');
  };

  const handleClickLogout = () => {
    endSession();
    setIsAuth && setIsAuth(false);
    setIsLogin && setIsLogin(true);
    navigate('/login');
  };

  const handleChangeLanguage = () => {
    if (lang === 'en') {
      setLang && setLang('ru');
      i18n.changeLanguage('ru');
    } else {
      setLang && setLang('en');
      i18n.changeLanguage('en');
    }
  };

  return (
    <Header height={HEADER_HEIGHT} className={classes.root}>
      <Container className={classes.header}>
        <ActionIcon component={Link} to="/" className={classes.logo}>
          <Image src={GraphQLIcon} alt="GraphQL icon" />
        </ActionIcon>
        {isAuth ? (
          <Group spacing={5} className={classes.links}>
            {items}
          </Group>
        ) : null}

        <Burger opened={opened} onClick={toggle} className={classes.burger} size="sm" />

        <Transition transition="pop-top-right" duration={200} mounted={opened}>
          {(styles) => (
            <Paper className={classes.dropdown} withBorder style={styles}>
              {items}
            </Paper>
          )}
        </Transition>

        <Group>
          <SegmentedControl
            value={lang}
            onChange={handleChangeLanguage}
            data={[
              { label: 'RU', value: 'ru' },
              { label: 'EN', value: 'en' },
            ]}
          />
          {isAuth ? (
            <Button onClick={handleClickLogout}>{t('logOut')}</Button>
          ) : (
            <Group>
              <Button variant="default" onClick={handleClickLogin}>
                {t('loginLink')}
              </Button>
              <Button onClick={handleClickRegister}>{t('signUp')}</Button>
            </Group>
          )}
        </Group>
      </Container>
    </Header>
  );
}
export default HeaderResponsive;
