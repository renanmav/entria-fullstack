import { GraphQLObjectType } from 'graphql';
import { offsetToCursor } from 'graphql-relay';

import { TweetConnection } from '../TweetType';
import pubSub, { EVENTS } from '../../../pubSub';
import { ITweet } from '../TweetModel';

const LikeTweetPayloadType = new GraphQLObjectType({
  name: 'LikeTweetPayload',
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

const likeTweetSubscription = {
  type: LikeTweetPayloadType,
  // @ts-ignore
  subscribe: () => pubSub.asyncIterator(EVENTS.TWEET.LIKE),
};

export default likeTweetSubscription;
