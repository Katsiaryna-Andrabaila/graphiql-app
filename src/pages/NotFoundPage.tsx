import { useTranslation } from 'react-i18next';
// import { Text, Title } from '@mantine/core';

// const NotFoundPage = () => {
//   const { t } = useTranslation();

//   return (
//     <>
//       <Title order={3} mt={30} fw={500}>
//         {t('404Page.notFound')}
//         <Text component="a" fw={600} href="/">
//           {t('404Page.mainPage')}
//         </Text>
//       </Title>
//     </>
//   );
// };

// export default NotFoundPage;

import { createStyles, Title, Text, Button, Container, Group, rem } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

const useStyles = createStyles((theme) => ({
  root: {
    paddingTop: rem(80),
    paddingBottom: rem(80),
  },

  label: {
    textAlign: 'center',
    fontWeight: 900,
    fontSize: rem(220),
    lineHeight: 1,
    marginBottom: `calc(${theme.spacing.xl} * 1.5)`,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2],

    [theme.fn.smallerThan('sm')]: {
      fontSize: rem(120),
    },
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    textAlign: 'center',
    fontWeight: 900,
    fontSize: rem(38),

    [theme.fn.smallerThan('sm')]: {
      fontSize: rem(32),
    },
  },

  description: {
    maxWidth: rem(500),
    margin: 'auto',
    marginTop: theme.spacing.xl,
    marginBottom: `calc(${theme.spacing.xl} * 1.5)`,
  },
}));

export const NotFoundPage = () => {
  const { classes } = useStyles();
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Container className={classes.root}>
      <div className={classes.label}>404</div>
      <Title className={classes.title}>{t('404Page.title')}</Title>
      <Text color="dimmed" size="lg" align="center" className={classes.description}>
        {t('404Page.notFound')}
      </Text>
      <Group position="center">
        <Button variant="subtle" size="md" onClick={() => navigate('/')} sx={{ color: '#1971c2' }}>
          {t('404Page.mainPage')}
        </Button>
      </Group>
    </Container>
  );
};
