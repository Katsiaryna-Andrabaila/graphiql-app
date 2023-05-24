import { createStyles, Text, rem, Anchor, Flex } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconBrandGithub } from '@tabler/icons-react';
import { MembersDataProps } from '../../types/types';

const useStyles = createStyles((theme) => ({
  wrapper: {
    // width: rem(180),
  },

  link: {
    display: 'inline',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[6],
    fontSize: theme.fontSizes.sm,
    paddingTop: rem(2),
    paddingBottom: rem(2),
    whiteSpace: 'nowrap',

    '&:hover': {
      textDecoration: 'underline',
    },
  },
}));

export const MembersData = ({ data }: MembersDataProps) => {
  const { classes } = useStyles();
  const mobile = useMediaQuery('(max-width: 48em)');
  const membersJSX = data.map((member, index) => {
    return (
      <Anchor color="black" href={member.link} className={classes.link} key={index}>
        <Flex justify="center" align="center">
          <IconBrandGithub />
          <Text>{member.name}</Text>
        </Flex>
      </Anchor>
    );
  });
  return (
    <Flex
      className={classes.wrapper}
      gap="md"
      justify="center"
      align="flex-start"
      direction={mobile ? "row" : "column"}
      wrap="wrap"
    >
      {membersJSX}
    </Flex>
  );
};
