import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Footer from "@/shared/components/footer";
import Header from "@/shared/components/header";
import BookingsClient from "./_components/bookingsClient";

const BookingsPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/");
  }

  const bookings = await prisma.booking.findMany({
    where: {
      userId: session.user.id,
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
