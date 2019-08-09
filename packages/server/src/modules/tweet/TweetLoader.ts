import DataLoader from 'dataloader';
// eslint-disable-next-line import/no-unresolved
import { connectionFromMongoCursor, mongooseLoader } from '@entria/graphql-mongoose-loader';
import { Types } from 'mongoose';
import { ConnectionArguments } from 'graphql-relay';

import TweetModel, { ITweet } from './TweetModel';
import { GraphQLContext } from '../../TypeDefinition';
import UserModel, { IUser } from '../user/UserModel';

export default class Tweet {
  id: string;

  _id: Types.ObjectId;

  content: string;

  likes: number;

  retweets: number;

  author: IUser;

  constructor(data: ITweet) {
    this.id = data.id;
    this._id = data._id;
    this.content = data.content;
    this.likes = data.likes;
    this.retweets = data.retweets;
    this.author = data.author;
  }
}

// eslint-disable-next-line no-undef
export const getLoader = () => new DataLoader((ids: ReadonlyArray<string>) => mongooseLoader(TweetModel, ids));

const viewerCanSee = () => true;

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
  return viewerCanSee() ? new Tweet(data) : null;
};

export const clearCache = ({ dataloaders }: GraphQLContext, id: Types.ObjectId) => dataloaders.TweetLoader.clear(id.toString());
export const primeCache = ({ dataloaders }: GraphQLContext, id: Types.ObjectId, data: ITweet) => dataloaders.TweetLoader.prime(id.toString(), data);
export const clearAndPrimeCache = (context: GraphQLContext, id: Types.ObjectId, data: ITweet) => clearCache(context, id) && primeCache(context, id, data);

export const loadTweets = async (context: GraphQLContext, args: ConnectionArguments) => {
  const tweets = TweetModel.find().sort({ createdAt: -1 });

  return connectionFromMongoCursor({
    cursor: tweets,
    context,
    args,
    loader: load,
  });
};

export const getAuthor = async ({ author: id }: ITweet, { user }: GraphQLContext) => {
  const author = await UserModel.findById(id);

  if (author && (!user || user._id.toString() !== id.toString())) {
    author.email = undefined;
    author.active = undefined;
  }

  return author;
};
