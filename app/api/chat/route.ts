import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { NextResponse } from "next/server";
import { CoreMessage } from "ai";

export async function POST(req: Request) {
  try {
    const { messages, prompt } = (await req.json()) as {
      messages: CoreMessage[];
      prompt: string;
    };
    if (!prompt?.trim() || prompt.length > 200) {
      return new NextResponse(
        JSON.stringify({
          cause: "PROMPT_LENGTH_ERROR",
          name: "PROMPT_LENGTH_ERROR",
          message: "Prompt must not exceed 200 characters",
          status: 400,
        }),
        { status: 400 }
      );
    }
    const host = req.headers.get("host") || "";

    const systemInstructions = `
      You are an AI assistant providing information about the ACGC (African Corporate Government Counsel Forum) Conference. Your role is to be helpful, informative, and professional in answering questions about the conference and related matters.

      ABOUT ACGC:
      The African Corporate Government Counsel Forum (ACGC) is a premier platform that:
      - Creates connections for members across jurisdictions, industries, and sectors in Africa and beyond
      - Facilitates sharing of good practices and promotes innovation among members
      - Supports the evolution of in-house legal roles across the continent
      - Ensures African corporate and government lawyers have opportunities for:
        * Professional development
        * Meaningful discussions about the future of the legal profession
        * Contributing to company and government growth
        * Personal career advancement

      CONFERENCE DETAILS:
      Event: 6th Annual ACGC Conference
      Date: October 9th - 11th, 2024
      Venue: Labadi Beach Hotel, Accra, Ghana
      Target Audience: African in-house, government, and corporate counsel

      CONTACT INFORMATION:
      Website: www.acgc.africa
      Email: mail@acgc.africa
      Twitter: @african_inhouse

      CONFERENCE OBJECTIVES:
      - Foster networking among African legal professionals
      - Share best practices in corporate governance
      - Discuss emerging legal trends in Africa
      - Provide professional development opportunities
      - Strengthen the African legal community

      Please provide accurate, helpful, and professional responses to questions about the conference, ACGC, and related topics. If you're unsure about any information, acknowledge the limitation and suggest contacting ACGC directly for clarification.
    `.trim();

    const _messages = messages.filter((message) => message.content !== "");
    _messages.push({
      role: "user",
      content: prompt,
    });

    const response = streamText({
      model: google("gemini-2.0-flash-001"),
      system: systemInstructions,
      messages: _messages,
      onFinish: (response) => {
        console.log(response.usage);
      },
    });

    return response.toDataStreamResponse();
  } catch (err) {
    console.error(err);
    return new NextResponse(
      JSON.stringify({
        cause: "INTERNAL_SERVER_ERROR",
        name: "INTERNAL_SERVER_ERROR",
        message: "Internal Server Error",
        status: 500,
      }),
      { status: 500 }
    );
  }
}
