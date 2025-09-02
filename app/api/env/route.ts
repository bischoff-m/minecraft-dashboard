import { NextResponse } from 'next/server';

export async function GET() {
  // Only expose safe environment variables (never expose secrets in production)
  // Here, we expose all for demonstration, but filter as needed for real apps
  return NextResponse.json(process.env);
}
