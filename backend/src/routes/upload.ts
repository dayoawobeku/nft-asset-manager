import {v2 as cloudinary} from 'cloudinary';
import {z} from 'zod';
import {t, TRPCError} from '../trpc';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const fileInput = z.object({
  filename: z.string(),
  mimetype: z.string(),
  buffer: z.array(z.number().int().min(0).max(255)),
});

export const uploadRouter = t.router({
  uploadFile: t.procedure.input(fileInput).mutation(async ({input}) => {
    try {
      const {filename, buffer} = input;

      const bufferData = Buffer.from(buffer);

      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'auto',
            folder: 'assets',
            public_id: `${Date.now()}-${filename}`,
          },
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload error:', error);
              reject(error);
            } else {
              console.log('Cloudinary upload successful:', result?.secure_url);
              resolve(result);
            }
          },
        );
        uploadStream.end(bufferData);
      });

      return {url: (result as {secure_url: string}).secure_url};
    } catch (error) {
      console.error('Upload error:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error instanceof Error ? error.message : 'Upload failed',
      });
    }
  }),
});
