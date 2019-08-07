import { GraphQLObjectType } from 'graphql';

import UserMutations from '../modules/user/mutation';
import TweetMutations from '../modules/tweet/mutation';

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    ...UserMutations,
    ...TweetMutations,
  }),
});
