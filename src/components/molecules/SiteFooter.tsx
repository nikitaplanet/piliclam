export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="px-5 py-6 md:px-10">
      <p className="text-center text-xs text-gray-400 lowercase">
        © {year} piliclam. all rights reserved.
      </p>
    </footer>
  );
}
