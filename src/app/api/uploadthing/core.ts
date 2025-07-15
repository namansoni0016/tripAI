import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const auth = () => ({ id: "fakeId" });

export const ourFileRouter = {
    imageUploader: f({
        image: {
            maxFileSize: "4MB",
            maxFileCount: 1,
        },  
    }).middleware(async ({ req }) => {
        const user = await auth();
        if (!user) throw new UploadThingError("Unauthorized");
        return { userId: user.id };
    }).onUploadComplete(async ({ metadata, file }) => {
        console.log(file);
        return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
