export const projects = [
  {
    slug: 'transcoder',
    index: '01',
    name: 'Transcoder',
    category: 'Video infrastructure',
    domain: 'transcode.procd.cc',
    url: 'https://transcode.procd.cc/',
    repo: 'belphegor-s/video-transcoding-service',
    summary: 'Upload a video, get back adaptive HLS from 144p to 4K with AI captions in two languages. No ffmpeg, no infra to babysit.',
    description:
      'Upload a video and get back adaptive HLS from 144p to 4K, with AI captions in two languages. Each upload is handed to transcoding workers on ECS Fargate, the output lands in S3 and streams through signed CloudFront URLs. No ffmpeg on your machine, no infra to babysit, and it scales out with the queue.',
    tags: ['HLS', 'AI captions', 'Serverless', 'CDN'],
    highlights: ['Adaptive HLS ladder from 144p up to 4K', 'AI generated captions in two languages', 'Workers on ECS Fargate, triggered by Lambda', 'Private delivery through signed CloudFront URLs'],
    stack: ['Next.js', 'Express', 'ECS Fargate', 'Lambda', 'S3', 'CloudFront', 'Redis', 'ffmpeg'],
  },
  {
    slug: 'huddle',
    index: '02',
    name: 'huddle',
    category: 'Self hosted team chat',
    domain: 'huddle.procd.cc',
    url: 'https://huddle.procd.cc/',
    repo: 'belphegor-s/huddle',
    summary: 'Team chat you run yourself. Channels, threads, files, voice notes, search and calls, in one container and a Postgres.',
    description:
      'Team chat you run yourself. Channels, threads, files, voice notes, search and calls, in one container and a Postgres. Direct messages and private channels are end to end encrypted in the browser, so the server keeps ciphertext it cannot read, even with its own database credentials.',
    tags: ['E2EE', 'WebRTC', 'Postgres', 'Self hosted'],
    highlights: ['End to end encrypted DMs and private channels', 'One container, one Postgres, one S3 compatible bucket', 'Installs from the browser with real push notifications', 'No third party requests from the browser at runtime'],
    stack: ['TypeScript', 'Postgres', 'WebRTC', 'Web Crypto', 'Web Push', 'S3', 'Docker'],
  },
];
