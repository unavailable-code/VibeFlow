// app/api/test-b2/route.ts
import B2 from "backblaze-b2"
import { NextResponse } from "next/server"

export async function GET() {
  const b2 = new B2({
    applicationKeyId: process.env.B2_KEY_ID!,
    applicationKey: process.env.B2_APPLICATION_KEY!,
  })

  await b2.authorize()

  const res = await b2.listBuckets()

  return NextResponse.json(res.data.buckets)
}