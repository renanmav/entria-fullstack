import { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLID, GraphQLList } from 'graphql';
import { connectionArgs, fromGlobalId } from 'graphql-relay';

import UserType, { UserConnection } from '../modules/user/UserType';
import { nodeField } from '../interface/NodeInterface';
import { UserLoader } from '../loader';
import TweetType from '../modules/tweet/TweetType';
import TweetModel from '../modules/tweet/TweetModel';

export default new GraphQLObjectType({
  name: 'Query',
  description: 'The root of all... queries',
  fields: () => ({
    node: nodeField,
    me: {
      type: UserType,
      resolve: (root, args, context) => (context.user ? UserLoader.load(context, context.user._id) : null),
    },
    user: {
      type: UserType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve: (obj, args, context) => {
        const { id } = fromGlobalId(args.id);
        return UserLoader.load(context, id);
      },
    },
    users: {
      type: UserConnection.connectionType,
      args: {
        ...connectionArgs,
        search: {
          type: GraphQLString,
        },
      },
      resolve: (obj, args, context) => UserLoader.loadUsers(context, args),
    },
    tweets: {
      type: GraphQLList(TweetType),
      resolve: () => TweetModel.find(),
    },
  }),
});
