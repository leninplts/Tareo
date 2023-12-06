import { Injectable } from '@nestjs/common';
import { createPdf } from '@saemhco/nestjs-html-pdf';
import * as path from 'path';

@Injectable()
export class PdfService {
  sample() {
    const filePath = path.join(
      process.cwd(),
      'src/templates',
      'pdf-profile.hbs',
    );
    return createPdf(filePath);
  }
}
