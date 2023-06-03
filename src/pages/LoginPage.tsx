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
import { createUser, forgotPassword, signInUser, signInWithGoogleAccount } from '../utils/firebase';
import { IconAlertCircle, IconBrandGoogle, IconCheck } from '@tabler/icons-react';
import { AppContext } from '../HOC/Provider';
import { notifications } from '@mantine/notifications';

const LoginPage = () => {
  const { t } = useTranslation();
  const { isLogin } = useContext(AppContext);

  const [type, toggle] = useToggle(
    !isLogin
      ? [`${t('registerLink')}`, `${t('loginLink')}`]
      : [`${t('loginLink')}`, `${t('registerLink')}`]
  );

  const [isReset, setReset] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeated, setPasswordRepeated] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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

    notifications.show({
      id: type === `${t('registerLink')}` ? `sign-up` : `sign-in`,
      loading: true,
      title:
        type === `${t('registerLink')}`
          ? `${t('notifications.signUpTittle')}`
          : `${t('notifications.signInTittle')}`,
      message: `${t('notifications.waitMessage')}`,
      autoClose: false,
    });

    setError('');

    try {
      if (type === `${t('registerLink')}`) {
        await createUser(email, password);
      } else {
        await signInUser(email, password);
      }
      notifications.update({
        id: type === `${t('registerLink')}` ? `sign-up` : `sign-in`,
        title:
          type === `${t('registerLink')}`
            ? `${t('notifications.signUpTittleComplete')}`
            : `${t('notifications.signInTittleComplete')}`,
        message: `${t('notifications.completeMessage')}`,
        icon: <IconCheck size="1rem" />,
        autoClose: 2000,
      });
      navigate('/', { replace: true });
    } catch (error) {
      if (error instanceof Error) {
        notifications.clean();
        setError(error.message);
      }
    }
  };

  const signInWithGoogle = async () => {
    notifications.show({
      id: 'google',
      loading: true,
      title: `${t('notifications.signInWithGoogleTitle')}`,
      message: `${t('notifications.waitMessage')}`,
      autoClose: false,
    });
    try {
      await signInWithGoogleAccount();
      notifications.update({
        id: 'google',
        title: `${t('notifications.signInTittleComplete')}`,
        message: `${t('notifications.completeMessage')}`,
        icon: <IconCheck size="1rem" />,
        autoClose: 2000,
      });

      navigate('/', { replace: true });
    } catch (error) {
      if (error instanceof Error) {
        notifications.clean();
        setError(error.message);
      }
    }
  };

  const resetPassword = async () => {
    setError('');
    if (!email || !validateEmail(email)) {
      setError(`${t('emailError')}`);
      return;
    }
    notifications.show({
      id: 'reset',
      loading: true,
      title: `${t('notifications.resetTitle')}`,
      message: `${t('notifications.waitMessage')}`,
      autoClose: false,
    });
    try {
      setError('');
      await forgotPassword(email);
      notifications.update({
        id: 'reset',
        title: `${t('notifications.resetTitleComplete')}`,
        message: `${t('notifications.resetMessage')}`,
        autoClose: 3000,
        icon: <IconCheck />,
      });
    } catch (error) {
      if (error instanceof Error) {
        notifications.clean();
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
          <form onSubmit={handleSubmit}>
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
              <Anchor
                component="button"
                size="sm"
                onClick={() => {
                  setReset(!isReset);
                  setError('');
                }}
              >
                {t('forgotPassword')}
              </Anchor>
            )}
            {!isReset && (
              <Button type="submit" fullWidth>
                {upperFirst(type)}
              </Button>
            )}
          </form>
          {!isReset && (
            <Button
              onClick={signInWithGoogle}
              fullWidth
              mt={10}
              rightIcon={<IconBrandGoogle size={18} />}
            >
              {t('signWithGoogle')}
            </Button>
          )}
          {isReset && (
            <Button onClick={resetPassword} fullWidth mt={10}>
              {t('resetPassword')}
            </Button>
          )}
          <Box sx={{ mt: 2 }}>
            {type === `${t('loginLink')}` ? `${t('notHaveAccount')}` : `${t('haveAccount')}`}
            <Anchor
              td="underline"
              c="blue"
              onClick={() => {
                setError('');
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
