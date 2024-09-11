import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
                <link rel="manifest" href="/manifest.json" />
                <link rel="apple-touch-icon" href="/logo192.png" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet" />

                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-reboot@4.5.6/reboot.min.css" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
