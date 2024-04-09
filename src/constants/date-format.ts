import { StatisticsBy } from './statistics-by';

export const dateFormat = 'MMM D, YYYY';

export const allDateFormats = {
  [StatisticsBy.DAY]: 'YYYY-MM-DD',
  [StatisticsBy.WEEK]: 'YYYY-"W"IW',
  [StatisticsBy.MONTH]: 'YYYY-MM',
  [StatisticsBy.YEAR]: 'YYYY',
};
