export async function GET() {
  const encoder = new TextEncoder();
  const winterWords = ['Longing', 'Rusted', 'Seventeen', 'Daybreak', 'Furnace', 'Nine', 'Benign', 'Homecoming', 'One', 'FreightCar'];
  const FIXED_LEN = 12;

  let interval = null;
  const stop = () => {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  };

  const stream = new ReadableStream({
    start(controller) {
      let count = 0;

      interval = setInterval(() => {
        const word = winterWords[count % winterWords.length];
        const id = word.length >= FIXED_LEN ? word.slice(0, FIXED_LEN) : word.padEnd(FIXED_LEN, '_');

        try {
          controller.enqueue(encoder.encode(`id: ${id}\ndata: ${count}\n\n`));
          count++;

          if (count > 9) {
            controller.enqueue(encoder.encode(`id: FINAL________\ndata: ...you waited? get a life.\n\n`));
            stop();
            controller.close();
          }
        } catch {
          // Client disconnected: controller already closed. Stop ticking.
          stop();
        }
      }, 800);
    },
    cancel() {
      // Reader/connection aborted before completion.
      stop();
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
