import { registrationService } from "../services/register.service.js";

const createRegistration = async (req, res) => {
    try {
        const result = await registrationService.createRegistrationIntoDB(req.body);
        res.send(result)
    } catch (err) {
        res.status(500).send(err)
    }
}


export const registrationController = {
    createRegistration
}