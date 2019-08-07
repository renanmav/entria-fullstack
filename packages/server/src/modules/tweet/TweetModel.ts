import mongoose, { Document, Model } from 'mongoose';

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
}

const TweetModel: Model<ITweet> = mongoose.model('Tweet', schema);

export default TweetModel;
