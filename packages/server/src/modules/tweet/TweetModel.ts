import mongoose, { Document, Model } from 'mongoose';
import { IUser } from '../user/UserModel';

const schema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    retweets: {
      type: Number,
      default: 0,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
    collection: 'tweet',
  },
);

export interface ITweet extends Document {
  content: string;
  likes: number;
  retweets: number;
  author: IUser;
}

const TweetModel: Model<ITweet> = mongoose.model('Tweet', schema);

export default TweetModel;
