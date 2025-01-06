export default function Menu({ isMenuOpen, siteNames, onClickFn }: { isMenuOpen: boolean, siteNames: string[], onClickFn: (e: React.MouseEvent<HTMLDivElement>) => void }) {
  return (
    <div
      className={`absolute left-0 top-12 w-48 bg-white border rounded shadow-lg transform transition-all duration-300 ease-in-out ${isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
    >
      <ul className="p-4 space-y-2">
        {siteNames.map(s => (
          <li key={s}>
            <div className="" onClick={onClickFn} data-sitename={s}>{s}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}