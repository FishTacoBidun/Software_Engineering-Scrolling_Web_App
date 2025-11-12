//File: model.mjs containing the models for the individual databases and database operations for our database_microservice REST API
//Programmer Name: Kelsey Shanks, Wolfie Essink

import mongoose from 'mongoose';
import 'dotenv/config';

const SIDE_SCROLLER_DB_NAME = 'side_scroller_db';

let connection1 = undefined;

async function connectToDatabases() {
    try{
        connection1 = await mongoose.connect
            (process.env.MONGODB_CONNECT_STRING, {dbName: SIDE_SCROLLER_DB_NAME});
        console.log("Successfully connected to MongoDB - Side Scroller using Mongoose!");
    } catch(err){
        console.log(err);
        throw Error(`Could not connect to MongoDB - Side Scroller ${err.message}`)
    }
}

//side-scroller Web App
const sideScrollerSchema = mongoose.Schema({
    levelId: {type: Number, required: true, unique: true},
    unlocked: {type: Boolean, required: true, default: false}
})

//compile model from schema after defining
const Side_Scroller_Data = mongoose.model(SIDE_SCROLLER_DB_NAME, sideScrollerSchema);

/**
* creates new side_scroller_data object in database
* @param {number} levelId
* @param {boolean} unlocked
* @returns {object} side_scroller_data
*/
const create_side_scroller_data = async(levelId, unlocked) => { 
    const side_scroller_data = new Side_Scroller_Data({levelId: levelId, unlocked: unlocked});
    return side_scroller_data.save();
}

/**
* pulls all side_scroller_data objects in database as array
* @returns {array}
*/
const getSideScrollerData = async() => {
    const query = Side_Scroller_Data.find();
    return query.exec();
}

/**
* pulls side_scroller_data object with matching levelId
* @param {number} levelId
* @returns {object}
*/
const getSideScrollerDataByLevelId = async(levelId) => {
    const query = Side_Scroller_Data.findOne({levelId: levelId});
    return query.exec();
}

/**
* pulls side_scroller_data object with matching ID from database
* @param {string} id
* @returns {object}
*/
const getSideScrollerDataById = async(id) => {
    const query = Side_Scroller_Data.findById(id);
    return query.exec();
}

/**
* updates side_scroller_data object in database with new data
* @param {string} id
* @param {object} update
* @returns {object} updatedSideScrollerData
*/
const updateSideScrollerData = async(id, update) => {
    await Side_Scroller_Data.updateOne({_id: id}, update).exec();
    const updatedSideScrollerData = getSideScrollerDataById(id);
    return updatedSideScrollerData;
}

/**
* deletes side_scroller_data object from database
* @param {string} id
*/
const deleteSideScrollerDataById = async(id) => {
    await Side_Scroller_Data.deleteOne({_id: id});
    return
}

//export all functions
export { connectToDatabases, create_side_scroller_data, getSideScrollerData, 
    getSideScrollerDataByLevelId, getSideScrollerDataById, updateSideScrollerData, 
    deleteSideScrollerDataById
};