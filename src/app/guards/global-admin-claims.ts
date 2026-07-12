const GLOBAL_ADMIN_METADATA_CLAIM = 'https://evorto.app/app_metadata';

export function isGlobalAdminClaims(claims: unknown): boolean {
  if (!isRecord(claims)) return false;

  const subject = claims['sub'];
  if (typeof subject !== 'string' || subject.trim().length === 0) return false;

  const metadata = claims[GLOBAL_ADMIN_METADATA_CLAIM];
  if (!isRecord(metadata)) return false;

  return metadata['globalAdmin'] === true;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
