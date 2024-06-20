"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const validator_1 = __importDefault(require("validator"));
const moment_1 = __importDefault(require("moment"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mongoose_1 = require("mongoose");
const enums_1 = require("../utils/enums");
const UserSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: true,
        maxLength: [100, 'A name must not be more than 100'],
        set: (val) => lodash_1.default.capitalize(val),
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        maxLength: [100, 'A name must not be more than 100'],
        set: (val) => lodash_1.default.capitalize(val),
        trim: true
    },
    email: {
        type: String,
        unique: [true, 'Email already exist'],
        required: true,
        validator: [validator_1.default.isEmail, 'Invalid email'],
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        minlength: [8, 'password must not be less than 6'],
        select: false
    },
    passwordConfirm: {
        type: String,
        minlength: [8, 'password must not be less than 6'],
        validate: {
            /*
             * this only works on CREATE or SAVE
             */
            validator: function (val) {
                return val === this.password;
            },
            message: 'password and passwordConfirm must be the same'
        }
    },
    phoneNumber: {
        type: String,
        unique: [true, 'phone number already exist '],
        validate: [
            (val) => validator_1.default.isMobilePhone(val, 'en-NG', { strictMode: true }),
            'Provide a valid phone number starting with +234 e.g +234 81X XXX XXXX'
        ],
        required: true,
        trim: true
    },
    freeDays: {
        type: Array,
        validate: {
            validator: function (val) {
                return val.every(day => moment_1.default.weekdays().some(expectDay => {
                    return expectDay.toLowerCase().trim() === day.toLowerCase().trim();
                }));
            },
            message: 'Provide valid days of the week'
        },
        set: (days) => days.map(day => lodash_1.default.capitalize(day))
    },
    location: {
        longitude: { type: String, require: true },
        latitude: { type: String, require: true }
    },
    role: {
        type: String,
        required: true,
        trim: true,
        uppercase: true,
        enum: {
            values: [enums_1.ROLES.ADMIN, enums_1.ROLES.EMPLOYEE],
            message: 'Role is either: ADMIN, EMPLOYEE'
        }
    },
    openTime: {
        type: String,
        validate: {
            validator: function (value) {
                const closeTime = (0, moment_1.default)(this.closeTime, 'HH:mm:ss');
                return (0, moment_1.default)(value, 'HH:mm:ss').isBefore(closeTime);
            },
            message: 'Provide a valid time of the day(HH:MM:SS). open time must be lesser than close time'
        }
    },
    closeTime: {
        type: String,
        validate: {
            validator: function (value) {
                const openTime = (0, moment_1.default)(this.openTime, 'HH:mm:ss');
                return (0, moment_1.default)(value, 'HH:mm:ss').isAfter(openTime);
            },
            message: 'Provide a valid time of the day(HH:MM:SS). close time must be greater than open time'
        }
    },
    employerId: mongoose_1.Types.ObjectId,
    isProfileCompleted: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    }
});
UserSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified('password'))
            next();
        if (this.password) {
            this.password = yield bcryptjs_1.default.hash(this.password, 12);
            this.passwordConfirm = undefined;
        }
        next();
    });
});
UserSchema.method('comparePassword', function (plainPassword, hashedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcryptjs_1.default.compare(plainPassword, hashedPassword);
    });
});
UserSchema.method('toJSON', function () {
    const userObj = this.toObject();
    delete userObj.password;
    delete userObj.passwordConfirm;
    return userObj;
});
const User = (0, mongoose_1.model)('User', UserSchema);
exports.default = User;
