/**
 * Email Service (Stub)
 *
 * In production this would integrate with a transactional email provider
 * such as Resend, SendGrid, Postmark, or AWS SES.
 */

// ── Types ──────────────────────────────────────────────

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
  tags?: Record<string, string>;
}

export interface EmailResult {
  id: string;
  success: boolean;
  error?: string;
}

// ── Service ────────────────────────────────────────────

const DEFAULT_FROM =
  process.env.EMAIL_FROM ?? 'ScreenFlow <noreply@screenflow.app>';

/**
 * Send a transactional email.
 */
export async function sendEmail(opts: EmailOptions): Promise<EmailResult> {
  const id = crypto.randomUUID();

  // TODO: Wire to actual email provider (Resend, SendGrid, etc.)
  console.log(`[email] Sending to ${Array.isArray(opts.to) ? opts.to.join(', ') : opts.to}`, {
    subject: opts.subject,
    from: opts.from ?? DEFAULT_FROM,
  });

  return { id, success: true };
}

// ── Templates ──────────────────────────────────────────

/**
 * Send a workspace invitation email.
 */
export async function sendWorkspaceInvite(opts: {
  email: string;
  workspaceName: string;
  inviterName: string;
  inviteUrl: string;
}): Promise<EmailResult> {
  return sendEmail({
    to: opts.email,
    subject: `You've been invited to ${opts.workspaceName} on ScreenFlow`,
    html: `
      <h2>You're invited!</h2>
      <p>${opts.inviterName} has invited you to join <strong>${opts.workspaceName}</strong> on ScreenFlow.</p>
      <p><a href="${opts.inviteUrl}">Accept Invitation</a></p>
    `,
    text: `${opts.inviterName} has invited you to join ${opts.workspaceName} on ScreenFlow. Accept: ${opts.inviteUrl}`,
  });
}

/**
 * Send a course enrollment confirmation.
 */
export async function sendEnrollmentConfirmation(opts: {
  email: string;
  courseName: string;
  courseUrl: string;
}): Promise<EmailResult> {
  return sendEmail({
    to: opts.email,
    subject: `You're enrolled in ${opts.courseName}`,
    html: `
      <h2>Enrollment Confirmed</h2>
      <p>You've been enrolled in <strong>${opts.courseName}</strong>.</p>
      <p><a href="${opts.courseUrl}">Start Learning</a></p>
    `,
    text: `You've been enrolled in ${opts.courseName}. Start learning: ${opts.courseUrl}`,
  });
}

/**
 * Send a course completion certificate email.
 */
export async function sendCertificateEmail(opts: {
  email: string;
  learnerName: string;
  courseName: string;
  certificateUrl: string;
}): Promise<EmailResult> {
  return sendEmail({
    to: opts.email,
    subject: `Congratulations! You completed ${opts.courseName}`,
    html: `
      <h2>Congratulations, ${opts.learnerName}!</h2>
      <p>You've successfully completed <strong>${opts.courseName}</strong>.</p>
      <p><a href="${opts.certificateUrl}">View Certificate</a></p>
    `,
    text: `Congratulations ${opts.learnerName}! You completed ${opts.courseName}. View certificate: ${opts.certificateUrl}`,
  });
}

/**
 * Send an export completion notification.
 */
export async function sendExportReady(opts: {
  email: string;
  projectName: string;
  downloadUrl: string;
}): Promise<EmailResult> {
  return sendEmail({
    to: opts.email,
    subject: `Your export of "${opts.projectName}" is ready`,
    html: `
      <h2>Export Complete</h2>
      <p>Your export of <strong>${opts.projectName}</strong> is ready for download.</p>
      <p><a href="${opts.downloadUrl}">Download Export</a></p>
      <p><small>This link expires in 24 hours.</small></p>
    `,
    text: `Your export of "${opts.projectName}" is ready. Download: ${opts.downloadUrl} (expires in 24h)`,
  });
}
