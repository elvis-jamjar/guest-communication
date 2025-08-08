// import { moveDataToNewDataType } from "@/app/actions/timeline";
import { publishData } from "@/app/actions/timeline";
import { NextResponse } from "next/server";
// import { migrateData } from "@/app/actions/timeline";

export async function GET() {
  try {
    // await migrateData();
    // await moveDataToNewDataType();
    await publishData();

    return NextResponse.json(
      {
        success: true,
        message: "Data migration completed successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Migration error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Data migration failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
