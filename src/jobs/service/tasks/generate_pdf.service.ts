import { Injectable } from '@nestjs/common';
import * as pup from 'puppeteer';
import { ServiceInternalServerException } from '../command/exceptions/ServiceInternalServerError.exception';
import { S3Service } from '../s3/s3.service';
import { JobResult } from '../command/output/job.result';

@Injectable()
export class GeneratePdfService {
  constructor(private readonly S3Service: S3Service) {}
  async execute(payload: any): Promise<JobResult> {
    const { htmlContent, fileName, upload } = payload;

    if (!htmlContent) {
      throw new ServiceInternalServerException('htmlContent required', {
        payload,
      });
    }

    let browser: pup.Browser = null;

    try {
      browser = await pup.launch();
      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
      const pdfBuffer = Buffer.from(await page.pdf({ format: 'A4' }));

      if (upload) {
        await this.S3Service.uploadPdf(pdfBuffer, fileName);
      }

      return {
        base64: pdfBuffer.toString('base64'),
        contentType: 'application/pdf',
      };
    } catch (error) {
      throw new ServiceInternalServerException('Failed to generate PDF', {
        error: error instanceof Error ? error.message : error,
        payload,
      });
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
}
