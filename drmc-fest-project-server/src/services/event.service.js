import { ObjectId } from "mongodb";
import { getCollection } from "../config/db.js";

const getEventsFromDB = async (queries) => {
    const eventCollection = await getCollection("events");
    const { search, type, fee, festId, category } = queries;

    const query = {};

    if (search) {
        query.name = { $regex: search, $options: "i" };
    }

    if (type === 'team' || type === 'individual') {
        query.participationType = type
    }

    if (fee === 'free') {
        query.registrationFee = 0
    } else if (fee === 'paid') {
        query.registrationFee = {
            $gt: 0
        }
    }
    // console.log('event get hit')

    if (festId) {
        // return await eventCollection.find({}).toArray();
        query.festId = new ObjectId(festId)
    }

    if (category && category!=='all') {
        query.category = category
    }

    // if(sort)

    console.log(query)
    const result = await eventCollection.find(query, {}, {}).toArray();
    // console.log(result)
    return result
};

const getEventByIdFromDB = async (eventId) => {
    const eventCollection = await getCollection("events");
    return await eventCollection.findOne({ _id: new ObjectId(eventId) });
};

export const eventService = {
    getEventsFromDB,
    getEventByIdFromDB
}