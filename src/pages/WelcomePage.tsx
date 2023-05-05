import { useTranslation } from 'react-i18next';
import HeaderResponsive from '../components/Header/Header';
import { Text, Center, Button, Title, Container, Group, createStyles, Box } from '@mantine/core';
import { Link } from 'react-router-dom';
import { TeamDescription } from '../components/TeamDescription';
import { Footer } from '../components/Footer/Footer';
import { AppContext } from '../utils/context';
import { useContext } from 'react';
import { TeamMember } from '../types/types';

const useStyles = createStyles(() => ({
  mainContainer: {
    background:
    'linear-gradient(180deg, #CD8FFF -20.03%, rgba(255, 226, 202, 0.59) 32.42%, #fff 61.98%)'
  },

  button: {
    '&:hover': {
      color: 'white',
    },
  },

}));

const WelcomePage = () => {
  const { t } = useTranslation();
  const { classes } = useStyles();
  const data: Array<TeamMember> = t('teamArray', { returnObjects: true });
  const team = TeamDescription(data);
  const { isAuth } = useContext(AppContext);

  return (
    <>
      <HeaderResponsive
        links={[
          { link: '/', label: `${t('homeLink')}` },
          { link: '/redactor', label: `${t('redactorLink')}` },
        ]}
      />
      <Box
        p="xl"
        className={classes.mainContainer}
      >
        <Container p="xl" mx="auto">
          <Title
            order={1}
            variant="gradient"
            gradient={{ from: 'indigo', to: 'red', deg: 45 }}
            mb={40}
          >
            {t('welcomePageHeader')}
          </Title>
          <Text fz="xl" ta="center" align="center" mx="auto" mb={30} fw={600}>
            {t('welcomePageMainText')}
          </Text>
          <Center mb={30}>
            {isAuth ? (
              <Button component={Link} to="/redactor" className={classes.button}>
                {t('playground')}
              </Button>
            ) : (
              <Group>
                <Button component={Link} to="/" className={classes.button}>
                  {t('loginLink')}
                </Button>
                <Button component={Link} to="/" className={classes.button}>
                  {t('signUp')}
                </Button>
              </Group>
            )}
          </Center>
          <Title>{t('team')}</Title>
          {team}
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default WelcomePage;
