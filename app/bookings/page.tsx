import { redirect } from "next/navigation";
import { verifySession } from "@/features/user/repository/user.repository";
import { prisma } from "@/lib/prisma";
import Footer from "@/shared/components/footer";
import Header from "@/shared/components/header";
import BookingsClient from "./_components/bookingsClient";

const BookingsPage = async () => {
  const session = await verifySession();

  if (!session) {
    redirect("/");
  }

  const bookings = await prisma.booking.findMany({
    where: {
      userId: session.id,
    },
    include: {
      service: {
        include: {
          barber: {
            include: {
              user: true,
            },
          },
        },
      },
    },
    orderBy: {
      date: "asc",
    },
  });

  return (
    <div className="flex min-h-screen flex-1 flex-col justify-between">
      <div>
        <Header />
        <BookingsClient bookings={bookings} />
      </div>
      <Footer />
    </div>
  );
};

export default BookingsPage;
