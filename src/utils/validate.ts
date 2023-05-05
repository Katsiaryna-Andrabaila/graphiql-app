export const validateEmail = (email: string) => (email ? /.+@.+\..+/i.test(email) : false);

export const validatePassword = (password: string) =>
  password
    ? /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!"#$%&'()*+,-./\\:;<=>?@[\]^_`{|}~])[0-9a-zA-Z!"#$%&'()*+,-./\\:;<=>?@[\]^_`{|}~]{8,}/.test(
        password
      )
    : false;
