import lodash from 'lodash';
import { model, Schema, Types } from 'mongoose';

const BlogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: true,
      maxLength: [100, 'A name must not be more than 100'],
      trim: true
    },
    content: {
      type: String,
      required: [true, 'content is required'],
      trim: true
    },

    description: {
      type: String,
      required: [true, 'description is required'],
      trim: true
    },
    deleted: {
        type: Boolean,
        default: false,
        select: false
    }
  },
  { timestamps: true }
);

const Blog = model('Blog', BlogSchema);

export default Blog;
