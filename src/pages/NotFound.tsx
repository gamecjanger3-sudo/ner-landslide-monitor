import { Link } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="bg-red-50 p-4 rounded-full text-red-600 mb-4">
        <AlertTriangle size={48} />
      </div>
      <h1 className="text-4xl font-bold text-slate-900 mb-2">404 - Page Not Found</h1>
      <p className="text-slate-500 max-w-md mb-6">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/dashboard"
        className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 transition"
      >
        <Home size={18} />
        Back to Dashboard
      </Link>
    </div>
  );
}