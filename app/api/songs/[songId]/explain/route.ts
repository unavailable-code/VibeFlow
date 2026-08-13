import { db } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ songId: string }> }
) {
    try {
        const { songId } = await context.params

        const song = await db.song.findUnique({
            where: { id: songId }
        })

        if (!song) {
            return NextResponse.json({ error: "Song not found" }, { status: 404 })
        }

        // Return cached explanation if it exists
        if (song.explanation) {
            return NextResponse.json({ explanation: song.explanation })
        }

        // Get key
        const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
        if (!apiKey) {
            return NextResponse.json({
                error: "Please add GEMINI_API_KEY to your .env file."
            }, { status: 400 })
        }

        if (!song.plainLyrics || song.plainLyrics.trim().length === 0) {
            return NextResponse.json({ error: "No lyrics available for this song to explain." }, { status: 400 })
        }

        const ai = new GoogleGenAI({ apiKey })

        // Try standard Gemini models with the official SDK
        const models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"]
        let explanationText = ""
        let lastError = ""

        for (const model of models) {
            try {
                const response = await ai.models.generateContent({
                    model,
                    contents: [
                        {
                            role: "user",
                            parts: [
                                {
                                    text: `Explain the meaning and lyrics of the following song in English. Provide a clean, insightful explanation, and format it beautifully with sections using markdown. Do not include introductory text, start directly with the title or first section. Here are the lyrics:\n\n${song.plainLyrics}`
                                }
                            ]
                        }
                    ]
                })

                if (response.text) {
                    explanationText = response.text
                    break
                }
            } catch (e: any) {
                lastError = `Model ${model} failed: ${e.message || e}`
            }
        }

        if (!explanationText) {
            throw new Error(`Gemini generateContent failed. Last error: ${lastError}`)
        }

        // Save to DB
        const updatedSong = await db.song.update({
            where: { id: songId },
            data: { explanation: explanationText }
        })

        return NextResponse.json({ explanation: updatedSong.explanation })
    } catch (e: any) {
        return NextResponse.json({ error: e.message || `${e}` }, { status: 500 })
    }
}
