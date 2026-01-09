import { redirect } from "next/navigation";
import { getBookingsUser } from "@/features/booking/functions/get-bookings";
import { verifySession } from "@/features/user/repository/user.repository";
import BookingsClient from "./_components/bookingsClient";

const BookingsPage = async () => {
  const session = await verifySession();

  if (!session) {
    redirect("/");
  }

  const bookings = await getBookingsUser(session.id);

  return (
    <div className="flex min-h-screen flex-1 flex-col justify-between">
      <BookingsClient bookings={bookings} />
    </div>
  );
};

export default BookingsPage;
