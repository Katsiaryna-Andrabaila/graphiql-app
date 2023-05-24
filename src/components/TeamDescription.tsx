import { Text, Title, Flex, Container, Image } from '@mantine/core';
import { MembersDataProps } from '../types/types';

export const TeamDescription = ({data}: MembersDataProps) => {
  const membersJSX = data.map((member, index) => {
    return (
      <Container key={index}>
        <Title order={3} color="#311C87" fw={700} truncate={true} >
          {member.name}
        </Title>
        <Title order={4} fw={600}>
          {member.role}
        </Title>
        <Text></Text>
        <Image mx="auto" radius="100%" width="7rem" height="7rem" src={member.src} alt="Team member photo" withPlaceholder />
      </Container>
    );
  });
  return (
    <Flex
      direction={{ base: 'column', md: 'row' }}
      gap={{ base: 'sm', sm: 'lg' }}
      justify={{ sm: 'space-between' }}
    >
      {membersJSX}
    </Flex>
  );
};
