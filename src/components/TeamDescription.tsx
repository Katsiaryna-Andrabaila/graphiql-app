import { Text, Title, Flex, Container, Image } from '@mantine/core';
import { TeamMember } from '../types/types';

export const TeamDescription = (data: Array<TeamMember>) => {
  const membersJSX = data.map((member, index) => {
    return (
      <Container key={index}>
        <Title order={3} color="#311C87" fw={700}>
          {member.name}
        </Title>
        <Title order={4} fw={600}>
          {member.role}
        </Title>
        <Image maw={240} mx="auto" radius="md" src="./" alt="Team member photo" />
        <Text></Text>
      </Container>
    );
  });
  return (
    <Flex
      direction={{ base: 'column', sm: 'row' }}
      gap={{ base: 'sm', sm: 'lg' }}
      justify={{ sm: 'space-between' }}
    >
      {membersJSX}
    </Flex>
  );
};
