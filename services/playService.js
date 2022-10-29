const Play = require('../models/Play');
const User = require('../models/User');

async function getAll() {
    return Play.find({}).lean();
}

async function getById(id) {
    return Play.findById(id).lean();
}

async function getModelAndUsers(id) {
    // TODO replace with actual fields to be populated
    // return Play.findById(id).populate('field1').populate('field2').lean();
    return Play.findById(id).populate('owner').lean();
}

async function create(obj) {
    const result = new Play(obj);
    await result.save();
    return result;
}

async function update(id, obj) {
    const existing = await Play.findById(id);

    existing.title = obj.title;
    existing.description = obj.description;
    existing.imageUrl = obj.imageUrl;
    existing.isPublic = obj.isPublic;

    await existing.save();
}

async function del(id) {
    await Play.findByIdAndDelete(id);
}

async function getAllSortedByDate() {
    return await Play.find({}).sort({ createdAt: 1 }).lean();
}

async function getAllSortedByLikes() {
    // db.question.find().sort({"answers":-1}).limit(5).pretty();
    return await Play.find().sort({ "likes": -1 }).limit(3).lean();
}

// for joining two models
// async function createTrip(trip) {
//     const result = new Trip(trip);
//     await result.save();
//     // after creation in order to have id
//     const user = await User.findById(result.owner);
//     user.trips.push(result._id);
//     await user.save();

//     return result;
// }

async function vote(userId, objId) {
    const play = await Play.findById(objId);
    const user = await User.findById(userId);

    if (play.likes.includes(userId)) {
        throw new Error('User already has voted!');
    }

    if (user.plays.includes(objId)) {
        throw new Error('User has already voted!');
    }

    if (play.owner == user._id) {
        throw new Error('The user is the owner of the play and therefore can NOT vote!!!');
    }

    play.likes.push(userId);
    await play.save();

    user.plays.push(objId);
    await user.save();

    return;
}

module.exports = {
    getAll,
    getById,
    getModelAndUsers,
    create,
    update,
    del,
    getAllSortedByDate,
    vote,
    getAllSortedByLikes
};
