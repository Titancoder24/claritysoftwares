import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  type PutObjectCommandInput,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// ── Client ─────────────────────────────────────────────

function createStorageClient(): S3Client {
  const endpoint = process.env.S3_ENDPOINT;
  const region = process.env.S3_REGION ?? 'auto';
  const accessKeyId = process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;

  if (!endpoint || !accessKeyId || !secretAccessKey) {
    throw new Error(
      'S3_ENDPOINT, S3_ACCESS_KEY_ID, and S3_SECRET_ACCESS_KEY must be set',
    );
  }

  return new S3Client({
    endpoint,
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    forcePathStyle: true,
  });
}

let _client: S3Client | null = null;
function getClient(): S3Client {
  if (!_client) _client = createStorageClient();
  return _client;
}

const BUCKET = () => process.env.S3_BUCKET ?? 'screenflow';

// ── Presigned URLs ─────────────────────────────────────

export interface PresignedUploadResult {
  uploadUrl: string;
  key: string;
  expiresIn: number;
}

/**
 * Generate a presigned PUT URL for direct client-side upload.
 */
export async function createPresignedUpload(opts: {
  key: string;
  contentType: string;
  maxSizeBytes?: number;
  expiresIn?: number;
}): Promise<PresignedUploadResult> {
  const expiresIn = opts.expiresIn ?? 3600; // 1 hour default

  const params: PutObjectCommandInput = {
    Bucket: BUCKET(),
    Key: opts.key,
    ContentType: opts.contentType,
  };

  if (opts.maxSizeBytes) {
    params.ContentLength = opts.maxSizeBytes;
  }

  const command = new PutObjectCommand(params);
  const uploadUrl = await getSignedUrl(getClient(), command, { expiresIn });

  return { uploadUrl, key: opts.key, expiresIn };
}

/**
 * Generate a presigned GET URL for downloading / streaming a file.
 */
export async function createPresignedDownload(opts: {
  key: string;
  expiresIn?: number;
  responseContentType?: string;
}): Promise<string> {
  const expiresIn = opts.expiresIn ?? 3600;

  const command = new GetObjectCommand({
    Bucket: BUCKET(),
    Key: opts.key,
    ...(opts.responseContentType && {
      ResponseContentType: opts.responseContentType,
    }),
  });

  return getSignedUrl(getClient(), command, { expiresIn });
}

// ── Object Operations ──────────────────────────────────

/**
 * Check if an object exists in storage.
 */
export async function objectExists(key: string): Promise<boolean> {
  try {
    await getClient().send(
      new HeadObjectCommand({ Bucket: BUCKET(), Key: key }),
    );
    return true;
  } catch {
    return false;
  }
}

/**
 * Get metadata for an object.
 */
export async function getObjectMeta(key: string) {
  const result = await getClient().send(
    new HeadObjectCommand({ Bucket: BUCKET(), Key: key }),
  );
  return {
    contentLength: result.ContentLength,
    contentType: result.ContentType,
    lastModified: result.LastModified,
    etag: result.ETag,
  };
}

/**
 * Delete an object from storage.
 */
export async function deleteObject(key: string): Promise<void> {
  await getClient().send(
    new DeleteObjectCommand({ Bucket: BUCKET(), Key: key }),
  );
}

/**
 * Delete multiple objects by prefix (e.g. all files for a recording).
 */
export async function deleteByPrefix(prefix: string): Promise<number> {
  let deleted = 0;
  let continuationToken: string | undefined;

  do {
    const list = await getClient().send(
      new ListObjectsV2Command({
        Bucket: BUCKET(),
        Prefix: prefix,
        ContinuationToken: continuationToken,
      }),
    );

    if (list.Contents) {
      for (const obj of list.Contents) {
        if (obj.Key) {
          await deleteObject(obj.Key);
          deleted++;
        }
      }
    }

    continuationToken = list.NextContinuationToken;
  } while (continuationToken);

  return deleted;
}

// ── Key Generators ─────────────────────────────────────

/**
 * Generate a storage key for a recording upload.
 */
export function recordingKey(
  workspaceId: string,
  recordingId: string,
  filename: string,
): string {
  return `workspaces/${workspaceId}/recordings/${recordingId}/${filename}`;
}

/**
 * Generate a storage key for an exported file.
 */
export function exportKey(
  workspaceId: string,
  projectId: string,
  filename: string,
): string {
  return `workspaces/${workspaceId}/exports/${projectId}/${filename}`;
}

/**
 * Generate a storage key for a guide step screenshot.
 */
export function guideStepKey(
  workspaceId: string,
  guideId: string,
  stepIndex: number,
): string {
  return `workspaces/${workspaceId}/guides/${guideId}/step-${stepIndex}.png`;
}

/**
 * Generate a storage key for workspace assets (logos, etc.).
 */
export function assetKey(
  workspaceId: string,
  assetType: string,
  filename: string,
): string {
  return `workspaces/${workspaceId}/assets/${assetType}/${filename}`;
}
