import Error from "@/components/shared/Error";
import EventForm from "@/components/shared/EventForm";
import { getEventById } from "@/lib/actions/event.actions";
import { auth } from "@clerk/nextjs/server";

type UpdateEventProps = {
  params: Promise<{ id: string }>;
};

const UpdateEvent = async (props: UpdateEventProps) => {
  const finalParams = await props.params;
  const { id } = finalParams;
  const authorise = await auth();
  const { sessionClaims } = authorise;

  const userId = sessionClaims?.userId as string;
  const event = await getEventById(id);

  const isEventCreator = event.organizer?._id !== userId
    ? { error: { status: 403, message: "You do not have permission to view this page" } }
    : false;

  return isEventCreator ? (
    <Error status={isEventCreator.error.status} message={isEventCreator.error.message} />
  ) : (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left">
          Update Event
        </h3>
      </section>
      <div className="wrapper my-8">
        <EventForm
          userId={userId}
          type="Update"
          event={event}
          eventId={event._id}
        />
      </div>
    </>
  );
};

export default UpdateEvent;
