import { NextResponse } from 'next/server';

const UMAMI_API_URL = 'https://api.umami.is/v1';
const WEBSITE_ID = 'e74504b6-4f88-4ba1-8c5c-16265cc3df32';

export async function GET() {
    const apiKey = process.env.UMAMI_API_KEY;

    if (!apiKey) {
        return NextResponse.json({ visitors: null, error: 'API key not configured' });
    }

    try {
        // Get stats for all time
        const endAt = Date.now();
        const startAt = endAt - (365 * 24 * 60 * 60 * 1000); // Last 1 year

        const response = await fetch(
            `${UMAMI_API_URL}/websites/${WEBSITE_ID}/stats?startAt=${startAt}&endAt=${endAt}`,
            {
                headers: {
                    'x-umami-api-key': apiKey,
                    'Content-Type': 'application/json',
                },
                next: { revalidate: 3600 }, // Cache for 1 hour
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Umami API error:', response.status, errorText);
            return NextResponse.json({ visitors: null, error: `API error: ${response.status}` });
        }

        const data = await response.json();

        return NextResponse.json({
            visitors: data.visitors?.value ?? data.visitors ?? 0,
            pageviews: data.pageviews?.value ?? data.pageviews ?? 0,
        });
    } catch (error) {
        console.error('Failed to fetch Umami stats:', error);
        return NextResponse.json({ visitors: null, error: 'Failed to fetch stats' });
    }
}
