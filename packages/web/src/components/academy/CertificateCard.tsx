"use client";

import React from "react";
import {
  Award,
  Download,
  ExternalLink,
  Calendar,
  CheckCircle2,
  Shield,
  Share2,
  Copy,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface CertificateData {
  id: string;
  courseName: string;
  courseDescription?: string;
  learnerName: string;
  completionDate: string;
  certificateNumber: string;
  verificationUrl: string;
  issuerName: string;
  issuerLogo?: string;
  score?: number;
  hoursCompleted?: number;
}

interface CertificateCardProps {
  certificate: CertificateData;
  variant?: "compact" | "full" | "preview";
  onDownload?: () => void;
  onShare?: () => void;
}

function CertificatePreview({ certificate }: { certificate: CertificateData }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-zinc-700/50 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800">
      {/* Decorative Elements */}
      <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-indigo-600/5" />
      <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-violet-600/5" />
      <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600" />

      {/* Corner Accents */}
      <div className="absolute left-4 top-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M0 0V24H2V2H24V0H0Z" fill="currentColor" className="text-indigo-500/20" />
        </svg>
      </div>
      <div className="absolute right-4 top-4 rotate-90">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M0 0V24H2V2H24V0H0Z" fill="currentColor" className="text-indigo-500/20" />
        </svg>
      </div>
      <div className="absolute bottom-4 left-4 -rotate-90">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M0 0V24H2V2H24V0H0Z" fill="currentColor" className="text-indigo-500/20" />
        </svg>
      </div>
      <div className="absolute bottom-4 right-4 rotate-180">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M0 0V24H2V2H24V0H0Z" fill="currentColor" className="text-indigo-500/20" />
        </svg>
      </div>

      <div className="relative px-8 py-10 text-center">
        {/* Issuer */}
        <div className="flex items-center justify-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600">
            <Award className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-semibold text-foreground">{certificate.issuerName}</span>
        </div>

        {/* Title */}
        <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-indigo-400">
          Certificate of Completion
        </p>

        {/* Recipient */}
        <p className="mt-4 text-xs text-muted-foreground">This certifies that</p>
        <h2 className="mt-1 text-2xl font-bold text-foreground">{certificate.learnerName}</h2>

        {/* Course */}
        <p className="mt-3 text-xs text-muted-foreground">has successfully completed</p>
        <h3 className="mt-1 text-base font-semibold text-foreground">{certificate.courseName}</h3>

        {/* Details */}
        <div className="mt-5 flex items-center justify-center gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3" />
            {certificate.completionDate}
          </div>
          {certificate.hoursCompleted && (
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-3 w-3" />
              {certificate.hoursCompleted} hours
            </div>
          )}
          {certificate.score !== undefined && (
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3 w-3" />
              Score: {certificate.score}%
            </div>
          )}
        </div>

        {/* Certificate Number */}
        <div className="mt-5 inline-flex items-center gap-1.5 rounded-md bg-zinc-800/50 px-3 py-1.5">
          <Shield className="h-3 w-3 text-zinc-500" />
          <span className="font-mono text-[10px] text-zinc-500">
            {certificate.certificateNumber}
          </span>
        </div>
      </div>
    </div>
  );
}

export function CertificateCard({
  certificate,
  variant = "full",
  onDownload,
  onShare,
}: CertificateCardProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(certificate.verificationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (variant === "compact") {
    return (
      <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-zinc-700">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600/20 to-violet-600/20">
          <Award className="h-6 w-6 text-indigo-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-foreground truncate">
            {certificate.courseName}
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            Completed {certificate.completionDate}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success" className="text-[10px]">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Verified
          </Badge>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onDownload}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  if (variant === "preview") {
    return <CertificatePreview certificate={certificate} />;
  }

  return (
    <div className="space-y-4">
      {/* Certificate Preview */}
      <CertificatePreview certificate={certificate} />

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button className="flex-1" onClick={onDownload}>
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
        <Button variant="outline" className="flex-1" onClick={onShare}>
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </div>

      {/* Verification URL */}
      <div className="rounded-lg border border-border bg-zinc-900/50 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-indigo-400" />
            <span className="text-xs font-medium text-foreground">Verification URL</span>
          </div>
          <Badge variant="success" className="text-[10px]">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Valid
          </Badge>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 overflow-hidden rounded-md bg-zinc-800 px-3 py-1.5">
            <p className="truncate font-mono text-xs text-zinc-400">
              {certificate.verificationUrl}
            </p>
          </div>
          <button
            onClick={handleCopyUrl}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-zinc-800 hover:text-foreground"
          >
            {copied ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
          <a
            href={certificate.verificationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-zinc-800 hover:text-foreground"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-border bg-zinc-900/50 p-3">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Certificate ID
          </p>
          <p className="mt-1 font-mono text-sm text-foreground">
            {certificate.certificateNumber}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-zinc-900/50 p-3">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Completion Date
          </p>
          <p className="mt-1 text-sm text-foreground">{certificate.completionDate}</p>
        </div>
        {certificate.score !== undefined && (
          <div className="rounded-lg border border-border bg-zinc-900/50 p-3">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Final Score
            </p>
            <p className="mt-1 text-sm text-foreground">{certificate.score}%</p>
          </div>
        )}
        {certificate.hoursCompleted && (
          <div className="rounded-lg border border-border bg-zinc-900/50 p-3">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Hours Completed
            </p>
            <p className="mt-1 text-sm text-foreground">{certificate.hoursCompleted}h</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CertificateCard;
