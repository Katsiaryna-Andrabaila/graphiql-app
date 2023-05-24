import { Anchor, Box, createStyles, Flex, Image } from '@mantine/core';
import data from './technologies.json';

const useStyles = createStyles((theme) => ({
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

export const Technologies = () => {
  const { classes } = useStyles();
  const tech = data.data.map((el, index) => {
    return (
      <Box className={classes.technology} key={index}>
        <Anchor href={el.link}>
          <Image src={el.src} caption={el.title}></Image>
        </Anchor>
      </Box>
    );
  });
  return (
    <Flex gap="3.2rem" justify="center" align="center" wrap="wrap" pb="3rem">
      {tech}
    </Flex>
  );
};
