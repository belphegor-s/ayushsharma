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

				<link rel="stylesheet" href="https://chatzy-kb-store.s3.amazonaws.com/icons/5ab07987-b5db-477c-82ff-1287e0883acb" />
				<script
					src="https://chatzy-kb-store.s3.amazonaws.com/icons/cd8b748a-158a-4fa0-831c-742a733ed3c7"
					id="b8353106-d712-4d99-929f-cbc9fe2a55d2"
					className="chatzy_widget_script"
					defer></script>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
