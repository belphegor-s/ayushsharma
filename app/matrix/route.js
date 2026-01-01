export async function GET() {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      let count = 0;
      const interval = setInterval(() => {
        const id = `retard-${Math.random().toString(36).slice(2, 8)}`;

        controller.enqueue(encoder.encode(`id: ${id}\ndata: ${count}\n\n`));

        count++;

        if (count > 9) {
          const finalId = crypto.randomUUID();
          controller.enqueue(encoder.encode(`id: ${finalId}\ndata: ...you waited? get a life.\n\n`));
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
