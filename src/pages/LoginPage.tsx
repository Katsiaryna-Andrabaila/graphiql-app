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
import { validateEmail, validatePassword } from '../utils/validate';
import {
  createUser,
  forgotPassword,
  signInUser,
  signInWithGooggleAccount,
} from '../utils/firebase';
import { startSession } from '../utils/storage';
import { IconAlertCircle, IconBrandGoogle } from '@tabler/icons-react';
import { AppContext } from '../HOC/Provider';

const LoginPage = () => {
  const { t } = useTranslation();
  const { isLogin, setIsAuth } = useContext(AppContext);

  const [type, toggle] = !isLogin
    ? useToggle([`${t('registerLink')}`, `${t('loginLink')}`])
    : useToggle([`${t('loginLink')}`, `${t('registerLink')}`]);

  const [isReset, setReset] = useState(false);
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
      navigate('/', { replace: true });
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        setError(error.message);
      }
    }
  };

  const signInWithGoogle = async () => {
    try {
      const registerResponse = await signInWithGooggleAccount();
      startSession(registerResponse.user);
      setIsAuth && setIsAuth(true);
      navigate('/', { replace: true });
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        setError(error.message);
      }
    }
  };

  const navigate = useNavigate();

  return (
    <>
      <Container size={560} my={100}>
        <Anchor component="button" size="lg" align="left" onClick={() => navigate('/welcome')}>
          {t('backToMain')}
        </Anchor>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <Text size="xl" component="h1" ta="center">
            {isReset
              ? `${t('resetTitle')}`
              : type === `${t('registerLink')}`
              ? `${t('registerLink')}`
              : `${t('loginLink')}`}
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
            {!isReset && (
              <PasswordInput
                label={t('password')}
                required
                placeholder="********"
                description={type === `${t('registerLink')}` ? t('passwordDescription') : ''}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            )}
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
            {type === `${t('loginLink')}` && !isReset && (
              <Anchor component="button" size="sm" onClick={() => setReset(!isReset)}>
                {t('forgotPassword')}
              </Anchor>
            )}
            {!isReset && (
              <Button type="submit" fullWidth>
                {upperFirst(type)}
              </Button>
            )}
          </form>
          {type === `${t('loginLink')}` && !isReset && (
            <Button onClick={signInWithGoogle} fullWidth mt={10} rightIcon={<IconBrandGoogle size={18} />}>
              {t('signWithGoogle')}
            </Button>
          )}
          {isReset && (
            <Button onClick={() => forgotPassword(email)} fullWidth mt={10}>
              {t('resetPassword')}
            </Button>
          )}
          <Box sx={{ mt: 2 }}>
            {type === `${t('loginLink')}` ? `${t('notHaveAccount')}` : `${t('haveAccount')}`}
            <Anchor
              td="underline"
              c="blue"
              onClick={() => {
                toggle();
                setReset(false);
              }}
            >
              {type === `${t('loginLink')}` ? `${t('registerLink')}` : `${t('loginLink')}`}
            </Anchor>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default LoginPage;
