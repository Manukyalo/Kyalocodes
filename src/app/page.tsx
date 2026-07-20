import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0F1310] flex flex-col items-center justify-center p-4 text-white font-mono">
      <h1 className="text-4xl font-bold mb-8 text-[#4AF0A0]">Manu's Portfolio</h1>
      
      <p className="mb-12 text-gray-400 max-w-md text-center">
        Select your interface. 
        Will you explore the open world, or hack into the terminal?
      </p>

      <div className="flex flex-col sm:flex-row gap-6">
        <Link 
          href="/world" 
          className="group relative px-8 py-4 bg-[#1a231c] border border-[#4AF0A0] rounded-lg overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(74,240,160,0.3)]"
        >
          <div className="absolute inset-0 bg-[#4AF0A0] translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300 ease-out z-0"></div>
          <div className="relative z-10 flex flex-col items-center group-hover:text-black">
            <span className="text-2xl mb-2">🌍</span>
            <span className="font-bold">Explore World</span>
            <span className="text-xs opacity-70 mt-1">2D Top-Down RPG</span>
          </div>
        </Link>

        <Link 
          href="/terminal" 
          className="group relative px-8 py-4 bg-[#1a231c] border border-gray-600 rounded-lg overflow-hidden transition-all hover:scale-105 hover:border-white"
        >
          <div className="absolute inset-0 bg-white translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300 ease-out z-0"></div>
          <div className="relative z-10 flex flex-col items-center group-hover:text-black">
            <span className="text-2xl mb-2">⌨️</span>
            <span className="font-bold">Access Terminal</span>
            <span className="text-xs opacity-70 mt-1">Coming Soon</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
