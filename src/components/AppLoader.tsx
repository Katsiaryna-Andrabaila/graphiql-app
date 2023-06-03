import { Center, Loader } from '@mantine/core';

export const AppLoader = () => {
  return (
    <Center maw={400} h="100vh" mx="auto">
      <Loader size="xl" variant="dots" />
    </Center>
  );
};
