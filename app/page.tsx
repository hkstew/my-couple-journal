import Link from "next/link";

export default function Home() {
  return (
    <div className="mt-10 grid gap-6">
      <div className="card text-center">
        <h1 className="text-2xl font-semibold mb-2">Welcome to Our Cute Journal 💞</h1>
        <p className="text-gray-600">Keep our memories in one private, cozy place.</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link href="/timeline" className="button">Go to Timeline</Link>
          <Link href="/moments/new" className="button bg-candy-sky">Add a Moment</Link>
        </div>
      </div>
      <div className="card">
        <h2 className="text-lg font-medium">How it works</h2>
        <ul className="list-disc pl-5 mt-2 text-gray-700 space-y-1">
          <li>Create or join your couple in <Link href="/setup" className="underline">Setup</Link>.</li>
          <li>Add moments with photos, date, and captions.</li>
          <li>Browse memories in the Timeline. Cute & private!</li>
        </ul>
      </div>
    </div>
  );
}
