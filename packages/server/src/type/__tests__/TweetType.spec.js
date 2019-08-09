import { graphql } from 'graphql';

import { schema } from '../../schema';
import {
  getContext,
  connectMongoose,
  clearDbAndRestartCounters,
  disconnectMongoose,
  createRows,
} from '../../../test/helper';

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);

const query = `
  query fetchOneTweet {
    tweets {
      edges {
        node {
          content
          author {
            email
          }
        }
      }
    }
  }
`;
const rootValue = {};

describe('When user is unauthenticated', () => {
  it('it should not retrieve author private fields', async () => {
    await createRows.createTweet();

    const context = getContext();

    const result = await graphql(schema, query, rootValue, context);
    const { edges } = result.data.tweets;

    expect(edges[0].node.author.email).toBeNull();
    expect(edges[0].node.content).toBeTruthy();
  });
});

describe('When user is authenticated', () => {
  it('it should retrieve author private fields if he is the author', async () => {
    const user = await createRows.createUser();
    const userB = await createRows.createUser();
    await createRows.createTweet({ author: user._id });
    await createRows.createTweet({ author: userB._id });

    const context = getContext({ user });

    const result = await graphql(schema, query, rootValue, context);
    const { edges } = result.data.tweets;

    // returns backwards (createdAt: -1)
    expect(edges[1].node.author.email).toBeTruthy();
    expect(edges[0].node.author.email).toBeNull();
  });
});
