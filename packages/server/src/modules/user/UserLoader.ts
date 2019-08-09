/* eslint-disable no-undef */
/* eslint-disable import/no-unresolved */
import DataLoader from 'dataloader';
import { connectionFromMongoCursor, mongooseLoader } from '@entria/graphql-mongoose-loader';
import mongoose, { Types } from 'mongoose';
import { ConnectionArguments } from 'graphql-relay';

import UserModel, { IUser } from './UserModel';

import { GraphQLContext } from '../../TypeDefinition';

declare type ObjectId = mongoose.Schema.Types.ObjectId;

export default class User {
  id: string;

  _id: Types.ObjectId;

  name: string;

  email: string | null | undefined;

  active: boolean | null | undefined;

  constructor(data: IUser, { user }: GraphQLContext) {
    this.id = data.id;
    this._id = data._id;
    this.name = data.name;

    // you can only see your own email, and your active status
    if (user && user._id.equals(data._id)) {
      this.email = data.email;
      this.active = data.active;
    }
  }
}

export const getLoader = () => new DataLoader((ids: ReadonlyArray<string>) => mongooseLoader(UserModel, ids));

const viewerCanSee = () => true;

export const load = async (
  context: GraphQLContext,
  id: string | Object | ObjectId,
): Promise<User | null> => {
  if (!id && typeof id !== 'string') {
    return null;
  }

  let data;
  try {
    // @ts-ignore
    data = await context.dataloaders.UserLoader.load(id);
  } catch (err) {
    return null;
  }
  return viewerCanSee() ? new User(data, context) : null;
};

export const clearCache = ({ dataloaders }: GraphQLContext, id: Types.ObjectId) => dataloaders.UserLoader.clear(id.toString());
export const primeCache = ({ dataloaders }: GraphQLContext, id: Types.ObjectId, data: IUser) => dataloaders.UserLoader.prime(id.toString(), data);
export const clearAndPrimeCache = (context: GraphQLContext, id: Types.ObjectId, data: IUser) => clearCache(context, id) && primeCache(context, id, data);

type UserArgs = ConnectionArguments & {
  search?: string;
};
export const loadUsers = async (context: GraphQLContext, args: UserArgs) => {
  const where = args.search ? { name: { $regex: new RegExp(`^${args.search}`, 'ig') } } : {};
  const users = UserModel.find(where, { _id: 1 }).sort({ createdAt: -1 });

  return connectionFromMongoCursor({
    cursor: users,
    context,
    args,
    loader: load,
  });
};

export const getAuthor = async (id: string, { user }: GraphQLContext) => {
  const author = await UserModel.findById(id);

  if (author && (!user || user._id.toString() !== id.toString())) {
    author.email = undefined;
    author.active = undefined;
  }

  return author;
};
