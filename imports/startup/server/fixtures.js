import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Accounts } from 'meteor/accounts-base';
import { ServiceConfiguration } from 'meteor/service-configuration';

if (!Meteor.isProduction) {
  const users = [{
    email: 'admin@admin.com',
    password: 'password',
    profile: {
      name: { first: 'Carl', last: 'Winslow' },
    },
    roles: ['admin'],
  }];

  users.forEach(({ email, password, profile, roles }) => {
    const userExists = Meteor.users.findOne({ 'emails.address': email });

    if (!userExists) {
      const userId = Accounts.createUser({ email, password, profile });
      Roles.addUsersToRoles(userId, roles);
    }
  });

  //Set the admin roles to specific users
  stanUserId = '3SvTB9mBoPeQRRm4v';
  Roles.addUsersToRoles(stanUserId, 'admin', Roles.GLOBAL_GROUP);
}

const settings = Meteor.settings.google;

if (settings) {  
  ServiceConfiguration.configurations.remove({
    service: 'google'
  });

  ServiceConfiguration.configurations.insert({
    service: 'google',
    clientId: settings.clientId,
    secret: settings.secret
  });
}
