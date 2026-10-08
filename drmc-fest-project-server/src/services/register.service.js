import { getCollection } from "../config/db.js";

const createRegistrationIntoDB = async (data) => {
    const eventRegisterCollection = await getCollection("eventRegister");
    const result = await eventRegisterCollection.insertOne(data);
    return result
};

export const registrationService = {
    createRegistrationIntoDB
};