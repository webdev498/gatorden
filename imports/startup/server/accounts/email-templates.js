import { Accounts } from 'meteor/accounts-base';

const name = 'GATOR DEN';
const email = '<support@application.com>';
const from = `${name} ${email}`;
const emailTemplates = Accounts.emailTemplates;

emailTemplates.siteName = name;
emailTemplates.from = from;

emailTemplates.resetPassword = {
  subject() {
    return `[${name}] Reset Your Password`;
  },
  text(user, url) {
    const userEmail = user.emails[0].address;
    const urlWithoutHash = url.replace('#/', '');

    return `A password reset has been requested for the account related to this
    address (${userEmail}). To reset the password, visit the following link:
    \n\n${urlWithoutHash}\n\n If you did not request this reset, please ignore
    this email. If you feel something is wrong, please contact our support team:
    ${email}.`;
  },
};

Accounts.onCreateUser((options, user) => {
  if (! user.services.google) {
    return user;
  }

  const { family_name, given_name, email } = user.services.google;
  user.profile = {
    name: {
      first: given_name,
      last: family_name
    }
  }
  // user.profile.name.first = given_name[0];
  // user.profile.name.last = family_name[0];
  user.emails = [{ address: email, verified: true}];
  // user.initials = first_name[0].toUpperCase() + last_name[0].toUpperCase();
  // We still want the default hook's 'profile' behavior.
  // if (options.profile) {
  //   user.profile = options.profile;
  // }
  
  // Don't forget to return the new user object at the end!
  return user;

  return user;
});
