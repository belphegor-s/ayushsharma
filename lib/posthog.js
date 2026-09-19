/* PostHog, loaded lazily.
   posthog-js is ~60 kB of script that nothing on a first paint needs, so it is kept out
   of the page bundle behind a dynamic import and only fetched once the visitor actually
   does something (or the browser goes idle well after load). Events captured before the
   library lands are queued and replayed in order, so callers can fire and forget. */

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST;

const INTERACTIONS = ['pointerdown', 'keydown', 'touchstart', 'scroll', 'wheel'];
const IDLE_AFTER_LOAD = 10000;

let loading = null;
const queue = [];

function load() {
  if (loading) return loading;
  loading = import('posthog-js').then(({ default: posthog }) => {
    posthog.init(KEY, { api_host: HOST, autocapture: false });
    while (queue.length) {
      const [event, properties] = queue.shift();
      posthog.capture(event, properties);
    }
    return posthog;
  });
  return loading;
}

/* Arms the loader: whichever comes first, the visitor touching the page or the main
   thread being free for a while after load. Every listener is one-shot and passive. */
export function initPostHog() {
  if (typeof window === 'undefined' || !KEY || loading) return;

  let disarm = () => {};
  const start = () => {
    disarm();
    load();
  };

  const options = { once: true, passive: true, capture: true };
  INTERACTIONS.forEach((type) => window.addEventListener(type, start, options));

  let timer;
  const idle = () => {
    const schedule = window.requestIdleCallback || ((fn) => setTimeout(fn, 1));
    timer = setTimeout(() => schedule(start, { timeout: 2000 }), IDLE_AFTER_LOAD);
  };
  if (document.readyState === 'complete') idle();
  else window.addEventListener('load', idle, { once: true });

  disarm = () => {
    clearTimeout(timer);
    INTERACTIONS.forEach((type) => window.removeEventListener(type, start, options));
  };
}

const posthog = {
  capture(event, properties) {
    if (typeof window === 'undefined' || !KEY) return;
    if (loading) {
      loading.then((ph) => ph.capture(event, properties));
      return;
    }
    queue.push([event, properties]);
    load();
  },
};

export default posthog;
