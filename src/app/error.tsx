'use client';
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) { return <main id="main" className="document-page"><h1>We hit a small snag.</h1><p>Your saved workshops are still in your browser. Try loading the studio again.</p><button className="button primary" onClick={reset}>Try again</button></main>; }
