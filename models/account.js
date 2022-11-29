import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const AccountSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    associateId: {type: mongoose.Schema.Types.ObjectId, ref: 'Account'},
    email: {type: String, required: true},
    password: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
    firstName: String,
    lastName: String,
    dob: Date,
    gender: String,
    avatar: {type: String, default: 'https://res.cloudinary.com/united-app/image/upload/v1638879014/avatars/character4_vk2ven.png'},
    isVerified: {type: Boolean, default: false},
    mobile: String,
    passcode: Number,
    contant: {
        address: String,
        city: String,
        state: String,
        zipcode: String,
        mobile: String,
    },
    CreatedAt: {type: Date, default: Date.now}
});

export default mongoose.model('Account', AccountSchema);