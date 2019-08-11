import { PubSub } from 'graphql-subscriptions';

export const EVENTS = {
  USER: {
    ADDED: 'USER_ADDED',
  },
  TWEET: {
    NEW: 'NEW_TWEET',
    LIKE: 'LIKE_TWEET',
    RETWEET: 'RETWEET_TWEET',
  },
};

export default new PubSub();
