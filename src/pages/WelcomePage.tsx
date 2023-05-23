import { useTranslation } from 'react-i18next';
import {
  Text,
  Center,
  Button,
  Title,
  Container,
  Group,
  createStyles,
  Box,
  useMantineColorScheme,
  Image,
  rem,
  em,
  ActionIcon,
  Anchor,
  Flex,
} from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import { TeamDescription } from '../components/TeamDescription';
import { AppContext } from '../HOC/Provider';
import { useContext } from 'react';
import { TeamMember } from '../types/types';

const useStyles = createStyles((theme) => ({
  button: {
    '&:hover': {
      color: 'white',
    },
  },

  technology: {
    width: '8rem',
    height: '8rem',

    [theme.fn.smallerThan('lg')]: {
      width: '8rem',
      height: '8rem',
    },
    [theme.fn.smallerThan('md')]: {
      width: '7rem',
      height: '7rem',
    },
    [theme.fn.smallerThan('sm')]: {
      width: '6rem',
      height: '6rem',
    },
    [theme.fn.smallerThan('xs')]: {
      width: '5rem',
      height: '5rem',
    },
  },
}));

const WelcomePage = () => {
  const { t } = useTranslation();
  const { classes } = useStyles();
  const data: Array<TeamMember> = t('teamArray', { returnObjects: true });
  const navigate = useNavigate();
  const { isAuth, handleClickLogin, handleClickRegister } = useContext(AppContext);
  const { colorScheme } = useMantineColorScheme();

  return (
    <>
      <Box
        p="xl"
        sx={{
          background:
            colorScheme === 'light'
              ? 'linear-gradient(180deg, #CD8FFF -20.03%, rgba(255, 226, 202, 0.59) 32.42%, #fff 61.98%)'
              : '',
        }}
      >
        <Container p="xl" mx="auto">
          <Title
            order={1}
            variant="gradient"
            gradient={{ from: 'indigo', to: 'red', deg: 45 }}
            mb={40}
          >
            {t('welcomePage.title')}
          </Title>
          <Text fz="xl" ta="center" align="center" mx="auto" mb={30} fw={600}>
            {t('welcomePage.mainText')}
          </Text>
          <Center mb={30}>
            {isAuth ? (
              <Button component={Link} to="/redactor" className={classes.button}>
                {t('welcomePage.playgroundButton')}
              </Button>
            ) : (
              <Group>
                <Button
                  className={classes.button}
                  onClick={() => {
                    if (handleClickLogin) {
                      handleClickLogin(() => navigate('/login'));
                    }
                  }}
                >
                  {t('loginLink')}
                </Button>
                <Button
                  className={classes.button}
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
          </Center>
          <Title order={2} pb="1rem">{t('welcomePage.team')}</Title>
          <TeamDescription data={data} />
        </Container>
        <Container>
          <Title order={2} pb="1rem">{t('welcomePage.technologies')}</Title>
        <Flex
          gap="3.2rem"
          justify="center"
          align="center"
          wrap="wrap"
          pb="3rem"
        >
          <Box className={classes.technology}>
            <Anchor href='https://react.dev/'>
              <Image caption="React" src="src/assets/logos/react.png"></Image>
            </Anchor>
          </Box>
          <Box className={classes.technology}>
            <Anchor href='https://reactrouter.com/'>
              <Image src="src/assets/logos/router.png" caption="React Router"></Image>
            </Anchor>
          </Box>
          <Box className={classes.technology}>
            <Anchor href='https://www.typescriptlang.org/'>
              <Image src="src/assets/logos/typescript.png" caption="Typescript"></Image>
            </Anchor>
          </Box>
          <Box className={classes.technology}>
            <Anchor href='https://vitejs.dev/'>
              <Image src="src/assets/logos/vite.png" caption="Vite"></Image>
            </Anchor>
          </Box>
          <Box className={classes.technology}>
            <Anchor href='https://mantine.dev/'>
              <Image src="src/assets/logos/mantine.png" caption="Mantine"></Image>
            </Anchor>
          </Box>
          <Box className={classes.technology}>
            <Anchor href='https://firebase.google.com/'>
              <Image src="src/assets/logos/firebase.png" caption="Firebase"></Image>
            </Anchor>
          </Box>
          <Box className={classes.technology}>
            <Anchor href='https://graphql.org/'> 
              <Image src="src/assets/logos/graphql.png" caption="Graphql"></Image>
            </Anchor>
          </Box>
          <Box className={classes.technology}>
            <Anchor href='https://www.i18next.com/'>
              <Image src="src/assets/logos/inext.png" caption="i18Next" ></Image>
            </Anchor>
          </Box>
        </Flex>
        </Container>
      </Box>
    </>
  );
};

export default WelcomePage;
