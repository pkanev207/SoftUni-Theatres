// TODO replace with actual model
const Play = require('../models/Play');
// const User = require('../models/User');

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
    // TODO replace with actual fields
    const existing = await Play.findById(id);
    existing.something = obj.something;

    await existing.save();
}

async function del(id) {
    await Play.findByIdAndDelete(id);
}

async function getAllSortedByDate() {
    return await Play.find({}).sort({ createdAt: 1 }).lean();
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

module.exports = {
    getAll,
    getById,
    getModelAndUsers,
    create,
    update,
    del,
    getAllSortedByDate
};
