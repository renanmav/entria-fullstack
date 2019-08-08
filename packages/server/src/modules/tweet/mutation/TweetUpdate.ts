import { mutationWithClientMutationId } from 'graphql-relay';
import { GraphQLNonNull, GraphQLID, GraphQLBoolean, GraphQLString, GraphQLInt } from 'graphql';
import { GraphQLContext } from '../../../TypeDefinition';
import TweetModel, { ITweet } from '../TweetModel';

interface TweetUpdateInput {
  id: string;
  like: boolean;
  retweet: boolean;
  clientMudationId: string;
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

    const tweet = await TweetModel.findById(id);

    if (!tweet) {
      return {
        error: "This tweet doesn't exists",
      };
    }

    if (like) {
      tweet.likes += 1;
    }

    if (retweet) {
      tweet.retweets += 1;
    }

    return tweet.save();
  },
  outputFields: {
    content: {
      type: GraphQLString,
      resolve: (tweet: ITweet) => tweet.content,
    },
    likes: {
      type: GraphQLInt,
      resolve: (tweet: ITweet) => tweet.likes,
    },
    retweets: {
      type: GraphQLInt,
      resolve: (tweet: ITweet) => tweet.retweets,
    },
  },
});
