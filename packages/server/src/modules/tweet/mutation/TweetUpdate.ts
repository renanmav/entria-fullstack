import { mutationWithClientMutationId } from 'graphql-relay';
import { GraphQLNonNull, GraphQLID, GraphQLBoolean, GraphQLString, GraphQLInt } from 'graphql';
import { GraphQLContext } from '../../../TypeDefinition';
import TweetModel from '../TweetModel';

interface TweetUpdateInput {
  id: string;
  like: boolean;
  retweet: boolean;
  clientMudationId: string;
}

interface TweetUpdatePayload {
  likes: number | null;
  retweets: number | null;
  error: string | null;
}

export default mutationWithClientMutationId({
  name: 'TweetUpdate',
  description: 'Used to like and retweet a tweet',
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    like: {
      type: GraphQLBoolean,
    },
    retweet: {
      type: GraphQLBoolean,
    },
  },
  mutateAndGetPayload: async (
    { id, like, retweet }: TweetUpdateInput,
    { user }: GraphQLContext,
  ) => {
    if (!user) {
      return {
        error: 'User not authenticated',
      };
    }

    try {
      const tweet = await TweetModel.findById(id);

      // typescript doesn't recognizes that above line will throw an Exception (eslint conflicts type assertion)
      if (!tweet) return { error: "This tweet doesn't exists" };

      if (like) tweet.likes += 1;
      if (retweet) tweet.retweets += 1;

      await tweet.save();

      const { likes, retweets } = tweet;
      return {
        likes,
        retweets,
      };
    } catch (err) {
      return { error: "This tweet doesn't exists" };
    }
  },
  outputFields: {
    likes: {
      type: GraphQLInt,
      resolve: ({ likes }: TweetUpdatePayload) => likes,
    },
    retweets: {
      type: GraphQLInt,
      resolve: ({ retweets }: TweetUpdatePayload) => retweets,
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }: TweetUpdatePayload) => error,
    },
  },
});
