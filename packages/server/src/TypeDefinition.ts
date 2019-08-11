import Dataloader from 'dataloader';
import { PubSub } from 'graphql-subscriptions';

import { IUser } from './modules/user/UserModel';
import { ITweet } from './modules/tweet/TweetModel';

type Key = string;

export type Dataloaders = {
  UserLoader: Dataloader<Key, IUser>;
  TweetLoader: Dataloader<Key, ITweet>;
};

export type GraphQLContext = {
  user?: IUser;
  dataloaders: Dataloaders;
  pubsub: PubSub;
};
