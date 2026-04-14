import Image from "next/image";

export default function Header() {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-10 flex justify-between items-center">
      <header className="flex items-center gap-4 group">
        <div className="relative p-2 bg-gray-900 rounded-xl border border-gray-800 group-hover:border-blue-500/50 transition-all duration-300 shadow-2xl">
          <Image src="/logo-finastriva.svg" alt="Logo" width={42} height={42} priority />
        </div>
        
        <div className="flex flex-col">
          <h1 className="text-2xl font-black tracking-tighter text-white leading-none">FINASTRIVA</h1>
          <span className="text-[10px] uppercase tracking-[0.3em] text-blue-500 font-bold mt-1 opacity-80">
            Smart Assets Manager
          </span>
        </div>
      </header>

      <div className="hidden md:block text-right">
        <p className="text-xs text-gray-500 uppercase tracking-widest font-medium">Dashboard Overview</p>
        <p className="text-sm text-gray-400 font-mono">
          {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>
    </div>
  );
}
