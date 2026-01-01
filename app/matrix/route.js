export async function GET() {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      let count = 0;
      const interval = setInterval(() => {
        // MUST use data: and end with \n\n for event-stream
        controller.enqueue(encoder.encode(`data: ${count}\n\n`));
        count++;

        if (count > 9) {
          controller.enqueue(encoder.encode(`data: ...you waited? get a life.\n\n`));
          controller.close();
          clearInterval(interval);
        }
      }, 500);
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
