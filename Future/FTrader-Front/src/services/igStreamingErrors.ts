export const LIGHTSTREAMER_ERRORS = {
  '1': 'Generic error',
  '2': 'Requested Adapter Set not available',
  '7': 'Licensed maximum number of sessions reached',
  '8': 'Configured maximum number of sessions reached',
  '9': 'Configured maximum server load reached',
  '10': 'New sessions temporarily blocked',
  '11': 'Streaming not available',
  '21': 'Bad credentials',
  '32': 'No such table',
  '33': 'Generic subscription error',
  '34': 'Tables overflow',
  '35': 'Bad subscription',
  '66': 'Access denied',
  '68': 'Invalid session',
  '71': 'Streaming not available for current adapter set'
} as const;

export type LightstreamerErrorCode = keyof typeof LIGHTSTREAMER_ERRORS;
