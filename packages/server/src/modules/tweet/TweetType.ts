import { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLInt } from 'graphql';

import { globalIdField } from 'graphql-relay';
import { registerType, nodeInterface } from '../../interface/NodeInterface';
import { ITweet } from './TweetModel';

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
    }),
    interfaces: () => [nodeInterface],
  }),
);

export default TweetType;
