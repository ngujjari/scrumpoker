import { NextResponse } from 'next/server';
import { getStoryPoints } from '@/app/lib/data';

export async function GET() {
  const stream = new ReadableStream({
    async start(controller) {
      const sendUpdate = async () => {
        try {
          const data = await getStoryPoints();
          const message = `data: ${JSON.stringify(data)}\n\n`;
          controller.enqueue(new TextEncoder().encode(message));
        } catch (error) {
          console.error('SSE Error:', error);
        }
      };

      // Send initial data
      await sendUpdate();

      // Set up interval for periodic updates
      const interval = setInterval(sendUpdate, 3000);

      // Clean up on close
      return () => clearInterval(interval);
    },
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}