import { Controller, Get, Query, Res } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { Worker } from 'src/interfaces/worker.interface';
import * as crypto from 'crypto-js';

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Get()
  async genPdf(@Res() res, @Query('worker') encryptedData: string) {
    const decrypted = crypto.AES.decrypt(encryptedData, 'secretKey').toString(
      crypto.enc.Utf8,
    );
    const worker = JSON.parse(decrypted) as Worker;
    const buffer = await this.pdfService.sample(worker);
    res.set({
      // pdf
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=pdf.pdf`,
      'Content-Length': buffer.length,
      // prevent cache
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: 0,
    });
    res.end(buffer);
  }
}
