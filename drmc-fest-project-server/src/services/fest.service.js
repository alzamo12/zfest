import { ObjectId } from "mongodb";
import { getCollection } from "../config/db.js";
import { createSlug } from "../utils/createSlug.js";
const insertFestIntoDB = async (festData, res, email) => {
    const festCollection = await getCollection("fests");
    const {
        name,
        shortDescription,
        description,
        coverImage,

        organizerName,
        contactEmail,
        contactPhone,
        website,
        facebook,

        venue,
        city,

        startDate,
        endDate,
        registrationDeadline,

        registrationRequired,
        registrationFee,
        maxParticipants,

        visibility,

        events,
    } = festData;

    /* ========================================
       1. BASIC VALIDATION
    ======================================== */

    if (!name || name.trim().length < 3) {
        return res.status(400).json({
            success: false,
            message:
                "Fest name must be at least 3 characters",
        });
    }

    if (
        !shortDescription ||
        shortDescription.trim().length < 10
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Short description must be at least 10 characters",
        });
    }

    if (
        !description ||
        description.trim().length < 20
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Description must be at least 20 characters",
        });
    }

    /* ========================================
       2. ORGANIZER VALIDATION
    ======================================== */

    if (!organizerName) {
        return res.status(400).json({
            success: false,
            message: "Organizer name is required",
        });
    }

    if (!contactEmail) {
        return res.status(400).json({
            success: false,
            message: "Contact email is required",
        });
    }

    if (!contactPhone) {
        return res.status(400).json({
            success: false,
            message: "Contact phone is required",
        });
    }

    /* ========================================
       3. LOCATION VALIDATION
    ======================================== */

    if (!venue || !city) {
        return res.status(400).json({
            success: false,
            message: "Venue and city are required",
        });
    }

    /* ========================================
       4. DATE VALIDATION
    ======================================== */

    if (!startDate || !endDate) {
        return res.status(400).json({
            success: false,
            message:
                "Fest start date and end date are required",
        });
    }

    const festStartDate = new Date(startDate);
    const festEndDate = new Date(endDate);

    if (
        Number.isNaN(festStartDate.getTime()) ||
        Number.isNaN(festEndDate.getTime())
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid fest dates",
        });
    }

    if (festEndDate < festStartDate) {
        return res.status(400).json({
            success: false,
            message:
                "Fest end date cannot be before start date",
        });
    }

    /* ========================================
       5. REGISTRATION DEADLINE
    ======================================== */

    let registrationDeadlineDate = null;

    if (registrationDeadline) {
        registrationDeadlineDate = new Date(
            registrationDeadline
        );

        if (
            Number.isNaN(
                registrationDeadlineDate.getTime()
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid registration deadline",
            });
        }

        if (
            registrationDeadlineDate > festStartDate
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Registration deadline cannot be after the fest starts",
            });
        }
    }

    /* ========================================
       6. REGISTRATION VALIDATION
    ======================================== */

    const finalRegistrationFee =
        Number(registrationFee) || 0;

    const finalMaxParticipants =
        Number(maxParticipants);

    if (
        !Number.isInteger(finalMaxParticipants) ||
        finalMaxParticipants < 1
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Maximum participants must be at least 1",
        });
    }

    if (finalRegistrationFee < 0) {
        return res.status(400).json({
            success: false,
            message:
                "Registration fee cannot be negative",
        });
    }

    if (
        visibility !== "public" &&
        visibility !== "private"
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid visibility value",
        });
    }

    /* ========================================
       7. EVENTS VALIDATION
    ======================================== */

    if (!Array.isArray(events) || events.length === 0) {
        return res.status(400).json({
            success: false,
            message:
                "At least one event is required",
        });
    }

    /* ========================================
       8. CREATE EVENTS
    ======================================== */

    const formattedEvents = [];

    for (const event of events) {
        if (
            !event.name ||
            event.name.trim().length < 2
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Every event must have a valid name",
            });
        }

        if (
            !event.description ||
            event.description.trim().length < 10
        ) {
            return res.status(400).json({
                success: false,
                message:
                    `Description is required for ${event.name}`,
            });
        }

        if (!event.category) {
            return res.status(400).json({
                success: false,
                message:
                    `Category is required for ${event.name}`,
            });
        }

        if (
            event.participationType !==
            "individual" &&
            event.participationType !== "team"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    `Invalid participation type for ${event.name}`,
            });
        }

        /* -------------------------------
           Participants
        -------------------------------- */

        const eventMaxParticipants = Number(
            event.maxParticipants
        );

        if (
            !Number.isInteger(
                eventMaxParticipants
            ) ||
            eventMaxParticipants < 1
        ) {
            return res.status(400).json({
                success: false,
                message:
                    `Invalid participant limit for ${event.name}`,
            });
        }

        /* -------------------------------
           Event fee
        -------------------------------- */

        const eventRegistrationFee =
            Number(event.registrationFee) || 0;

        if (eventRegistrationFee < 0) {
            return res.status(400).json({
                success: false,
                message:
                    `Invalid registration fee for ${event.name}`,
            });
        }

        /* -------------------------------
           Event date
        -------------------------------- */

        if (!event.date) {
            return res.status(400).json({
                success: false,
                message:
                    `Date is required for ${event.name}`,
            });
        }

        const eventDate = new Date(event.date);

        if (
            Number.isNaN(eventDate.getTime())
        ) {
            return res.status(400).json({
                success: false,
                message:
                    `Invalid date for ${event.name}`,
            });
        }

        /*
         * Event must happen during
         * the fest.
         */

        if (
            eventDate < festStartDate ||
            eventDate > festEndDate
        ) {
            return res.status(400).json({
                success: false,
                message:
                    `${event.name} must be scheduled during the fest`,
            });
        }

        /* -------------------------------
           Time
        -------------------------------- */

        if (
            !event.startTime ||
            !event.endTime
        ) {
            return res.status(400).json({
                success: false,
                message:
                    `Start and end time are required for ${event.name}`,
            });
        }

        if (
            event.endTime <= event.startTime
        ) {
            return res.status(400).json({
                success: false,
                message:
                    `End time must be after start time for ${event.name}`,
            });
        }

        /* -------------------------------
           Venue
        -------------------------------- */

        if (!event.venue) {
            return res.status(400).json({
                success: false,
                message:
                    `Venue is required for ${event.name}`,
            });
        }

        /* -------------------------------
           Event document
        -------------------------------- */

        formattedEvents.push({
            _id: new ObjectId(),

            name: event.name.trim(),

            description:
                event.description.trim(),

            category: event.category,

            participationType:
                event.participationType,

            maxParticipants:
                eventMaxParticipants,

            registrationFee:
                eventRegistrationFee,

            schedule: {
                date: eventDate,

                startTime: event.startTime,

                endTime: event.endTime,
            },

            venue: event.venue.trim(),

            prize: event.prize?.trim() || "",

            rules: event.rules?.trim() || "",

            currentParticipants: 0,

            status: "active",

            createdAt: new Date(),
        });
    }

    /* ========================================
       9. CREATE SLUG
    ======================================== */

    const baseSlug = createSlug(name);

    let slug = baseSlug;

    // let slugExists = await db
    //     .collection("fests")
    //     .findOne({ slug });
    let slugExists = await festCollection.findOne({ slug });

    let counter = 1;

    while (slugExists) {
        slug = `${baseSlug}-${counter}`;

        slugExists = await db
            .collection("fests")
            .findOne({ slug });

        counter++;
    }

    /* ========================================
       10. GET OWNER
    ======================================== */

    /*
     * This assumes Firebase authentication
     * middleware has already executed.
     */

    // const email = req.user?.email;

    if (!email) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }

    /* ========================================
       11. CREATE FEST DOCUMENT
    ======================================== */

    const now = new Date();

    const fest = {
        email,

        name: name.trim(),

        slug,

        shortDescription:
            shortDescription.trim(),

        description:
            description.trim(),

        coverImage:
            coverImage?.trim() || "",

        organizer: {
            name: organizerName.trim(),

            email:
                contactEmail.trim().toLowerCase(),

            phone: contactPhone.trim(),

            website:
                website?.trim() || "",

            facebook:
                facebook?.trim() || "",
        },

        location: {
            venue: venue.trim(),

            city: city.trim(),
        },

        schedule: {
            startDate: festStartDate,

            endDate: festEndDate,

            registrationDeadline:
                registrationDeadlineDate,
        },

        registration: {
            required:
                Boolean(registrationRequired),

            fee: finalRegistrationFee,

            maxParticipants:
                finalMaxParticipants,

            currentParticipants: 0,
        },

        visibility,

        events: formattedEvents,

        status: "draft",

        createdAt: now,

        updatedAt: now,
    };

    /* ========================================
       12. INSERT INTO MONGODB
    ======================================== */

    const result = await festCollection.insertOne(fest);
    return result;
};

// const getFestsFromDB = async() => {
//     const festCollection = await getCollection('fests');
//     const result = await festCollection.find({}).toArray();
//     return result
// };

const getFestByIdFromDB = async(id) => {
    const festCollection = await getCollection('fests');
    // console.log('fetching fest details for id:', id);
    const result = await festCollection.findOne({_id: new ObjectId(id)});
    // console.log('fest details from db:', result);
    return result
}

const getFestsFromDB = async (festName = "") => {
    const festCollection = await getCollection("fests");

    const query = festName
        ? {
              name: {
                  $regex: festName,
                  $options: "i",
              },
          }
        : {};

    const result = await festCollection.find(query).toArray();

    return result;
};

export const festServices = {
    insertFestIntoDB,
    getFestsFromDB,
    getFestByIdFromDB
}