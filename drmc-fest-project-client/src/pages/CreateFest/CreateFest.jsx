import { useFieldArray, useForm } from "react-hook-form";
import {
  Plus,
  Trash2,
  CalendarDays,
  MapPin,
  Trophy,
  Users,
  Building2,
  Globe,
  Phone,
  Mail,
} from "lucide-react";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const CreateFest = () => {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      // Fest information
      name: "",
      shortDescription: "",
      description: "",
      coverImage: "",

      // Organizer
      organizerName: "",
      contactEmail: "",
      contactPhone: "",
      website: "",
      facebook: "",

      // Location
      venue: "",
      city: "",

      // Schedule
      startDate: "",
      endDate: "",
      registrationDeadline: "",

      // Registration
      registrationRequired: true,
      registrationFee: 0,
      maxParticipants: 100,

      // Visibility
      visibility: "public",

      // Events
      events: [
        {
          name: "",
          description: "",
          category: "",
          participationType: "individual",
          maxParticipants: 50,
          registrationFee: 0,
          date: "",
          startTime: "",
          endTime: "",
          venue: "",
          prize: "",
          rules: "",
        },
      ],
    },
  });

  /*
   * useFieldArray allows us to dynamically
   * add/remove events.
   */
  const {
    fields: eventFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "events",
  });

  const axiosSecure = useAxiosSecure();

  const registrationRequired = watch("registrationRequired");

  /*
   * Add a new empty event
   */
  const handleAddEvent = () => {
    append({
      name: "",
      description: "",
      category: "",
      participationType: "individual",
      maxParticipants: 50,
      registrationFee: 0,
      date: "",
      startTime: "",
      endTime: "",
      venue: "",
      prize: "",
      rules: "",
    });
  };

  /*
   * Submit
   */
  const onSubmit = async (data) => {
    try {
      console.log("Form data:", data);

      const response = await axiosSecure.post(
        "/fests",
        data
      );

      console.log(response.data);

      // Example:
      // navigate(`/fests/${response.data.data._id}`);

    } catch (error) {
      console.error(
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto">

        {/* =================================
            PAGE HEADER
        ================================= */}

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">
            Create a Fest
          </h1>

          <p className="text-base-content/60 mt-2">
            Create your fest and add all the events
            participants can join.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>

          {/* =================================
              1. BASIC FEST INFORMATION
          ================================= */}

          <div className="card bg-base-100 shadow-sm mb-6">
            <div className="card-body">

              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Building2
                    size={22}
                    className="text-primary"
                  />
                </div>

                <div>
                  <h2 className="text-xl font-bold">
                    Basic Information
                  </h2>

                  <p className="text-sm text-base-content/60">
                    Basic information about your fest.
                  </p>
                </div>
              </div>

              {/* Fest Name */}

              <div className="form-control w-full mb-5">
                <label className="label">
                  <span className="label-text font-medium">
                    Fest Name
                    <span className="text-error"> *</span>
                  </span>
                </label>

                <input
                  type="text"
                  placeholder="e.g. NDC IT Fest 2026"
                  className={`input input-bordered w-full ${errors.name ? "input-error" : ""
                    }`}
                  {...register("name", {
                    required: "Fest name is required",
                    minLength: {
                      value: 3,
                      message:
                        "Fest name must be at least 3 characters",
                    },
                  })}
                />

                {errors.name && (
                  <p className="text-error text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Cover Image */}

              <div className="form-control w-full mb-5">
                <label className="label">
                  <span className="label-text font-medium">
                    Cover Image URL
                  </span>
                </label>

                <input
                  type="url"
                  placeholder="https://example.com/fest-image.jpg"
                  className={`input input-bordered w-full ${errors.coverImage
                    ? "input-error"
                    : ""
                    }`}
                  {...register("coverImage", {
                  })}
                />

                {errors.coverImage && (
                  <p className="text-error text-sm mt-1">
                    {errors.coverImage.message}
                  </p>
                )}
              </div>

              {/* Short Description */}

              <div className="form-control w-full mb-5">
                <label className="label">
                  <span className="label-text font-medium">
                    Short Description
                    <span className="text-error"> *</span>
                  </span>
                </label>

                <textarea
                  placeholder="A short introduction to your fest..."
                  className={`textarea textarea-bordered w-full ${errors.shortDescription
                    ? "textarea-error"
                    : ""
                    }`}
                  rows={3}
                  {...register("shortDescription", {
                    required:
                      "Short description is required",
                    minLength: {
                      value: 10,
                      message:
                        "Description must be at least 10 characters",
                    },
                  })}
                />

                {errors.shortDescription && (
                  <p className="text-error text-sm mt-1">
                    {
                      errors.shortDescription
                        .message
                    }
                  </p>
                )}
              </div>

              {/* Detailed Description */}

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">
                    Detailed Description
                    <span className="text-error"> *</span>
                  </span>
                </label>

                <textarea
                  placeholder="Describe your fest in detail..."
                  className={`textarea textarea-bordered w-full min-h-40 ${errors.description
                    ? "textarea-error"
                    : ""
                    }`}
                  {...register("description", {
                    required:
                      "Detailed description is required",
                    minLength: {
                      value: 20,
                      message:
                        "Description must be at least 20 characters",
                    },
                  })}
                />

                {errors.description && (
                  <p className="text-error text-sm mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* =================================
              2. ORGANIZER INFORMATION
          ================================= */}

          <div className="card bg-base-100 shadow-sm mb-6">
            <div className="card-body">

              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Users
                    size={22}
                    className="text-primary"
                  />
                </div>

                <div>
                  <h2 className="text-xl font-bold">
                    Organizer Information
                  </h2>

                  <p className="text-sm text-base-content/60">
                    How participants can contact the
                    organizer.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">

                {/* Organizer Name */}

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Organization / Organizer Name
                      <span className="text-error">
                        {" "}
                        *
                      </span>
                    </span>
                  </label> <br />

                  <input
                    type="text"
                    placeholder="NDC IT Club"
                    className={`input input-bordered w-full ${errors.organizerName
                      ? "input-error"
                      : ""
                      }`}
                    {...register(
                      "organizerName",
                      {
                        required:
                          "Organizer name is required",
                      }
                    )}
                  />

                  {errors.organizerName && (
                    <p className="text-error text-sm mt-1">
                      {
                        errors.organizerName
                          .message
                      }
                    </p>
                  )}
                </div>

                {/* Email */}

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Contact Email
                      <span className="text-error">
                        {" "}
                        *
                      </span>
                    </span>
                  </label>

                  <div className="relative">
                    <Mail
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50"
                    />

                    <input
                      type="email"
                      placeholder="contact@example.com"
                      className={`input input-bordered w-full pl-10 ${errors.contactEmail
                        ? "input-error"
                        : ""
                        }`}
                      {...register(
                        "contactEmail",
                        {
                          required:
                            "Contact email is required",
                          pattern: {
                            value:
                              /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message:
                              "Enter a valid email",
                          },
                        }
                      )}
                    />
                  </div>

                  {errors.contactEmail && (
                    <p className="text-error text-sm mt-1">
                      {
                        errors.contactEmail
                          .message
                      }
                    </p>
                  )}
                </div>

                {/* Phone */}

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Contact Phone
                      <span className="text-error">
                        {" "}
                        *
                      </span>
                    </span>
                  </label>

                  <div className="relative">
                    <Phone
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50"
                    />

                    <input
                      type="tel"
                      placeholder="+8801XXXXXXXXX"
                      className={`input input-bordered w-full pl-10 ${errors.contactPhone
                        ? "input-error"
                        : ""
                        }`}
                      {...register(
                        "contactPhone",
                        {
                          required:
                            "Contact phone is required",
                          minLength: {
                            value: 7,
                            message:
                              "Enter a valid phone number",
                          },
                        }
                      )}
                    />
                  </div>

                  {errors.contactPhone && (
                    <p className="text-error text-sm mt-1">
                      {
                        errors.contactPhone
                          .message
                      }
                    </p>
                  )}
                </div>

                {/* Website */}

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Website
                    </span>
                  </label>

                  <div className="relative">
                    <Globe
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50"
                    />

                    <input
                      type="url"
                      placeholder="https://example.com"
                      className="input input-bordered w-full pl-10"
                      {...register("website")}
                    />
                  </div>
                </div>

                {/* Facebook */}

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Facebook Page
                    </span>
                  </label> <br />

                  <input
                    type="url"
                    placeholder="https://facebook.com/..."
                    className="input input-bordered w-full"
                    {...register("facebook")}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* =================================
              3. LOCATION & SCHEDULE
          ================================= */}

          <div className="card bg-base-100 shadow-sm mb-6">
            <div className="card-body">

              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10">
                  <MapPin
                    size={22}
                    className="text-primary"
                  />
                </div>

                <div>
                  <h2 className="text-xl font-bold">
                    Location & Schedule
                  </h2>

                  <p className="text-sm text-base-content/60">
                    Where and when will your fest happen?
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">

                {/* Venue */}

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Venue
                      <span className="text-error">
                        {" "}
                        *
                      </span>
                    </span>
                  </label> <br />

                  <input
                    type="text"
                    placeholder="Notre Dame College"
                    className={`input input-bordered w-full ${errors.venue
                      ? "input-error"
                      : ""
                      }`}
                    {...register("venue", {
                      required: "Venue is required",
                    })}
                  />

                  {errors.venue && (
                    <p className="text-error text-sm mt-1">
                      {errors.venue.message}
                    </p>
                  )}
                </div>

                {/* City */}

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      City
                      <span className="text-error">
                        {" "}
                        *
                      </span>
                    </span>
                  </label> <br />

                  <input
                    type="text"
                    placeholder="Dhaka"
                    className={`input input-bordered w-full ${errors.city
                      ? "input-error"
                      : ""
                      }`}
                    {...register("city", {
                      required: "City is required",
                    })}
                  />

                  {errors.city && (
                    <p className="text-error text-sm mt-1">
                      {errors.city.message}
                    </p>
                  )}
                </div>

                {/* Start Date */}

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Fest Start Date
                      <span className="text-error">
                        {" "}
                        *
                      </span>
                    </span>
                  </label> <br />

                  <input
                    type="date"
                    className={`input input-bordered w-full ${errors.startDate
                      ? "input-error"
                      : ""
                      }`}
                    {...register("startDate", {
                      required:
                        "Start date is required",
                    })}
                  />

                  {errors.startDate && (
                    <p className="text-error text-sm mt-1">
                      {errors.startDate.message}
                    </p>
                  )}
                </div>

                {/* End Date */}

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Fest End Date
                      <span className="text-error">
                        {" "}
                        *
                      </span>
                    </span>
                  </label> <br />

                  <input
                    type="date"
                    className={`input input-bordered w-full ${errors.endDate
                      ? "input-error"
                      : ""
                      }`}
                    {...register("endDate", {
                      required:
                        "End date is required",
                    })}
                  />

                  {errors.endDate && (
                    <p className="text-error text-sm mt-1">
                      {errors.endDate.message}
                    </p>
                  )}
                </div>

                {/* Registration Deadline */}

                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text font-medium">
                      Registration Deadline
                      <span className="text-error">
                        {" "}
                        *
                      </span>
                    </span>
                  </label> <br />

                  <input
                    type="datetime-local"
                    className={`input input-bordered w-full ${errors.registrationDeadline
                      ? "input-error"
                      : ""
                      }`}
                    {...register(
                      "registrationDeadline",
                      {
                        required:
                          "Registration deadline is required",
                      }
                    )}
                  />

                  {errors.registrationDeadline && (
                    <p className="text-error text-sm mt-1">
                      {
                        errors
                          .registrationDeadline
                          .message
                      }
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* =================================
              4. REGISTRATION SETTINGS
          ================================= */}

          <div className="card bg-base-100 shadow-sm mb-6">
            <div className="card-body">

              <h2 className="text-xl font-bold mb-5">
                Registration Settings
              </h2>

              {/* Registration Required */}

              <label className="flex items-center gap-3 cursor-pointer mb-6">
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  {...register(
                    "registrationRequired"
                  )}
                />

                <div>
                  <p className="font-medium">
                    Registration required
                  </p>

                  <p className="text-sm text-base-content/60">
                    Participants must register before
                    joining your fest.
                  </p>
                </div>
              </label>

              {registrationRequired && (
                <div className="grid md:grid-cols-2 gap-5">

                  {/* Fee */}

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">
                        Fest Registration Fee
                      </span>
                    </label> <br />

                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      className="input input-bordered w-full"
                      {...register(
                        "registrationFee",
                        {
                          valueAsNumber: true,
                          min: {
                            value: 0,
                            message:
                              "Fee cannot be negative",
                          },
                        }
                      )}
                    />

                    {errors.registrationFee && (
                      <p className="text-error text-sm mt-1">
                        {
                          errors.registrationFee
                            .message
                        }
                      </p>
                    )}
                  </div>

                  {/* Max Participants */}

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">
                        Maximum Participants
                      </span>
                    </label> <br />

                    <input
                      type="number"
                      min="1"
                      className="input input-bordered w-full"
                      {...register(
                        "maxParticipants",
                        {
                          valueAsNumber: true,
                          min: {
                            value: 1,
                            message:
                              "Must be at least 1",
                          },
                        }
                      )}
                    />

                    {errors.maxParticipants && (
                      <p className="text-error text-sm mt-1">
                        {
                          errors.maxParticipants
                            .message
                        }
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Visibility */}

              <div className="form-control mt-5">
                <label className="label">
                  <span className="label-text font-medium">
                    Fest Visibility
                  </span> 
                </label><br />

                <select
                  className="select select-bordered w-full"
                  {...register("visibility")}
                >
                  <option value="public">
                    Public
                  </option>

                  <option value="private">
                    Private
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* =================================
              5. EVENTS
          ================================= */}

          <div className="mb-6">

            {/* Event Header */}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">

              <div>
                <h2 className="text-2xl font-bold">
                  Events
                </h2>

                <p className="text-base-content/60 mt-1">
                  Add the competitions and activities
                  inside your fest.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddEvent}
                className="btn btn-primary"
              >
                <Plus size={18} />
                Add Event
              </button>
            </div>

            {/* Event Validation */}

            {errors.events?.root && (
              <div className="alert alert-error mb-5">
                {errors.events.root.message}
              </div>
            )}

            {/* Events */}

            <div className="space-y-6">

              {eventFields.map(
                (field, index) => (
                  <div
                    key={field.id}
                    className="card bg-base-100 shadow-sm"
                  >
                    <div className="card-body">

                      {/* Event Header */}

                      <div className="flex items-center justify-between mb-5">

                        <div className="flex items-center gap-3">
                          <div className="badge badge-primary badge-lg">
                            {index + 1}
                          </div>

                          <h3 className="text-xl font-bold">
                            Event {index + 1}
                          </h3>
                        </div>

                        {eventFields.length > 1 && (
                          <button
                            type="button"
                            className="btn btn-ghost text-error"
                            onClick={() =>
                              remove(index)
                            }
                          >
                            <Trash2 size={18} />
                            Remove
                          </button>
                        )}
                      </div>

                      {/* Event Name + Category */}

                      <div className="grid md:grid-cols-2 gap-5">

                        {/* Name */}

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium">
                              Event Name
                              <span className="text-error">
                                {" "}
                                *
                              </span>
                            </span>
                          </label> <br/>

                          <input
                            type="text"
                            placeholder="Programming Contest"
                            className={`input input-bordered w-full ${errors.events?.[
                              index
                            ]?.name
                              ? "input-error"
                              : ""
                              }`}
                            {...register(
                              `events.${index}.name`,
                              {
                                required:
                                  "Event name is required",
                                minLength: {
                                  value: 2,
                                  message:
                                    "Event name must be at least 2 characters",
                                },
                              }
                            )}
                          />

                          {errors.events?.[
                            index
                          ]?.name && (
                              <p className="text-error text-sm mt-1">
                                {
                                  errors.events[
                                    index
                                  ].name.message
                                }
                              </p>
                            )}
                        </div>

                        {/* Category */}

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium">
                              Category
                              <span className="text-error">
                                {" "}
                                *
                              </span>
                            </span>
                          </label> <br/> 

                          <select
                            className={`select select-bordered w-full${errors.events?.[
                              index
                            ]?.category
                              ? "select-error"
                              : ""
                              }`}
                            {...register(
                              `events.${index}.category`,
                              {
                                required:
                                  "Category is required",
                              }
                            )}
                          >
                            <option value="">
                              Select category
                            </option>

                            <option value="programming">
                              Programming
                            </option>

                            <option value="robotics">
                              Robotics
                            </option>

                            <option value="quiz">
                              Quiz
                            </option>

                            <option value="science">
                              Science
                            </option>

                            <option value="debate">
                              Debate
                            </option>

                            <option value="gaming">
                              Gaming
                            </option>

                            <option value="cultural">
                              Cultural
                            </option>

                            <option value="sports">
                              Sports
                            </option>

                            <option value="business">
                              Business
                            </option>

                            <option value="other">
                              Other
                            </option>
                          </select>

                          {errors.events?.[
                            index
                          ]?.category && (
                              <p className="text-error text-sm mt-1">
                                {
                                  errors.events[
                                    index
                                  ].category.message
                                }
                              </p>
                            )}
                        </div>
                      </div>

                      {/* Event Description */}

                      <div className="form-control mt-5">
                        <label className="label">
                          <span className="label-text font-medium">
                            Event Description
                            <span className="text-error">
                              {" "}
                              *
                            </span>
                          </span>
                        </label> <br/>

                        <textarea
                          rows={4}
                          placeholder="Describe this event..."
                          className={`textarea textarea-bordered min-h-28 w-full ${errors.events?.[
                            index
                          ]?.description
                            ? "textarea-error"
                            : ""
                            }`}
                          {...register(
                            `events.${index}.description`,
                            {
                              required:
                                "Event description is required",
                              minLength: {
                                value: 10,
                                message:
                                  "Description must be at least 10 characters",
                              },
                            }
                          )}
                        />

                        {errors.events?.[
                          index
                        ]?.description && (
                            <p className="text-error text-sm mt-1">
                              {
                                errors.events[
                                  index
                                ].description
                                  .message
                              }
                            </p>
                          )}
                      </div>

                      {/* Participation Settings */}

                      <div className="divider">
                        <Users size={16} />
                        Participation
                      </div>

                      <div className="grid md:grid-cols-3 gap-5">

                        {/* Participation Type */}

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium">
                              Participation Type
                            </span>
                          </label> 
                          <select
                            className="select select-bordered w-full"
                            {...register(
                              `events.${index}.participationType`
                            )}
                          >
                            <option value="individual">
                              Individual
                            </option>

                            <option value="team">
                              Team
                            </option>
                          </select>
                        </div>

                        {/* Max Participants */}

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium">
                              Maximum Participants
                            </span>
                          </label>

                          <input
                            type="number"
                            min="1"
                            className={`input input-bordered ${errors.events?.[
                              index
                            ]?.maxParticipants
                              ? "input-error"
                              : ""
                              }`}
                            {...register(
                              `events.${index}.maxParticipants`,
                              {
                                valueAsNumber: true,
                                min: {
                                  value: 1,
                                  message:
                                    "Must be at least 1",
                                },
                              }
                            )}
                          />

                          {errors.events?.[
                            index
                          ]?.maxParticipants && (
                              <p className="text-error text-sm mt-1">
                                {
                                  errors.events[
                                    index
                                  ].maxParticipants
                                    .message
                                }
                              </p>
                            )}
                        </div>

                        {/* Event Fee */}

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium">
                              Registration Fee
                            </span>
                          </label>

                          <input
                            type="number"
                            min="0"
                            className="input input-bordered"
                            {...register(
                              `events.${index}.registrationFee`,
                              {
                                valueAsNumber: true,
                                min: {
                                  value: 0,
                                  message:
                                    "Fee cannot be negative",
                                },
                              }
                            )}
                          />
                        </div>
                      </div>

                      {/* Schedule */}

                      <div className="divider">
                        <CalendarDays size={16} />
                        Event Schedule
                      </div>

                      <div className="grid md:grid-cols-4 gap-5">

                        {/* Date */}

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium">
                              Date
                              <span className="text-error">
                                {" "}
                                *
                              </span>
                            </span>
                          </label>

                          <input
                            type="date"
                            className={`input input-bordered ${errors.events?.[
                              index
                            ]?.date
                              ? "input-error"
                              : ""
                              }`}
                            {...register(
                              `events.${index}.date`,
                              {
                                required:
                                  "Event date is required",
                              }
                            )}
                          />

                          {errors.events?.[
                            index
                          ]?.date && (
                              <p className="text-error text-sm mt-1">
                                {
                                  errors.events[
                                    index
                                  ].date.message
                                }
                              </p>
                            )}
                        </div>

                        {/* Start Time */}

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium">
                              Start Time
                              <span className="text-error">
                                {" "}
                                *
                              </span>
                            </span>
                          </label>

                          <input
                            type="time"
                            className={`input input-bordered ${errors.events?.[
                              index
                            ]?.startTime
                              ? "input-error"
                              : ""
                              }`}
                            {...register(
                              `events.${index}.startTime`,
                              {
                                required:
                                  "Start time is required",
                              }
                            )}
                          />

                          {errors.events?.[
                            index
                          ]?.startTime && (
                              <p className="text-error text-sm mt-1">
                                {
                                  errors.events[
                                    index
                                  ].startTime.message
                                }
                              </p>
                            )}
                        </div>

                        {/* End Time */}

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium">
                              End Time
                              <span className="text-error">
                                {" "}
                                *
                              </span>
                            </span>
                          </label>

                          <input
                            type="time"
                            className={`input input-bordered ${errors.events?.[
                              index
                            ]?.endTime
                              ? "input-error"
                              : ""
                              }`}
                            {...register(
                              `events.${index}.endTime`,
                              {
                                required:
                                  "End time is required",
                              }
                            )}
                          />

                          {errors.events?.[
                            index
                          ]?.endTime && (
                              <p className="text-error text-sm mt-1">
                                {
                                  errors.events[
                                    index
                                  ].endTime.message
                                }
                              </p>
                            )}
                        </div>

                        {/* Event Venue */}

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium">
                              Event Venue
                              <span className="text-error">
                                {" "}
                                *
                              </span>
                            </span>
                          </label>

                          <input
                            type="text"
                            placeholder="Lab 1"
                            className={`input input-bordered ${errors.events?.[
                              index
                            ]?.venue
                              ? "input-error"
                              : ""
                              }`}
                            {...register(
                              `events.${index}.venue`,
                              {
                                required:
                                  "Event venue is required",
                              }
                            )}
                          />

                          {errors.events?.[
                            index
                          ]?.venue && (
                              <p className="text-error text-sm mt-1">
                                {
                                  errors.events[
                                    index
                                  ].venue.message
                                }
                              </p>
                            )}
                        </div>
                      </div>

                      {/* Prize */}

                      <div className="divider">
                        <Trophy size={16} />
                        Prize & Rules
                      </div>

                      <div className="form-control mb-5">
                        <label className="label">
                          <span className="label-text font-medium">
                            Prize
                          </span>
                        </label> <br/>

                        <input
                          type="text"
                          placeholder="Champion: ৳10,000 + Trophy"
                          className="input input-bordered w-full"
                          {...register(
                            `events.${index}.prize`
                          )}
                        />
                      </div>

                      {/* Rules */}

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium">
                            Rules & Instructions
                          </span>
                        </label> <br/>

                        <textarea
                          rows={5}
                          placeholder="Enter the rules and instructions for participants..."
                          className="textarea textarea-bordered min-h-32 w-full"
                          {...register(
                            `events.${index}.rules`
                          )}
                        />
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* =================================
              SUBMIT SECTION
          ================================= */}

          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">

              <div className="flex flex-col sm:flex-row justify-between items-center gap-5">

                <div>
                  <h3 className="text-lg font-bold">
                    Ready to create your fest?
                  </h3>

                  <p className="text-sm text-base-content/60">
                    You can modify your fest and events
                    later.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary btn-lg"
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading loading-spinner" />
                      Creating...
                    </>
                  ) : (
                    "Create Fest"
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFest;