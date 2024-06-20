import lodash from 'lodash';
import validator from 'validator';
import bycrypt from 'bcryptjs';
import { model, Schema, Types } from 'mongoose';

import { ROLES } from '../utils/enums';

const UserSchema = new Schema<IUser>({
  firstName: {
    type: String,
    required: true,
    maxLength: [100, 'A name must not be more than 100'],
    set: (val: string) => lodash.capitalize(val),
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    maxLength: [100, 'A name must not be more than 100'],
    set: (val: string) => lodash.capitalize(val),
    trim: true
  },
  email: {
    type: String,
    unique: [true, 'Email already exist'],
    required: true,
    validator: [validator.isEmail, 'Invalid email'],
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    minlength: [8, 'password must not be less than 6'],
    select: false
  },

  phoneNumber: {
    type: String,
    unique: [true, 'phone number already exist '],
    validate: [
      (val: string) =>
        validator.isMobilePhone(val, 'en-NG', { strictMode: true }),
      'Provide a valid phone number starting with +234 e.g +234 81X XXX XXXX'
    ],
    required: true,
    trim: true
  },

  role: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
    enum: {
      values: [ROLES.ADMIN, ROLES.USER],
      message: 'Role is either: ADMIN, USER'
    }
  },
  
}, {timestamps: true});

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) next();

  if (this.password) {
    this.password = await bycrypt.hash(this.password, 12);
  }

  next();
});

UserSchema.method('comparePassword', async function(
  plainPassword,
  hashedPassword
) {
  return await bycrypt.compare(plainPassword, hashedPassword);
});

UserSchema.method('toJSON', function() {
  const userObj: IUserReq = this.toObject();
  delete userObj.password;

  return userObj;
});

const User = model('User', UserSchema);

export default User;
