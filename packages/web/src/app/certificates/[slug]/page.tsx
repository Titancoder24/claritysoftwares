"use client";

import { Award, CheckCircle, Calendar, User, BookOpen, Download, ExternalLink } from "lucide-react";

export default function CertificateVerificationPage() {
  const certificate = {
    id: "cert-001",
    learnerName: "Alex Johnson",
    courseName: "Advanced Product Onboarding",
    issuedAt: "2024-12-15",
    expiresAt: "2025-12-15",
    verificationSlug: "sf-cert-a1b2c3d4",
    workspaceName: "Acme Corp",
    verified: true,
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col">
      <header className="border-b border-zinc-800/50 px-6 py-4">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
              <span className="text-sm font-bold text-white">S</span>
            </div>
            <span className="text-lg font-semibold text-white">ScreenFlow</span>
          </div>
          <span className="text-sm text-zinc-500">Certificate Verification</span>
        </div>
      </header>

      <main className="flex-1 px-6 py-16">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
              <span className="text-sm font-medium text-emerald-400">Verified Certificate</span>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-[#0c0c0f] overflow-hidden">
            <div className="relative bg-gradient-to-br from-indigo-500/20 via-violet-500/10 to-transparent px-8 py-12 text-center">
              <Award className="mx-auto h-16 w-16 text-indigo-400 mb-4" />
              <h1 className="text-3xl font-bold text-white mb-2">Certificate of Completion</h1>
              <p className="text-zinc-400">This certifies that</p>
            </div>

            <div className="px-8 py-10 space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-1">{certificate.learnerName}</h2>
                <p className="text-zinc-400">has successfully completed</p>
                <h3 className="mt-3 text-xl font-semibold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                  {certificate.courseName}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Calendar, label: "Issued", value: certificate.issuedAt },
                  { icon: Calendar, label: "Expires", value: certificate.expiresAt },
                  { icon: User, label: "Issued by", value: certificate.workspaceName },
                  { icon: BookOpen, label: "Credential ID", value: certificate.verificationSlug, mono: true },
                ].map((item) => (
                  <div key={item.label} className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
                    <div className="flex items-center gap-2 text-zinc-500 mb-1">
                      <item.icon className="h-4 w-4" />
                      <span className="text-xs font-medium uppercase tracking-wider">{item.label}</span>
                    </div>
                    <p className={`text-sm text-white ${item.mono ? "font-mono" : ""}`}>{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center gap-3 pt-4">
                <button className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-opacity">
                  <Download className="h-4 w-4" />
                  Download PDF
                </button>
                <button className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800/50 px-5 py-2.5 text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition-colors">
                  <ExternalLink className="h-4 w-4" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-800/50 px-6 py-4">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs text-zinc-600">
            Verified by ScreenFlow. This certificate was issued on the ScreenFlow platform.
          </p>
        </div>
      </footer>
    </div>
  );
}
