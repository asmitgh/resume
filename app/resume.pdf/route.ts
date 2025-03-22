import { NextResponse } from "next/server"

export async function GET() {
  // In a real application, you would generate a PDF here
  // For this example, we'll just return a mock response

  return new NextResponse("PDF would be generated here", {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=asmit-ghosh-resume.pdf",
    },
  })
}

