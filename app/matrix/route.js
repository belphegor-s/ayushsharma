export async function GET() {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      let count = 0;
      const interval = setInterval(() => {
        controller.enqueue(encoder.encode(`count: ${count}\n`));
        count++;
        if (count > 9) {
          controller.enqueue(encoder.encode('\n...you waited? get a life.\n'));
          controller.close();
          clearInterval(interval);
        }
      }, 500);
    },
  });
  return new Response(stream, { headers: { 'Content-Type': 'text/event-stream' } });
}
