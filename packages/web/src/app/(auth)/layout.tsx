export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-800">
            <span className="text-lg font-bold text-white">S</span>
          </div>
          <h1 className="text-lg font-semibold tracking-tight text-foreground">
            ScreenFlow
          </h1>
        </div>

        {children}
      </div>

      <p className="mt-8 text-xs text-slate-500">
        &copy; {new Date().getFullYear()} ScreenFlow. All rights reserved.
      </p>
    </div>
  );
}
