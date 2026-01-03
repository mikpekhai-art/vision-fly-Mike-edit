import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const origin = searchParams.get('origin');
  const destination = searchParams.get('destination');
  const date = searchParams.get('date');
  const returnDate = searchParams.get('returnDate');
  const adults = searchParams.get('adults') || '1';
  const children = searchParams.get('children') || '0';

  console.log("DEBUG: Flight Search API called");
  console.log("Origin:", origin, "Destination:", destination, "Date:", date);
  console.log("Return Date:", returnDate, "Adults:", adults, "Children:", children);

  // Check for required environment variables
  if (!process.env.AMADEUS_CLIENT_ID || !process.env.AMADEUS_CLIENT_SECRET) {
    console.error("Missing Amadeus API credentials. Please set AMADEUS_CLIENT_ID and AMADEUS_CLIENT_SECRET.");
    return NextResponse.json({ 
      error: 'Flight search service unavailable', 
      details: 'API credentials not configured',
      allowCustomQuote: true 
    }, { status: 503 });
  }

  if (!origin || !destination || !date) {
    return NextResponse.json({ error: 'Missing required parameters (origin, destination, date)' }, { status: 400 });
  }

  try {
    // Get Access Token from Amadeus
    const authResponse = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=client_credentials&client_id=${process.env.AMADEUS_CLIENT_ID}&client_secret=${process.env.AMADEUS_CLIENT_SECRET}`
    });

    if (!authResponse.ok) {
      const errorText = await authResponse.text();
      console.error("Amadeus Auth Error:", errorText);
      return NextResponse.json({ error: 'Failed to authenticate with flight API' }, { status: 500 });
    }

    const authData = await authResponse.json();
    const token = authData.access_token;

    if (!token) {
      console.error("No access token received from Amadeus");
      return NextResponse.json({ error: 'Failed to get access token' }, { status: 500 });
    }

    // Build the flight search URL
    let url = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${date}&adults=${adults}&currencyCode=NGN&max=10`;
    
    // Add children if any
    if (parseInt(children) > 0) {
      url += `&children=${children}`;
    }
    
    // Add return date for round trips
    if (returnDate) {
      url += `&returnDate=${returnDate}`;
    }

    console.log("Amadeus API URL:", url);

    const flightResponse = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!flightResponse.ok) {
      const errorData = await flightResponse.json();
      console.error("Amadeus Flight Search Error:", JSON.stringify(errorData));
      return NextResponse.json({ 
        error: 'Failed to fetch flights', 
        details: errorData.errors?.[0]?.detail || 'Unknown error'
      }, { status: 500 });
    }

    const flightData = await flightResponse.json();
    
    // Markup amount in Naira (₦100,000)
    const MARKUP_AMOUNT = 100000;

    // Transform the Amadeus response into a simpler format for the frontend
    const flights = flightData.data?.map((offer: any) => {
      const outboundSegments = offer.itineraries[0]?.segments || [];
      const returnSegments = offer.itineraries[1]?.segments || [];
      
      const firstSegment = outboundSegments[0];
      const lastOutboundSegment = outboundSegments[outboundSegments.length - 1];
      
      // Apply markup to prices
      const originalTotal = parseFloat(offer.price.total);
      const originalGrandTotal = parseFloat(offer.price.grandTotal);
      const markedUpTotal = (originalTotal + MARKUP_AMOUNT).toFixed(2);
      const markedUpGrandTotal = (originalGrandTotal + MARKUP_AMOUNT).toFixed(2);
      
      return {
        id: offer.id,
        price: {
          total: markedUpTotal,
          currency: offer.price.currency,
          grandTotal: markedUpGrandTotal,
        },
        outbound: {
          departure: {
            airport: firstSegment?.departure?.iataCode,
            time: firstSegment?.departure?.at,
          },
          arrival: {
            airport: lastOutboundSegment?.arrival?.iataCode,
            time: lastOutboundSegment?.arrival?.at,
          },
          duration: offer.itineraries[0]?.duration,
          stops: outboundSegments.length - 1,
          carrier: firstSegment?.carrierCode,
          flightNumber: `${firstSegment?.carrierCode}${firstSegment?.number}`,
        },
        return: returnSegments.length > 0 ? {
          departure: {
            airport: returnSegments[0]?.departure?.iataCode,
            time: returnSegments[0]?.departure?.at,
          },
          arrival: {
            airport: returnSegments[returnSegments.length - 1]?.arrival?.iataCode,
            time: returnSegments[returnSegments.length - 1]?.arrival?.at,
          },
          duration: offer.itineraries[1]?.duration,
          stops: returnSegments.length - 1,
          carrier: returnSegments[0]?.carrierCode,
          flightNumber: `${returnSegments[0]?.carrierCode}${returnSegments[0]?.number}`,
        } : null,
        numberOfBookableSeats: offer.numberOfBookableSeats,
        lastTicketingDate: offer.lastTicketingDate,
      };
    }) || [];

    return NextResponse.json({ 
      success: true, 
      flights,
      dictionaries: flightData.dictionaries,
      meta: flightData.meta
    });

  } catch (error) {
    console.error("Flight Search Error:", error);
    return NextResponse.json({ error: 'Failed to fetch flight data' }, { status: 500 });
  }
}
