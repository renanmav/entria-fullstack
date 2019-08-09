import { mutationWithClientMutationId } from 'graphql-relay';
import { GraphQLNonNull, GraphQLString, GraphQLInt } from 'graphql';
import TweetModel, { ITweet } from '../TweetModel';
import { GraphQLContext } from '../../../TypeDefinition';
import UserType from '../../user/UserType';

interface TweetCreateInput {
  content: string;
  clientMutationId: string;
}

interface TweetCreatePayload extends ITweet {
  error: string;
}

export default mutationWithClientMutationId({
  name: 'TweetCreate',
  description: 'Used to create a tweet',
  inputFields: {
    content: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async ({ content }: TweetCreateInput, { user }: GraphQLContext) => {
    if (!user) {
      return {
        error: 'User not authenticated',
      };
    }

    const tweet = new TweetModel({
      content,
    });

    tweet.author = user;

    return tweet.save();
  },
  outputFields: {
    content: {
      type: GraphQLString,
      resolve: ({ content }: TweetCreatePayload) => content,
    },
    likes: {
      type: GraphQLInt,
      resolve: ({ likes }: TweetCreatePayload) => likes,
    },
    retweets: {
      type: GraphQLInt,
      resolve: ({ retweets }: TweetCreatePayload) => retweets,
    },
    author: {
      type: UserType,
      resolve: ({ author }: TweetCreatePayload) => author,
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }: TweetCreatePayload) => error,
    },
  },
});
