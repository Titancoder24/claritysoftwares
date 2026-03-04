"use client";

import React from "react";
import {
  Award,
  CheckCircle2,
  Shield,
  Calendar,
  BookOpen,
  User,
  GraduationCap,
  Download,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CertificateCard, type CertificateData } from "@/components/academy/CertificateCard";
import { cn } from "@/lib/utils";

const MOCK_CERTIFICATE: CertificateData = {
  id: "cert-SF-2026-0304-A1B2",
  courseName: "Getting Started with ScreenFlow",
  courseDescription:
    "A comprehensive introduction to screen recording, video editing, and sharing with ScreenFlow. Covers the interface, recording, editing, effects, and exporting.",
  learnerName: "John Doe",
  completionDate: "March 4, 2026",
  certificateNumber: "SF-2026-0304-A1B2",
  verificationUrl: "https://screenflow.app/certificates/SF-2026-0304-A1B2",
  issuerName: "ScreenFlow Academy",
  score: 92,
  hoursCompleted: 3,
};

export default function CertificateVerificationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = React.use(params);
  const certificate = MOCK_CERTIFICATE;
  const isValid = true;

  return (
    <div className="min-h-screen bg-[#09090b]">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto max-w-4xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">ScreenFlow Academy</h1>
                <p className="text-xs text-muted-foreground">Certificate Verification</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        {/* Verification Status Banner */}
        <div
          className={cn(
            "mb-8 flex items-center gap-4 rounded-xl border p-5",
            isValid
              ? "border-emerald-500/20 bg-emerald-500/5"
              : "border-red-500/20 bg-red-500/5"
          )}
        >
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full",
              isValid ? "bg-emerald-500/15" : "bg-red-500/15"
            )}
          >
            {isValid ? (
              <CheckCircle2 className="h-6 w-6 text-emerald-400" />
            ) : (
              <Shield className="h-6 w-6 text-red-400" />
            )}
          </div>
          <div className="flex-1">
            <h2
              className={cn(
                "text-base font-semibold",
                isValid ? "text-emerald-400" : "text-red-400"
              )}
            >
              {isValid ? "Verified Certificate" : "Certificate Not Found"}
            </h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {isValid
                ? "This certificate is authentic and was issued by ScreenFlow Academy."
                : "We could not verify this certificate. It may be invalid or expired."}
            </p>
          </div>
          <Badge
            variant={isValid ? "success" : "destructive"}
            className="text-xs"
          >
            {isValid ? "Valid" : "Invalid"}
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Certificate Preview */}
          <div className="lg:col-span-3">
            <CertificateCard certificate={certificate} variant="preview" />

            {/* Actions */}
            <div className="mt-4 flex items-center gap-3">
              <Button className="flex-1">
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
              <Button variant="outline" className="flex-1">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>

          {/* Details Sidebar */}
          <div className="lg:col-span-2 space-y-4">
            {/* Certificate Details */}
            <div className="rounded-xl border border-border bg-card">
              <div className="border-b border-border px-4 py-3">
                <h3 className="text-sm font-semibold text-foreground">Certificate Details</h3>
              </div>
              <div className="space-y-4 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-800">
                    <Shield className="h-4 w-4 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      Certificate ID
                    </p>
                    <p className="mt-0.5 font-mono text-sm text-foreground">
                      {certificate.certificateNumber}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-800">
                    <User className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      Recipient
                    </p>
                    <p className="mt-0.5 text-sm text-foreground">{certificate.learnerName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-800">
                    <Calendar className="h-4 w-4 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      Issued Date
                    </p>
                    <p className="mt-0.5 text-sm text-foreground">{certificate.completionDate}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-800">
                    <Award className="h-4 w-4 text-violet-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      Issuer
                    </p>
                    <p className="mt-0.5 text-sm text-foreground">{certificate.issuerName}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Details */}
            <div className="rounded-xl border border-border bg-card">
              <div className="border-b border-border px-4 py-3">
                <h3 className="text-sm font-semibold text-foreground">Course Information</h3>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    Course Name
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-foreground">
                    {certificate.courseName}
                  </p>
                </div>
                {certificate.courseDescription && (
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      Description
                    </p>
                    <p className="mt-0.5 text-sm text-muted-foreground leading-relaxed">
                      {certificate.courseDescription}
                    </p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  {certificate.score !== undefined && (
                    <div className="rounded-lg bg-zinc-900/50 p-3">
                      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        Final Score
                      </p>
                      <p className="mt-1 text-lg font-bold text-foreground">
                        {certificate.score}%
                      </p>
                    </div>
                  )}
                  {certificate.hoursCompleted && (
                    <div className="rounded-lg bg-zinc-900/50 p-3">
                      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        Hours
                      </p>
                      <p className="mt-1 text-lg font-bold text-foreground">
                        {certificate.hoursCompleted}h
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Verification Info */}
            <div className="rounded-lg border border-border bg-zinc-900/30 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-zinc-500" />
                <span className="text-xs font-medium text-muted-foreground">
                  Cryptographically Verified
                </span>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                This certificate is cryptographically signed and can be independently verified.
                The verification URL provides permanent proof of this credential.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="mx-auto max-w-4xl px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">ScreenFlow Academy</span>
            </div>
            <p className="text-xs text-zinc-600">
              Powered by ScreenFlow
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
