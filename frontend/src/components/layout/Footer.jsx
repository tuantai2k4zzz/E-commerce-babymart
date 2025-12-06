export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white mt-8">
      <div className="max-w-6xl mx-auto px-4 py-4 text-[11px] text-slate-500 flex flex-col md:flex-row items-center justify-between gap-2">
        <span>© {new Date().getFullYear()} Babymart. All rights reserved.</span>
        <span>Made with ❤️ for baby & mom.</span>
      </div>
    </footer>
  );
}
