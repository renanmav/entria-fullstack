import DataLoader from 'dataloader';
// eslint-disable-next-line import/no-unresolved
import { connectionFromMongoCursor, mongooseLoader } from '@entria/graphql-mongoose-loader';
import { Types } from 'mongoose';
import { ConnectionArguments } from 'graphql-relay';

import TweetModel, { ITweet } from './TweetModel';
import { GraphQLContext } from '../../TypeDefinition';

export default class Tweet {
  id: string;

  _id: Types.ObjectId;

  content: string;

  likes: number;

  retweets: number;

  author: string;

  constructor(data: ITweet) {
    this.id = data.id;
    this._id = data._id;
    this.content = data.content;
    this.likes = data.likes;
    this.retweets = data.retweets;
    this.author = data.author; // author === user._id
  }
}

// eslint-disable-next-line no-undef
export const getLoader = () => new DataLoader((ids: ReadonlyArray<string>) => mongooseLoader(TweetModel, ids));

// users can see all tweets
// As author is a UserType, so we'll use UserLoad viewerCanSee method
const viewerCanSee = (_ctx: GraphQLContext, data: ITweet): Tweet | null => new Tweet(data);

// eslint-disable-next-line
export const load = async (context: GraphQLContext, id: any): Promise<Tweet | null> => {
  if (!id && typeof id !== 'string') {
    return null;
  }

  let data;
  try {
    data = await context.dataloaders.TweetLoader.load(id);
  } catch (err) {
    return null;
  }
  return viewerCanSee(context, data);
};

export const clearCache = ({ dataloaders }: GraphQLContext, id: Types.ObjectId) => dataloaders.TweetLoader.clear(id.toString());
export const primeCache = ({ dataloaders }: GraphQLContext, id: Types.ObjectId, data: ITweet) => dataloaders.TweetLoader.prime(id.toString(), data);
export const clearAndPrimeCache = (context: GraphQLContext, id: Types.ObjectId, data: ITweet) => clearCache(context, id) && primeCache(context, id, data);

type TweetArgs = ConnectionArguments & {
  authorId?: string;
};

export const loadTweets = async (context: GraphQLContext, args: TweetArgs) => {
  const where = args.authorId ? { author: args.authorId } : {};
  const tweets = TweetModel.find(where).sort({ createdAt: -1 });

  return connectionFromMongoCursor({
    cursor: tweets,
    context,
    args,
    loader: load,
  });
};
