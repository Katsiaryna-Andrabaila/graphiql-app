import { createStyles, Text, Container, ActionIcon, Group, rem, Image } from '@mantine/core';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import GraphQLIcon from '../../assets/graphql-ar21.svg'
import { MembersData } from './MembersLinks';

import { TeamMember } from '../../types/types';

const useStyles = createStyles((theme) => ({
  footer: {
    marginTop: rem(120),
    paddingTop: `calc(${theme.spacing.xl} * 2)`,
    paddingBottom: `calc(${theme.spacing.xl} * 2)`,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
  },

  logo: {
    maxWidth: rem(200),

    [theme.fn.smallerThan('sm')]: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
  },

  footerLogo: {
    width: 86,
    height: 43,
  },

  description: {
    marginTop: rem(5),

    [theme.fn.smallerThan('sm')]: {
      marginTop: theme.spacing.xs,
      textAlign: 'center',
    },
  },

  inner: {
    display: 'flex',
    justifyContent: 'space-between',

    [theme.fn.smallerThan('sm')]: {
      flexDirection: 'column',
      alignItems: 'center',
    },
  },

  wrapper: {
    width: rem(180),
  },

  link: {
    display: 'inline',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[6],
    fontSize: theme.fontSizes.sm,
    paddingTop: rem(3),
    paddingBottom: rem(3),

    '&:hover': {
      textDecoration: 'underline',
    },
  },

  afterFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
    }`,

    [theme.fn.smallerThan('sm')]: {
      flexDirection: 'column',
    },
  },

  social: {
    [theme.fn.smallerThan('sm')]: {
      marginTop: theme.spacing.xs,
    },
  },
}));

export function Footer() {
  const { t } = useTranslation();
  const { classes } = useStyles();
  const data: Array<TeamMember> = t('teamArray', { returnObjects: true })

  return (
    <footer className={classes.footer}>
      <Container className={classes.inner}>
        <div className={classes.logo}>
          <ActionIcon component={Link} to="/" className={classes.footerLogo}>
            <Image src={GraphQLIcon} alt="GraphQL icon" />
          </ActionIcon>
          <Text size="xs" color="dimmed" className={classes.description}>
            {t('footer.iconText')}
          </Text>
        </div>
        <MembersData data={data} />
      </Container>
      <Container className={classes.afterFooter}>
        <Text color="dimmed" size="sm">
          {t('footer.rightsText')}
        </Text>
        <Group className={classes.social} position="right">
          <ActionIcon size="xl" component={Link} to="https://rs.school/react/">
            <Image src="https://rs.school/images/rs_school_js.svg" alt="Rs school icon" />
          </ActionIcon>
        </Group>
      </Container>
    </footer>
  );
}
