import { createPdf } from '@leninlb/nestjs-html-to-pdf';
import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { Worker } from 'src/interfaces/worker.interface';

@Injectable()
export class PdfService {
  sample(worker: Worker) {
    const data = {
      today: new Date().toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      startDate: '',
      endDate: '',
      month: '',
      worker: worker,
      company: {
        name: 'M2H contratistas Generales SAC',
        date: new Date().toLocaleDateString(),
        ubication:
          'OTR.LOS BARRANCOS MZA. E LOTE. 13 OTR. ASOCIACIÓN LOS BARRANCOS (BARRANCOS)',
        report: {
          startDate: new Date().toLocaleDateString(),
          endDate: new Date().toLocaleDateString(),
        },
      },
      tareo: [],
      workedDays: 0,
      restDays: 0,
      justifiedAbsenceDays: 0,
      unjustifiedAbsenceDays: 0,
      noFilledDays: 0,
    };
    data.startDate = new Date(
      data.worker.tareos[0].year,
      data.worker.tareos[0].month - 1,
      1,
    ).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
    data.endDate = new Date(
      data.worker.tareos[0].year,
      data.worker.tareos[0].month,
      0,
    ).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
    data.month = new Date(
      data.worker.tareos[0].year,
      data.worker.tareos[0].month - 1,
      1,
    ).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });
    data.worker.tareos[0].tareo.forEach((t) => {
      if (t.state == 'DL') ++data.workedDays;
      if (t.state == 'DD') ++data.restDays;
      if (t.state == 'FJ') ++data.justifiedAbsenceDays;
      if (t.state == 'FI') ++data.unjustifiedAbsenceDays;
      if (t.state == '-') ++data.noFilledDays;
    });

    data.tareo = data.worker.tareos[0].tareo;

    const options = {
      format: 'A4',
      margin: {
        left: '10mm',
        top: '15mm',
        right: '10mm',
        bottom: '15mm',
      },
      landscape: true,
    };

    // create pdf file
    const filePath = path.join(
      process.cwd(),
      'src/templates',
      'pdf-profile.hbs',
    );
    return createPdf(filePath, options, data);
  }
}
