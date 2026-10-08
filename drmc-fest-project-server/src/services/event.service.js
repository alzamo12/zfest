import { ObjectId } from "mongodb";
import { getCollection } from "../config/db.js";

const getEventsFromDB = async (festId) => {
    const eventCollection = await getCollection("events");

    if (!festId) {
        return await eventCollection.find({}).toArray();
    }

    return await eventCollection.find({ festId: new ObjectId(festId) }).toArray();
};

const getEventByIdFromDB = async (eventId) => {
    const eventCollection = await getCollection("events");
    return await eventCollection.findOne({ _id: new ObjectId(eventId) });
};

export const eventService = {
    getEventsFromDB,
    getEventByIdFromDB
}