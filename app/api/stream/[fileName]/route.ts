import B2 from "backblaze-b2"
// /api/stream/[fileName]/route.ts
let cachedAuth: { downloadUrl: string; token: string; expiry: number } | null = null

export async function GET(req: Request, { params }: { params: Promise<{ fileName: string }> }) {
    try {
        const param = await params

        // Reuse auth for 55 mins instead of re-authorizing every request
        if (!cachedAuth || Date.now() > cachedAuth.expiry) {
            const b2 = new B2({
                applicationKey: process.env.B2_APPLICATION_KEY!,
                applicationKeyId: process.env.B2_KEY_ID!
            })
            const authRes = await b2.authorize()
            const auth = await b2.getDownloadAuthorization({
                bucketId: process.env.B2_BUCKET_ID!,
                fileNamePrefix: "",
                validDurationInSeconds: 3600
            })
            cachedAuth = {
                downloadUrl: authRes.data.downloadUrl,
                token: auth.data.authorizationToken,
                expiry: Date.now() + 55 * 60 * 1000
            }
        }

        const url = `${cachedAuth.downloadUrl}/file/${process.env.B2_BUCKET_NAME}/${param.fileName}?Authorization=${cachedAuth.token}`
        const range = req.headers.get("range")

        const response = await fetch(url, {
            headers: range ? { Range: range } : {}
        })

        return new Response(response.body, {
            status: response.status,
            headers: {
                "Content-Type": "audio/mpeg",
                "Accept-Ranges": "bytes",
                "Content-Length": response.headers.get("content-length") || "",
                "Content-Range": response.headers.get("content-range") || "",
                "Cache-Control": "private, max-age=3600"
            }
        })
    } catch (e) {
        console.log(e)
        return new Response("Error streaming", { status: 400 })
    }
}