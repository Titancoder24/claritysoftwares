export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      {/* Subtle gradient background effect */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-indigo-600/5 blur-3xl" />
        <div className="absolute -bottom-1/2 left-1/4 h-[600px] w-[600px] rounded-full bg-violet-600/5 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/25">
            <span className="text-xl font-bold text-white">S</span>
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            ScreenFlow
          </h1>
        </div>

        {children}
      </div>

      {/* Footer */}
      <p className="relative z-10 mt-8 text-xs text-zinc-600">
        &copy; {new Date().getFullYear()} ScreenFlow. All rights reserved.
      </p>
    </div>
  );
}
