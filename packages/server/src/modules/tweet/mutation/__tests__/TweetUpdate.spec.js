import { graphql } from 'graphql';

import { schema } from '../../../../schema';
import {
  getContext,
  connectMongoose,
  clearDbAndRestartCounters,
  disconnectMongoose,
  createRows,
} from '../../../../../test/helper';

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);

const query = `
  mutation updateTweet(
    $id: ID!
    $like: Boolean
    $retweet: Boolean
  ) {
    TweetUpdate(input: {
      id: $id,
      like: $like,
      retweet: $retweet
    }) {
      error
      likes
      retweets
    }
  }
`;
const rootValue = {};

describe('When the user is unauthenticated', () => {
  it('should not update a tweet', async () => {
    const { id } = await createRows.createTweet();

    const context = getContext();
    const variables = {
      id,
      like: true,
    };

    const result = await graphql(schema, query, rootValue, context, variables);
    expect(result.data.TweetUpdate.error).toBe('User not authenticated');
    expect(result.data.TweetUpdate.likes).toBeNull();
  });
});

describe('When the user is authenticated', () => {
  it('should like a tweet', async () => {
    const user = await createRows.createTweet();
    const { id } = await createRows.createTweet();

    const context = getContext({ user });
    const variables = {
      id,
      like: true,
    };

    const result = await graphql(schema, query, rootValue, context, variables);
    expect(result.data.TweetUpdate.likes).toBe(1);
  });

  it('should retweet a tweet', async () => {
    const user = await createRows.createTweet();
    const { id } = await createRows.createTweet();

    const context = getContext({ user });
    const variables = {
      id,
      retweet: true,
    };

    const result = await graphql(schema, query, rootValue, context, variables);
    expect(result.data.TweetUpdate.retweets).toBe(1);
  });
});
