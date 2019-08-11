import { GraphQLObjectType } from 'graphql';
import { offsetToCursor } from 'graphql-relay';

import { TweetConnection } from '../TweetType';
import pubSub, { EVENTS } from '../../../pubSub';
import { ITweet } from '../TweetModel';

const NewTweetPayloadType = new GraphQLObjectType({
  name: 'NewTweetPayload',
  fields: () => ({
    tweetEdge: {
      type: TweetConnection.edgeType,
      resolve: (tweet: ITweet) => ({
        cursor: offsetToCursor(tweet.id),
        node: tweet,
      }),
    },
  }),
});

const newTweetSubscription = {
  type: NewTweetPayloadType,
  // @ts-ignore
  subscribe: () => pubSub.asyncIterator(EVENTS.TWEET.NEW),
};

export default newTweetSubscription;
