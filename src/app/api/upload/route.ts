import { handleUpload, type HandleUploadBody } from "@vercel/blob/client"
import { NextResponse } from "next/server"

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        // Implement your authentication logic here
        // For example, you could check if the user is logged in
        // const session = await getSession(request);
        // if (!session) throw new Error('Unauthorized');

        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/gif"],
          tokenPayload: JSON.stringify({
            // You can add custom data here, like user ID
            // userId: session.user.id
          }),
        }
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // This code runs after the upload is completed
        console.log("Upload completed:", blob)

        // You can perform additional actions here, like saving the URL to a database
        // const { userId } = JSON.parse(tokenPayload);
        // await db.update({ avatar: blob.url, userId });
      },
    })

    return NextResponse.json(jsonResponse)
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}

