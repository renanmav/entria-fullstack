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
  mutation createTweet(
    $content: String!
  ) {
    TweetCreate(input: {
      content: $content
    }) {
      error
    }
  }
`;
const rootValue = {};

describe('When the user is unauthenticated', () => {
  it('should not create a tweet', async () => {
    const context = getContext();
    const variables = {
      content: "This tweet won't be saved because the user is unauthenticated",
    };

    const result = await graphql(schema, query, rootValue, context, variables);
    expect(result.data.TweetCreate.error).toBe('User not authenticated');
  });
});

describe('When the user is authenticated', () => {
  it('should not create a tweet without content', async () => {
    const me = await createRows.createUser();
    const context = getContext({ user: me });
    const variables = {
      content: '',
    };

    const result = await graphql(schema, query, rootValue, context, variables);
    expect(result.errors[0].message).toBe(
      'Tweet validation failed: content: Path `content` is required.',
    );
  });

  it('should create a tweet with content', async () => {
    const me = await createRows.createUser();
    const context = getContext({ user: me });
    const variables = {
      content: 'This tweet will be saved because the user is authenticated',
    };

    const result = await graphql(schema, query, rootValue, context, variables);
    expect(result.data.TweetCreate.error).toBe(null);
  });
});
