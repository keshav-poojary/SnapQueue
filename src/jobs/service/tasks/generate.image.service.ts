import { Injectable } from '@nestjs/common';
import { S3Service } from '../s3/s3.service';
import * as pup from 'puppeteer';
import { JobResult } from '../command/output/job.result';
import { ServiceInternalServerException } from '../command/exceptions/ServiceInternalServerError.exception';

@Injectable()
export class GenerateImageService {
  private readonly DEFAULT_WIDTH = 800;
  private readonly DEFAULT_HEIGHT = 600;
  private readonly IMAGE_TYPE = 'png';

  constructor(private readonly S3sService: S3Service) {}

  async execute(payload: any): Promise<JobResult> {
    const { htmlContent, fileName, upload, width, height } = payload;
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
      const screenshotBuffer = Buffer.from(
        await page.screenshot({
          type: this.IMAGE_TYPE,
          clip: {
            x: 0,
            y: 0,
            width: width || this.DEFAULT_WIDTH,
            height: height || this.DEFAULT_HEIGHT,
          },
        }),
      );
      if (upload) {
        await this.S3sService.uploadPdf(screenshotBuffer, fileName);
      }
      return {
        base64: screenshotBuffer.toString('base64'),
        contentType: `image/${this.IMAGE_TYPE}`,
      };
    } catch (error) {
      throw new ServiceInternalServerException('Failed to generate image', {
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
