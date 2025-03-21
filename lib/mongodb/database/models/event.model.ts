import { models, model, Schema, Document } from "mongoose";

export interface IEvent extends Document {
  _id: string;
  title: string;
  name: string;
  description?: string;
  location?: string;
  createdAt: Date;
  imageUrl: string;
  images: { url: string }[];
  startDateTime: Date;
  endDateTime: Date;
  dates: { start: { dateTime: Date } };
  price: string;
  priceRanges: {min: string }[]
  isFree: boolean;
  url?: string;
  category: { _id: string; name: string };
  classifications: { genre: { name: string } }[];
  organizer: { _id: string; firstName: string; lastName: string };
}

const EventSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  location: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  imageUrl: { type: String, required: true },
  startDateTime: { type: Date, required: true },
  endDateTime: { type: Date, required: true },
  price: { type: String },
  isFree: { type: Boolean, default: false },
  url: { type: String },
  category: { type: Schema.Types.ObjectId, ref: "Category" },
  organizer: { type: Schema.Types.ObjectId, ref: "User" },
});

const Event = models.Event || model("Event", EventSchema);

export default Event;
