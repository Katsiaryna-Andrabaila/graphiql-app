import { useTranslation } from 'react-i18next';
import { FormEvent, useContext, useState } from 'react';
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
import { AppContext } from '../utils/context';
import { validateEmail, validatePassword } from '../utils/validate';
import { createUser, signInUser } from '../utils/firebase';
import { startSession } from '../utils/storage';
import { IconAlertCircle } from '@tabler/icons-react';

const LoginPage = () => {
  const { t } = useTranslation();
  const isLogin = useContext(AppContext)?.isLogin;
  const setIsAuth = useContext(AppContext)?.setIsAuth;
  const [type, toggle] =
    isLogin === false
      ? useToggle([`${t('registerLink')}`, `${t('loginLink')}`])
      : useToggle([`${t('loginLink')}`, `${t('registerLink')}`]);

  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeated, setPasswordRepeated] = useState('');

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !validateEmail(email)) {
      setError(`${t('emailError')}`);
      return;
    }

    if (!password || !validatePassword(password)) {
      setError(`${t('passwordError')}`);
      return;
    }

    if (type === `${t('registerLink')}` && (!passwordRepeated || passwordRepeated !== password)) {
      setError(`${t('repeatPasswordError')}`);
      return;
    }

    setError('');

    try {
      if (type === `${t('registerLink')}`) {
        const registerResponse = await createUser(email, password);
        startSession(registerResponse.user);
      } else {
        const loginResponse = await signInUser(email, password);
        startSession(loginResponse.user);
      }
      setIsAuth && setIsAuth(true);
      navigate('/');
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        setError(error.message);
      }
    }
  };

  const navigate = useNavigate();

  return (
    <Container size={560} my={100}>
      <Anchor component="button" size="lg" align="left" onClick={() => navigate('/')}>
        ← Back to welcome page
      </Anchor>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Text size="xl" component="h1" ta="center">
          {type === `${t('registerLink')}` ? `${t('registerLink')}` : `${t('loginLink')}`}
        </Text>
        {error && (
          <Alert
            icon={<IconAlertCircle size="1rem" />}
            sx={{ my: 2 }}
            color="red"
            variant="outline"
          >
            {error}
          </Alert>
        )}
        <Space h="md" />
        <form onSubmit={onSubmit}>
          <TextInput
            label={t('email')}
            placeholder="email@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <PasswordInput
            label={t('password')}
            required
            placeholder="********"
            description={t('passwordDescription')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {type === `${t('registerLink')}` && (
            <>
              <PasswordInput
                label={t('repeatPassword')}
                required
                placeholder="********"
                value={passwordRepeated}
                onChange={(e) => setPasswordRepeated(e.target.value)}
              />
              <Space h="md" />
            </>
          )}
          {type === `${t('loginLink')}` && (
            <Anchor component="button" size="sm">
              {t('forgotPassword')}
            </Anchor>
          )}
          <Button type="submit" fullWidth>
            {upperFirst(type)}
          </Button>
        </form>

        <Box sx={{ mt: 2 }}>
          {type === `${t('loginLink')}` ? `${t('notHaveAccount')}` : `${t('haveAccount')}`}
          <Anchor td="underline" c="blue" onClick={() => toggle()}>
            {type === `${t('loginLink')}` ? `${t('registerLink')}` : `${t('loginLink')}`}
          </Anchor>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
