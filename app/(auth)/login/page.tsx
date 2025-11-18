import Form from "@/app/_components/form/Form";
import Image from "next/image";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <Image
        src={"/Background.png"}
        alt="Background"
        fill
        className="-z-10 object-cover brightness-50"
      />
      <div
        className={
          "isolate aspect-video w-108 rounded-xl bg-white/40 p-12 shadow-lg ring-1 ring-black/5 backdrop-blur-3xl"
        }
      >
        <h1 className="mb-4 text-center text-2xl font-bold">Fazer login</h1>

        <Form />
      </div>
    </main>
  );
}
