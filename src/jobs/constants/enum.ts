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
  BULK_SEND_EMAIL = 'bulk_send_email',
  GENERATE_PDF = 'generate_pdf',
  GENERATE_IMAGE = 'generate_image',
}
