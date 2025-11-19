import {
  createUploadthing,
  createRouteHandler,
  type FileRouter,
} from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      // Aqui você bota sua auth real depois
      return { userId: "fake-id" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for:", metadata.userId);
      console.log("File URL:", file.url); // Notar: agora é file.url

      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

// Gera automaticamente GET e POST pro route handler
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
