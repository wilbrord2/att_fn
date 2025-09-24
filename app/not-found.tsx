import Link from "next/link";

export default function NotFound() {
  return (
    <div className="w-full h-screen relative flex items-center justify-center">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-sm bg-gray-200"></div>

      <div className="relative flex-col gap-3 flex items-center justify-center bg-white/90 p-10 rounded-lg shadow-lg">
        <h1 className="text-9xl font-extrabold text-green-600">404</h1>
        <h2 className="text-center uppercase text-green-800 font-bold text-3xl">
          Oops! Page Not Found
        </h2>
        <p className="text-center text-slate-500 w-4/5 lg:w-2/4">
          Sorry, the page you are looking for might have been removed, had its
          name changed, or is temporarily unavailable.
        </p>

        <Link href="/dashboard">
          <button className="hover:bg-green-100  duration-300 transition text-slate-700 cursor-pointer px-5 py-2 rounded-full text-center border-green-600 border">
            Return Home
          </button>
        </Link>
      </div>
    </div>
  );
}
