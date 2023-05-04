import { useTranslation } from 'react-i18next';
import { Text, Center, Button, Title, Flex, Container, Image, Group, Anchor, createStyles } from '@mantine/core';
import { Link } from 'react-router-dom';
import { IconBrandGithub } from '@tabler/icons-react';
import { TeamDescription } from '../components/TeamDescription';

const useStyles = createStyles(() => ({
  button: {
    '&:hover': {
      color: 'white',
    },
  },
}));

const WelcomePage = () => {
  const { t } = useTranslation();
  const { classes } = useStyles();
  const data: Array<{}> = t('teamArray', { returnObjects: true })
  const team = TeamDescription(data)

  return <Container p="xl" sx={{
    background: 'linear-gradient(180deg, #CD8FFF -20.03%, rgba(255, 226, 202, 0.59) 32.42%, #fff 61.98%)'
  }}>

    <Container p="xl" mx="auto">
    <Title
     order={1}
     variant="gradient"
     gradient={{ from: 'indigo', to: 'red', deg: 45 }}
     mb={40}
     
    >
      {t('welcomePageHeader')}
    </Title>
      <Text fz="xl" ta="center" align='center' mx="auto" mb={30} fw={600}>{t('welcomePageMainText')}</Text>
      <Center mb={30}>
        <Container>
        <Group>
      <Button component={Link} to="/" className={classes.button}>
      Sign In
    </Button>
      <Button component={Link} to="/" className={classes.button}>
      Sign Up
    </Button>
        </Group>
        </Container>
        <Button component={Link} to="/redactor" className={classes.button}>
      {t('playground')}
    </Button>
      </Center>
      <Title>
      {t('team')}
      </Title>
        {team}
      </Container>
    </Container>;
};

export default WelcomePage;
