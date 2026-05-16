export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} Shoply. All rights reserved.</p>
        <p>Built with React + Tailwind CSS.</p>
      </div>
    </footer>
  );
}
