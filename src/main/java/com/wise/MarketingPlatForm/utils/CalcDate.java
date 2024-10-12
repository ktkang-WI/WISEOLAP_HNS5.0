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
    
    if (changemonth >= 11) {
      changemonth = changemonth -11;
    }
    
    dDay.set(Integer.parseInt(year), changemonth + 2 , Integer.parseInt(day));
    
    long d_day = dDay.getTimeInMillis() / (24*60*60*1000);
    long to_day = today.getTimeInMillis() / (24*60*60*1000);

    return (int)(to_day - d_day);
  }
}
