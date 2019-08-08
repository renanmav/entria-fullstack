import { mutationWithClientMutationId } from 'graphql-relay';
import { GraphQLNonNull, GraphQLString, GraphQLInt } from 'graphql';
import TweetModel, { ITweet } from '../TweetModel';

interface TweetCreateInput {
  content: string;
  clientMutationId: string;
}

export default mutationWithClientMutationId({
  name: 'TweetCreate',
  description: 'Used to create a tweet',
  inputFields: {
    content: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async ({ content }: TweetCreateInput) => {
    const tweet = new TweetModel({
      content,
    });

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