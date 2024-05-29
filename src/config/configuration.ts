export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    uri: process.env.DATABASE_URI,
  },
  keys: {
    privateKey: process.env.PRIVATE_KEY.replace(/\\n/gm, '\n'),
    publicKey: process.env.PUBLIC_KEY.replace(/\\n/gm, '\n'),
    secret: '123456',
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USERNAME: process.env.SMTP_USERNAME,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  },
});
