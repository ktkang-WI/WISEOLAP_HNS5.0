package com.wise.MarketingPlatForm.utils;

import java.util.Calendar;

import org.springframework.stereotype.Component;

@Component
public class CalcDate {
  public CalcDate () {
  }

  public int dDayCalculator(String year, String month, String day) {
    Calendar today = Calendar.getInstance();
    Calendar dDay = Calendar.getInstance();
    int changemonth = Integer.parseInt(month) -1;
    int changeYear = Integer.parseInt(year);
    
    if (changemonth + 3 > 11) {
      changemonth = changemonth + 3 -12;
      changeYear = changeYear + 1;

      dDay.set(changeYear, changemonth , Integer.parseInt(day));
    } else {
      dDay.set(changeYear, changemonth + 3 , Integer.parseInt(day));
    }
    
    long d_day = dDay.getTimeInMillis() / (24*60*60*1000);
    long to_day = today.getTimeInMillis() / (24*60*60*1000);

    return (int)(to_day - d_day);
  }
}
