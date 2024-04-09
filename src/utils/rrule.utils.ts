/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import type { WeekDayType } from 'modules/event/types/event.type';
import type { Options as RRuleOptions } from 'rrule';
import { RRule, Weekday as RRuleWeekday } from 'rrule';

import { RecurringType } from '../constants/recurring-type';

// calculate rrule string based on:
// - recruring type: daily, weekly, monthly, yearly
// - until date: Date
// - byweekday: ["MO", "TU", "WE", "TH", "FR", "SA", "SU"]
export const calculateRruleString = (
  recurringType: RecurringType | undefined,
  startDate: Date,
  untilDate: Date | undefined,
  byWeekDay: WeekDayType[] = [],
): string => {
  const rruleOptions: Partial<RRuleOptions> = {
    freq: RRule.DAILY,
    dtstart: startDate,
    until: untilDate,
    interval: 1,
  };

  if ((byWeekDay || []).length > 0) {
    rruleOptions.byweekday = (byWeekDay || []).map((it) =>
      RRuleWeekday.fromStr(it),
    );
  }

  switch (recurringType) {
    case RecurringType.DAILY: {
      rruleOptions.freq = RRule.DAILY;
      break;
    }

    case RecurringType.WEEKLY: {
      rruleOptions.freq = RRule.WEEKLY;
      break;
    }

    case RecurringType.MONTHLY: {
      rruleOptions.freq = RRule.MONTHLY;
      break;
    }

    case RecurringType.YEARLY: {
      rruleOptions.freq = RRule.YEARLY;
      break;
    }

    default: {
      rruleOptions.freq = RRule.DAILY;
      break;
    }
  }

  return new RRule(rruleOptions).toString();
};
