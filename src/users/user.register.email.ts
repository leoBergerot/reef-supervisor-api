import { User } from './user.entity';

export const registerEmail = async (user: User, token: string) => {
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
            'Subject': 'Reef Supervisor - Enable your account',
            'HTMLPart': `<h3>Dear ${user.firstName} ${user.lastName}</h3><br />To enable your account click <a href="${process.env.BACKEND_URL}/users/${user.id}/enable/${token}">here</a>`,
          },
        ],
      });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};