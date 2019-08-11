import { GraphQLObjectType } from 'graphql';
import { offsetToCursor } from 'graphql-relay';

import { TweetConnection } from '../TweetType';
import pubSub, { EVENTS } from '../../../pubSub';
import { ITweet } from '../TweetModel';

const RetweetTweetPayloadType = new GraphQLObjectType({
  name: 'RetweetTweetPayload',
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

const retweetTweetSubscription = {
  type: RetweetTweetPayloadType,
  // @ts-ignore
  subscribe: () => pubSub.asyncIterator(EVENTS.TWEET.RETWEET),
};

export default retweetTweetSubscription;
