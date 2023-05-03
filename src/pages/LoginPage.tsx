import { useTranslation } from 'react-i18next';
import { useForm } from '@mantine/form';
import { FormEvent, useState } from 'react';
import {
  Alert,
  Anchor,
  Box,
  Button,
  Container,
  Paper,
  PasswordInput,
  Space,
  Text,
  TextInput,
} from '@mantine/core';
import { upperFirst, useToggle } from '@mantine/hooks';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { t } = useTranslation();
  const [type, toggle] = useToggle(['register', 'login']);

  //return <>{t('loginPage')}</>;

  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
    },
  });

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !password) {
      setError('Please enter your username and password.');
      return;
    }

    setError('');

    // TODO: send the login request
    console.log('Logging in...');
  };

  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/');
  };

  return (
    <Container size={520} my={100}>
      <Anchor component="button" size="lg" align="left" onClick={handleClick}>
        ← Back to welcome page
      </Anchor>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Text size="xl" component="h1" ta="center">
          {type === 'register' ? 'Register' : 'Login'}
        </Text>
        {error && (
          <Alert title="Error!" sx={{ my: 2 }}>
            {error}
          </Alert>
        )}
        <Space h="md" />
        <form onSubmit={onSubmit}>
          <TextInput
            label="Email"
            placeholder="email@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <PasswordInput
            label="Password"
            type="password"
            required
            placeholder="Your password"
            description="Password must include at least one letter, number and special character"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {type === 'register' && (
            <>
              <PasswordInput
                label="Repeat password"
                type="password"
                required
                placeholder="Repeat your password"
                style={{ width: '100%' }}
              />
              <Space h="md" />
            </>
          )}
          {type === 'login' && (
            <Anchor component="button" size="sm">
              Forgot password?
            </Anchor>
          )}
          <Button type="submit" fullWidth>
            {upperFirst(type)}
          </Button>
        </form>

        {type === 'login' ? (
          <Box sx={{ mt: 2 }}>
            Don't have an account yet?{' '}
            <Anchor td="underline" c="blue" onClick={() => toggle()}>
              Register
            </Anchor>
          </Box>
        ) : (
          <Box sx={{ mt: 2 }}>
            Already have an account?{' '}
            <Anchor td="underline" c="blue" onClick={() => toggle()}>
              Login
            </Anchor>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default LoginPage;
