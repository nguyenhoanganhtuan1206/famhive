import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { parse } from 'papaparse';

@Injectable()
export class CsvService {
  async getRemoteCsvFile(url: string) {
    const res = await axios.get(url);
    const csvData: string = res.data;

    return parse(csvData, { skipEmptyLines: true, header: false })
      .data as string[][];
  }
}
