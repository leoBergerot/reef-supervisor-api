import { User } from '../users/user.entity';

export const recoverPasswordEmail = async (user: User, token: string) => {
  const mailjet = require('node-mailjet')
    .connect(process.env.MAILJET_API_KEY, process.env.MAILJET_SECRET);
  try {
    await mailjet
      .post('send', { 'version': 'v3.1' })
      .request({
        'Messages': [
          {
            'From': {
              'Email': process.env.EMAIL_SENDER,
              'Name': 'Reef Supervisor',
            },
            'To': [
              {
                'Email': user.email,
                'Name': user.firstName,
              },
            ],
            'Subject': 'Reef Supervisor - Recover password',
            'HTMLPart': `<h3>Dear ${user.firstName} ${user.lastName}</h3><br />To recover your password click <a href="${process.env.FRONTEND_URL}/recover-password/${user.id}/${token}">here</a>`,
          },
        ],
      });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};