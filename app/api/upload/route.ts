import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (
        pathname,
        /* clientPayload */
      ) => {
        /**
         * Generate a client token for direct browser-to-blob uploads.
         * For production, you should add authentication here (e.g., check if the user is an admin).
         */
        return {
          allowedContentTypes: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4'],
          tokenPayload: JSON.stringify({
            // Optional data to include in the token
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // This is called when the upload is finished.
        console.log('Blob upload completed:', blob, tokenPayload);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 },
    );
  }
}
