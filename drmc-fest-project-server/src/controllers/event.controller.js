import { eventService } from "../services/event.service.js";

const getEvents = async (req, res) => {
    try {
        const result = await eventService.getEventsFromDB(req.query.festId);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: "Internal server error" })
    }
}

const getEventById = async (req, res) => {
    try {
        const result = await eventService.getEventByIdFromDB(req.params.id);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export const eventControllers = {
    getEvents,
    getEventById
}