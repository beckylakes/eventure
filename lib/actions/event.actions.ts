"use server";

import { revalidatePath } from "next/cache";

import { connectToDatabase } from "../mongodb/database/index";
import Event from "../mongodb/database/models/event.model";
import User from "../mongodb/database/models/user.model";
import Category from "../mongodb/database/models/category.model";
import { handleError } from "../utils";

import {
  CreateEventParams,
  UpdateEventParams,
  DeleteEventParams,
  GetAllEventsParams,
  GetEventsByUserParams,
  GetRelatedEventsByCategoryParams,
} from "@/types";
import mongoose from "mongoose";

const getCategoryByName = async (name: string) => {
  return Category.findOne({ name: { $regex: name, $options: 'i' } })
}

const populateEvent = (query: any) => {
  return query
    .populate({
      path: "organizer",
      model: User,
      select: "_id firstName lastName",
    })
    .populate({ path: "category", model: Category, select: "_id name" });
};

// CREATE
export async function createEvent({ userId, event, path }: CreateEventParams) {
  try {
    await connectToDatabase();

    const organizer = await User.findById(userId);
    if (!organizer) throw new Error("Organiser not found");

    const newEvent = await Event.create({
      ...event,
      category: event.categoryId,
      organizer: userId,
    });
    revalidatePath(path);

    return JSON.parse(JSON.stringify(newEvent));
  } catch (error) {
    console.log("Error in createEvent", error);
    handleError(error);
  }
}

// GET ONE EVENT BY ID
export async function getEventById(eventId: string) {
  try {
    await connectToDatabase();

    const event = await populateEvent(Event.findById(eventId));

    if (!event) throw new Error("Event not found");

    return JSON.parse(JSON.stringify(event));
  } catch (error) {
    handleError(error);
  }
}

// UPDATE
export async function updateEvent({ userId, event, path }: UpdateEventParams) {
  try {
    await connectToDatabase();

    const eventToUpdate = await Event.findById(event._id);
    if (!eventToUpdate || eventToUpdate.organizer.toHexString() !== userId) {
      throw new Error("Unauthorized or event not found");
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      event._id,
      { ...event, category: event.categoryId },
      { new: true }
    );
    revalidatePath(path);

    return JSON.parse(JSON.stringify(updatedEvent));
  } catch (error) {
    handleError(error);
  }
}

// DELETE
export async function deleteEvent({ eventId, path }: DeleteEventParams) {
  try {
    await connectToDatabase();

    const deletedEvent = await Event.findByIdAndDelete(eventId);
    if (deletedEvent) revalidatePath(path);
  } catch (error) {
    handleError(error);
  }
}

// GET ALL EVENTS
export async function getAllEvents({
  query,
  limit = 6,
  page,
  category,
}: GetAllEventsParams) {
  try {
    await connectToDatabase();
    const now = new Date();
    const titleCondition = query
      ? { title: { $regex: query, $options: "i" } }
      : {};
    const categoryCondition = category
      ? await getCategoryByName(category)
      : null;
    const conditions = {
      $and: [
        titleCondition,
        categoryCondition ? { category: categoryCondition._id } : {},
        { startDateTime: { $gte: now } } 
      ],
    };

    const skipAmount = (Number(page) - 1) * limit;
    const eventsQuery = Event.find(conditions)
      .sort({ startDateTime: "asc" })
      .skip(skipAmount)
      .limit(limit);

    const events = await populateEvent(eventsQuery);
    const eventsCount = await Event.countDocuments(conditions);

    return {
      data: JSON.parse(JSON.stringify(events)),
      totalPages: Math.ceil(eventsCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
}

// GET EVENTS BY ORGANIZER
export async function getEventsByUser({
  userId,
  limit = 6,
  page,
}: GetEventsByUserParams) {
  try {
    await connectToDatabase();

    const conditions = { organizer: userId };
    const skipAmount = (page - 1) * limit;

    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(limit);

    const events = await populateEvent(eventsQuery);
    const eventsCount = await Event.countDocuments(conditions);

    return {
      data: JSON.parse(JSON.stringify(events)),
      totalPages: Math.ceil(eventsCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
}

// GET RELATED EVENTS: EVENTS WITH SAME CATEGORY
export async function getRelatedEventsByCategory({
  categoryName,
  eventId,
  tmEventId,
  limit = 3,
  page = 1,
}: GetRelatedEventsByCategoryParams) {
  try {
    await connectToDatabase();
    if(categoryName === "Other") categoryName = "Pop"

    const skipAmount = (Number(page) - 1) * limit;
    const category = await Category.findOne({ name: categoryName }).select("_id");

    if (!category) {
      console.warn(`Category '${categoryName}' not found in database.`);
      return { data: [], totalPages: 0 };
    }

    const now = new Date();
    const conditions: any = { 
      category: category._id,
      date: { $gte: now }
    };
    
    if (eventId && mongoose.isValidObjectId(eventId)) {
      conditions._id = { $ne: eventId };
    }

    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(limit);

    const events = await populateEvent(eventsQuery);
    const eventsCount = await Event.countDocuments(conditions);

    return {
      data: JSON.parse(JSON.stringify(events)),
      totalPages: Math.ceil(eventsCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
}

// GET EVENTS FROM API
export async function getAllTMEvents({
  query,
  limit = 6,
  page,
  category,
  currentTmEventId
}: GetAllEventsParams) {
  try {
    console.log("Fetching events from Ticketmaster API...");
    if(category === "Other") category = "Music"

    const now = new Date();
    const formattedNow = now.toISOString().slice(0, 19) + "Z";

    const baseUrl = "https://app.ticketmaster.com/discovery/v2/events.json";
    const apiKey = process.env.TICKETMASTER_API_KEY as string;
    const classificationName = category && category !== "All" ? category : "music";

    const params = new URLSearchParams({
      keyword: query,
      sort: "date,name,asc",
      city: "london",
      startDateTime: formattedNow,
      size: limit.toString(),
      page: page.toString(),
      apikey: apiKey,
    });

    const response = await fetch(
      `${baseUrl}?classificationName=${classificationName}&${params.toString()}`
    );
    const data = await response.json();

    if (!data._embedded) return { data: [], totalPages: 0 };

    // Filter out the current event from the API results
    const filteredEvents = data._embedded.events.filter(
      (event: any) => event.id !== currentTmEventId
    );

    return {
      data: filteredEvents,
      totalPages: data.page?.totalPages,
    };
  } catch (error) {
    console.error("Oops! Failed to fetch Ticketmaster events:", error);
    handleError(error);
  }
}


// GET TM EVENT BY ID
export async function getTMEventById(eventId: string) {
  try {
    console.log(`Fetching event with ${eventId}...`);
    const apiKey = process.env.TICKETMASTER_API_KEY;

    const response = await fetch(
      `https://app.ticketmaster.com/discovery/v2/events/${eventId}.json?apikey=${apiKey}`
    );

    if(!response.ok) console.log('Oops')
    const data = await response.json();

    return data || [];
  } catch (error) {
    console.error("Oops! Failed to fetch event:", error);
    handleError(error)
  }
}
