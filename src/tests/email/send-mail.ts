/* eslint-disable no-debugger, no-console */

import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

/* Test local smtp server.
 * Run it via:
 * python -m smtpd -c DebuggingServer -n localhost:1025
 */

dotenv.config();

const {
  // ...
  EMAIL_FROM_NAME,
  EMAIL_FROM,
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_USE_SSL,
  EMAIL_HOST_USER,
  EMAIL_HOST_PASSWORD,
} = process.env;

console.log('Got configuration', {
  EMAIL_FROM_NAME,
  EMAIL_FROM,
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_USE_SSL,
  EMAIL_HOST_USER,
  EMAIL_HOST_PASSWORD,
});

async function main() {
  if (
    !EMAIL_FROM ||
    !EMAIL_HOST ||
    !EMAIL_FROM ||
    !EMAIL_PORT ||
    !EMAIL_HOST_USER ||
    !EMAIL_HOST_PASSWORD
  ) {
    throw new Error('Some required environment variables are undefined!');
  }
  try {
    const transporter = nodemailer.createTransport({
      host: EMAIL_HOST, // 'localhost',
      port: Number(EMAIL_PORT), // 1025,
      secure: !!EMAIL_USE_SSL,
      auth: {
        user: EMAIL_HOST_USER,
        pass: EMAIL_HOST_PASSWORD,
      },
      tls: {
        // minVersion: 'TLSv1.3',
        rejectUnauthorized: false,
      },
    });
    const res = await transporter.sendMail({
      from: `"${EMAIL_FROM_NAME}" <${EMAIL_FROM || EMAIL_HOST_USER}>`,
      to: 'lilliputten@gmail.com',
      // to: 'dmia@yandex.ru',
      subject: 'Email test',
      text: 'The test email message.',
    });

    console.log('[send-mail] done', res.response, {
      res,
    });
    debugger;
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error('[send-mail]', errMsg, { error });
    debugger;
    // throw error;
  }
}

main().catch(console.error);
