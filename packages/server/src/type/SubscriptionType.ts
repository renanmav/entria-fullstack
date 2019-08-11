// external imports
import { GraphQLObjectType } from 'graphql';

import UserSubscriptions from '../modules/user/subscription';
import TweetSubscriptions from '../modules/tweet/subscription';

export default new GraphQLObjectType({
  name: 'Subscription',
  fields: {
    ...UserSubscriptions,
    ...TweetSubscriptions,
  },
});
