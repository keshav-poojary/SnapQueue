import { Injectable } from '@nestjs/common';
import sharp from 'sharp';
import axios from 'axios';
import { ServiceInternalServerException } from '../command/exceptions/ServiceInternalServerError.exception';
import { JobResult } from '../command/output/job.result';

@Injectable()
export class ImageProcessorService {
  async executeJob(payload: any): Promise<JobResult> {
    const { url, width, height, format, quality } = payload;

    if (!url)
      throw new ServiceInternalServerException('url required', {
        payload,
      });

    const res = await axios.get(url, { responseType: 'arraybuffer' });

    if (
      res.headers['content-type'] &&
      !res.headers['content-type'].startsWith('image/')
    ) {
      throw new ServiceInternalServerException(
        'URL does not point to an image',
        {
          payload,
        },
      );
    }

    let processor = sharp(res.data);

    if (width || height) {
      processor = processor.resize(width || null, height || null);
    }

    if (format === 'png') {
      processor = processor.png({ quality });
    } else if (format === 'jpeg' || format === 'jpg') {
      processor = processor.jpeg({ quality });
    } else {
      processor = processor.webp({ quality });
    }

    const buffer = await processor.toBuffer();

    return {
      base64: buffer.toString('base64'),
      contentType: `image/${format || 'webp'}`,
    };
  }
}
