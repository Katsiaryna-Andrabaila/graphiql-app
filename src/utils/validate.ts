export const validateEmail = (email: string) => (email ? /.+@.+\..+/i.test(email) : false);

export const validatePassword = (password: string) =>
  password
    ? /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[0-9a-zA-Z!@#$%^&*]{8,}/.test(password)
    : false;
