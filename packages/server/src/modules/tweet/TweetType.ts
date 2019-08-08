import { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLInt, GraphQLNonNull } from 'graphql';

import { globalIdField } from 'graphql-relay';
import { registerType, nodeInterface } from '../../interface/NodeInterface';
import { ITweet } from './TweetModel';
import { connectionDefinitions } from '../../core/connection/CustomConnectionType';
import UserType from '../user/UserType';

const TweetType = registerType(
  new GraphQLObjectType<ITweet>({
    name: 'Tweet',
    description: 'Tweet data',
    fields: () => ({
      id: globalIdField('Tweet'),
      _id: {
        type: GraphQLID,
        resolve: tweet => tweet._id,
      },
      content: {
        type: GraphQLString,
        resolve: tweet => tweet.content,
      },
      likes: {
        type: GraphQLInt,
        resolve: tweet => tweet.likes,
      },
      retweets: {
        type: GraphQLInt,
        resolve: tweet => tweet.retweets,
      },
      author: {
        type: UserType,
        resolve: (tweet) => {
          console.log(tweet);
          return tweet.author;
        },
      },
    }),
    interfaces: () => [nodeInterface],
  }),
);

export default TweetType;

export const TweetConnection = connectionDefinitions({
  name: 'Tweet',
  // TODO: Implement types in graphql-relay
  // @ts-ignore
  nodeType: GraphQLNonNull(TweetType),
});
