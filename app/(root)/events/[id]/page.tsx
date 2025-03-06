import CheckoutButton from "@/components/shared/CheckoutButton";
import Collection from "@/components/shared/Collection";
import { Button } from "@/components/ui/button";
import {
  getAllTMEvents,
  getEventById,
  getRelatedEventsByCategory,
  getTMEventById,
} from "@/lib/actions/event.actions";
import { getOrdersByEvent, getOrdersByUser } from "@/lib/actions/order.actions";
import { formatDateTime } from "@/lib/utils";
import { SearchParamProps } from "@/types";
import { ExternalLinkIcon } from "lucide-react";
import { isValidObjectId } from "mongoose";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import Error from "@/components/shared/Error";

const EventDetails = async (props: SearchParamProps) => {
  const finalParams = await props.params;
  const finalSearchParams = await props.searchParams;
  const { id } = finalParams;
  const authorise = await auth();
  const { sessionClaims } = authorise;
  const userId = sessionClaims?.userId as string;

  const isValidId = id.length > 23 && isValidObjectId(id);

  const event = isValidId && (await getEventById(id));
  const tmEvent = !isValidId && (await getTMEventById(id));

  const isEventCreator = !tmEvent && !event.error && event?.organizer._id === userId;
  const userOrders = await getOrdersByUser({ userId, page: 1 });
  const hasBoughtTicket = userOrders?.data.some(
    (order: any) => order.event?._id === id
  );

  const imageHD = tmEvent?.images?.find((image: any) => image.width > 2000);

  const eventTitle = tmEvent ? tmEvent.name : event.title;
  const eventImage = tmEvent
  ? imageHD?.url || "/path/to/default-image.jpg"
  : event?.imageUrl || "/path/to/default-image.jpg";
  const eventCategory = tmEvent
  ? tmEvent.classifications?.[0]?.genre?.name === "Undefined"
    ? "Other"
    : tmEvent.classifications?.[0]?.genre?.name || "Other"
  : event?.category?.name || "Other";
  const eventPrice = tmEvent?.priceRanges?.[0].min
    ? `From ${new Intl.NumberFormat("en-UK", {
        style: "currency",
        currency: "GBP",
      }).format(parseFloat(tmEvent.priceRanges[0].min))}`
    : event
    ? new Intl.NumberFormat("en-UK", {
        style: "currency",
        currency: "GBP",
      }).format(parseFloat(event?.price))
    : "Check the official website";
    const eventStartDateTime = tmEvent
    ? tmEvent.dates?.start?.dateTime || new Date().toISOString()
    : event?.startDateTime || new Date().toISOString();
    const eventLocation = tmEvent
    ? tmEvent._embedded?.venues?.[0]?.city?.name || "Location not available"
    : event?.location || "Location not available";
  const eventDescription =
    tmEvent?.description ||
    tmEvent?.info ||
    tmEvent?.pleaseNote ||
    event?.description ||
    "More details about this event will be available soon.";
  const eventUrl = tmEvent ? tmEvent.url : event.url;
  const eventOrganizer = tmEvent
  ? `Ticketmaster`
  : `${event?.organizer?.firstName || "Unknown"} ${event?.organizer?.lastName || "Organizer"}`;

  const relatedEvents = (await getRelatedEventsByCategory({
    categoryName: event
      ? event?.category?.name || "Music"
      : tmEvent?.classifications?.[0]?.genre?.name || "Music",
    eventId: event?._id,
    tmEventId: tmEvent?.id,
    page: finalSearchParams.page as string,
  })) || { data: [], totalPages: 0 };

  const relatedTMEvents = (await getAllTMEvents({
    query: "",
    limit: 3,
    page: 1,
    category: tmEvent
      ? tmEvent?.classifications?.[0]?.genre?.name
      : event?.category?.name || "Music",
    currentTmEventId: tmEvent?.id,
  })) || { data: [], totalPages: 0 };

  const allRelatedEvents = [
    ...(relatedEvents?.data || []),
    ...(relatedTMEvents?.data || []),
  ];

  return (
    <>
      {event?.error || tmEvent?.error ? (
        <Error status={event?.error?.status || tmEvent?.error.status} message={event?.error?.message || tmEvent?.error.message} />
      ) : (
        <>
          <section className="flex justify-center bg-primary-50 bg-dotted-pattern bg-contain">
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:max-w-7xl">
              <Image
                src={eventImage}
                alt="hero image"
                width={1000}
                height={1000}
                className="h-full min-h-[300px] object-cover object-center max-h-[700px] md:min-w-[650px]"
              />
              <div className="flex w-full flex-col gap-8 p-5 md:p-10">
                <div className="flex flex-col gap-6">
                  <h2 className="h2-bold">{eventTitle}</h2>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center align-center">
                    <div className="flex gap-3">
                      <p className="p-bold-16 rounded-full bg-green-500/10 px-8 py-2 text-green-700 text-center">
                        {tmEvent
                          ? eventPrice
                          : event.isFree
                          ? "FREE"
                          : `${eventPrice}`}
                      </p>
                      <p className="p-medium-16 rounded-full bg-grey-500/10 px-4 py-2.5 text-grey-600 flex justify-center text-center items-center">
                        {eventCategory}
                      </p>
                    </div>
                    <p className="p-medium-18 ml-2 mt-2 sm:mt-0 inline-flex whitespace-nowrap">
                      by{" "}
                      <span className="text-primary-500 ml-1 truncate">
                        {eventOrganizer}
                      </span>
                    </p>
                  </div>
                </div>

                {tmEvent && (
                  <div className="flex flex-col items-center gap-3 sm:items-start">
                    <div className="flex gap-3 ">
                      <Button
                        asChild
                        className="button rounded-full px-6 py-3 text-lg font-semibold"
                      >
                        <Link
                          href={eventUrl || "/"}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Get Tickets from the Official Seller*{" "}
                          <ExternalLinkIcon className="ml-2" />
                        </Link>
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600">
                      *You’ll be redirected to the official ticketing page for
                      purchase.
                    </p>
                  </div>
                )}

                {/*CHECKOUT BUTTON*/}
                <div className="flex gap-3 ">
                  {event && !tmEvent ? (
                    isEventCreator ? (
                      <Button
                        asChild
                        className="button rounded-full px-6 py-3 text-lg font-semibold"
                      >
                        <Link href={`/events/${event._id}/update`}>
                          Edit Event
                        </Link>
                      </Button>
                    ) : !hasBoughtTicket ? (
                      <CheckoutButton event={event} />
                    ) : (
                      <Button
                        asChild
                        className="button rounded-full px-6 py-3 text-lg font-semibold bg-green-600"
                      >
                        <Link href="/profile">You're going! View Tickets?</Link>
                      </Button>
                    )
                  ) : null}
                </div>

                <div className="flex flex-col gap-5">
                  <div className="flex gap-2 md:gap-3">
                    <Image
                      src="/assets/icons/calendar.svg"
                      alt="calendar"
                      width={32}
                      height={32}
                    />
                    <div className="p-medium-16 lg:p-regular-20 flex flex-wrap items-center">
                      <p>
                        {formatDateTime(eventStartDateTime).dateOnly} at{" "}
                        {formatDateTime(eventStartDateTime).timeOnly}
                      </p>
                    </div>
                  </div>

                  <div className="p-regular-20 flex items-center gap-3">
                    <Image
                      src="/assets/icons/location.svg"
                      alt="location"
                      width={32}
                      height={32}
                    />
                    <p className="p-medium-16 lg:p-regular-20">
                      {eventLocation}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <p className="p-bold-20 text-grey-600">About this event:</p>
                  <p className="p-medium-16 lg:p-regular-18 line-clamp-6">
                    {eventDescription}
                  </p>
                  <a
                    href={eventUrl}
                    className="p-medium-16 lg:p-regular-18 truncate text-primary-500 underline"
                    target="_blank"
                  >
                    {eventUrl}
                  </a>
                </div>
              </div>
            </div>
          </section>
          {/* EVENTS FROM THE SAME CATEGORY */}
          <section className="wrapper my-8 flex flex-col gap-8 md:gap-12">
            <h2 className="h2-bold">Related Events</h2>
            <Collection
              data={allRelatedEvents}
              emptyTitle="No Events Found"
              emptyStateSubtext="Come back later"
              collectionType="All_Events"
              limit={3}
              page={finalSearchParams.page as string}
              totalPages={relatedEvents?.totalPages}
            />
          </section>
        </>
      )}
    </>
  );
};

export default EventDetails;
