export enum JobStatusEnum {
  INITIALIZED = 'initialized',
  QUEUED = 'queued',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum JobPayloadTaskEnum {
  IMAGE_PROCESSING = 'image_processing',
  SEND_EMAIL = 'send_email',
}
