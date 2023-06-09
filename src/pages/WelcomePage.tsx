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
} from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import { TeamDescription } from '../components/TeamDescription';
import { AppContext } from '../HOC/Provider';
import { useContext } from 'react';
import { TeamMember } from '../types/types';
import { Technologies } from '../components/technologies/technologies';
import { useMediaQuery } from '@mantine/hooks';
import { useAuth } from '../utils/firebase';

const useStyles = createStyles(() => ({
  button: {
    '&:hover': {
      color: 'white',
    },
  },
}));

const WelcomePage = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { classes } = useStyles();
  const data: Array<TeamMember> = t('teamArray', { returnObjects: true });
  const navigate = useNavigate();
  const { handleClickLogin, handleClickRegister } = useContext(AppContext);
  const { colorScheme } = useMantineColorScheme();
  const smallScreen = useMediaQuery('(max-width: 48em)');

  return (
    <>
      <Box
        p={smallScreen ? 'xs' : 'xl'}
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
            mb={smallScreen ? 20 : 40}
          >
            {t('welcomePage.title')}
          </Title>
          <Text fz="xl" ta="center" align="center" mx="auto" mb={smallScreen ? 20 : 30} fw={600}>
            {t('welcomePage.mainText')}
          </Text>
          <Center mb={smallScreen ? 20 : 30}>
            {user ? (
              <Button component={Link} to="/" className={classes.button}>
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
          <Title order={2} pb="1rem">
            {t('welcomePage.team')}
          </Title>
          <TeamDescription data={data} />
        </Container>
        <Container>
          <Title order={2} pb="1rem">
            {t('welcomePage.technologies')}
          </Title>
          <Technologies />
        </Container>
      </Box>
    </>
  );
};

export default WelcomePage;
