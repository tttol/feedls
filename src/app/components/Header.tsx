const Header: React.FC = () => {
  return (
    <header className="bg-orange-400 text-white p-4 text-center font-black text-4xl flex items-center">
      <div className="flex-none">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </div>
      <div className="flex-grow text-center">
        Feedls
      </div>
    </header>
  );
};

export default Header;