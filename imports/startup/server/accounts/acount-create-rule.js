import { Accounts } from 'meteor/accounts-base';

Accounts.onCreateUser((options, user) => {
  console.log('User and Options :', user, options);
    user.active = 'No';

    if (options.profile) {
      user.profile = options.profile;
    }

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
    user.emails = [{ address: email, verified: true}];
    
    // Don't forget to return the new user object at the end!
    return user;
  });
  