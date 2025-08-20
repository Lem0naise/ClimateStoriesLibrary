// app/api/geocode/route.js

import { NextResponse } from 'next/server';

export async function GET(request:any) {
  // 1. Get the address from the client's request
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json({ error: 'Address is required' }, { status: 400 });
  }

  // 2. Get your secret API key from the server's environment variables
  const apiKey = process.env.GOOGLE_GEOCODING_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${apiKey}`;

  try {
    // 3. Call the Google Geocoding API from your server
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      // If Google API returned an error, forward it to the client
      return NextResponse.json({ error: data.error_message || 'An error occurred' }, { status: response.status });
    }

    // 4. Send the successful response back to the client
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch geocoding data' }, { status: 500 });
  }
}