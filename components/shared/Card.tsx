import { IEvent } from "@/lib/mongodb/database/models/event.model";
import { formatDateTime } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { DeleteConfirmation } from "./DeleteConfirmation";

type CardProps = {
  event: IEvent;
  hasOrderLink?: boolean;
  hidePrice?: boolean;
};

const Card = async ({ event, hasOrderLink, hidePrice }: CardProps) => {
  const authorise = await auth();
  const { sessionClaims } = authorise;
  const userId = sessionClaims?.userId as string;

  const imageHD = event?.images?.find((image: any) => image.width > 2000);  

  const eventId = event.id || event._id
  const eventTitle = event.name || event.title
  const eventImage = imageHD?.url || event.imageUrl
  const eventDate = event.dates?.start?.dateTime || event.startDateTime;
  const eventCategory = event?.category ? event.category.name : event?.classifications[0]?.genre?.name === "Undefined" ? "Other" : event?.classifications[0]?.genre?.name;
  const eventOrganizer = event.organizer ? `By ${event.organizer?.firstName} ${event.organizer?.lastName}` : "Ticketmaster"
  const eventPrice = event.priceRanges?.[0]?.min
    ? new Intl.NumberFormat("en-UK", { style: "currency", currency: "GBP" }).format(
        parseFloat(event.priceRanges[0].min)
      )
    : event.isFree
    ? "FREE"
    : event.price ? new Intl.NumberFormat("en-UK", { style: "currency", currency: "GBP" }).format(
      parseFloat(event.price)
    ) : "Varies"

  const isEventCreator = userId === event.organizer?._id && event.organizer



  return (
    <div className="group relative flex min-h-[360px] w-full max-w-[400px] flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg md:min-h-[438px]">
      <Link
        href={`/events/${eventId}`}
        style={{ backgroundImage: `url(${eventImage})` }}
        className="flex-center flex-grow bg-gray-50 bg-cover bg-center text-grey-500"
      />

      {/* IS EVENT CREATOR? */}
      {isEventCreator && !hidePrice && (
        <div className="absolute right-2 top-2 flex flex-col gap-4 rounded-xl bg-white p-3 shadow-sm transiton-all">
          <Link href={`/events/${eventId}/update`}>
            <Image src="/assets/icons/edit.svg" alt="event image" width={20} height={20} />
          </Link>
          <DeleteConfirmation eventId={eventId} />
        </div>
      )}

      <div className="flex min-h-[230px] flex-col gap-3 p-5 md:gap-4">
        {!hidePrice && (
          <div className="flex gap-2">
            <span className="p-semibold-14 w-min rounded-full bg-green-100 px-4 py-1 text-green-60 text-center items-center justify-center flex">
              {eventPrice}
            </span>
            <p className="p-semibold-14 w-min rounded-full bg-grey-500/10 px-4 py-1 text-grey-500 flex items-center justify-center text-center">
              {eventCategory}
            </p>
          </div>
        )}

        <p className="p-medium-16 p-medium-18 text-grey-500">
          {formatDateTime(eventDate).dateTime}
        </p>
        <Link href={`/events/${eventId}`}>
          <p className="p-medium-16 md:p-medium-20 line-clamp-2 flex-1 text-black">
            {eventTitle}
          </p>
        </Link>

        <div className="flex-between w-full">
          <p className="p-medium-14 md:p-medium-16 text-grey-600">{eventOrganizer}</p>

          {hasOrderLink && (
            <Link href={`/orders?eventId=${eventId}`} className="flex gap-2">
              <p className="text-primary-500">Order Details</p>
              <Image src="/assets/icons/arrow.svg" alt="search" width={10} height={10} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};


export default Card;
