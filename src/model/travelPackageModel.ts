import lodash from 'lodash';
import validator from 'validator';
import bycrypt from 'bcryptjs';
import { model, Schema, Types } from 'mongoose';


const TravelPackageSchema = new Schema<ITravelPackage>({
    title: {
    type: String,
    required: true,
    maxLength: [100, 'A name must not be more than 100'],
    trim: true
  },
  description: {
    type: String,

    maxLength: [100, 'A name must not be more than 100'],
    trim: true
  },
  destination: {
    type: String,
    required: true,
    maxLength: [100, 'A name must not be more than 100'],
    trim: true
  },

  price: {
    type: Number,
    require: true
  },
  startDate: {
        type: Date,
        require: true
  },
  endDate: {
    type: Date,
    require: true
},
imageUrl: String


}, {timestamps: true});




const TravelPackage = model('TravelPackage', TravelPackageSchema);

export default TravelPackage;
