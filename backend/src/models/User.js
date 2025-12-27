const mongoose = require('mongoose');

//create a user model using mongoose having fields name, email, profile pic, createdAt, updatedAt, and clerkId
const userSchema = new mongoose.Schema({
    name: { type: String, required: true},
    email: { type: String, required: true, unique: true},
    profileImage: { type: String, default: '' },
    clerkId: { type: String, unique: true, required: true}
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
