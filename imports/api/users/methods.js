import Users from './users';
import rateLimit from '../../modules/rate-limit.js';

export const updateUserWithFieldKeyValue = (userId, key, value) => {
    console.log('userid :', userId);
    console.log('key and value :', key, value);
    result = Users.update(userId, 
        { $set: { 'active': value } }
    );

    console.log('update result: ', result);
}

rateLimit({
  methods: [
    updateUserWithFieldKeyValue,
  ],
  limit: 5,
  timeRange: 1000,
});
