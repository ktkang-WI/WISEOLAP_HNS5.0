package com.wise.MarketingPlatForm.report.domain.data;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashSet;
import java.util.Set;

import com.wise.MarketingPlatForm.report.type.SummaryType;

import lombok.Getter;

public class SummaryCalculator {
    final BigDecimal one = new BigDecimal(1);
    SummaryType summaryType;
    BigDecimal decimalValue;
    String stringValue;
    @Getter
    int dataLength;
    @Getter
    boolean isStringData;
    Set<Object> countDistinctSet;

    public SummaryCalculator (SummaryType summaryType, Object firstValue) {
        if (firstValue instanceof String) {
            isStringData = true;
        }
        this.summaryType = summaryType;

        dataLength = 1;
        if (isStringData) {
            stringValue = String.valueOf(firstValue);

            if (summaryType == SummaryType.COUNT || summaryType == SummaryType.COUNTDISTINCT) {
                countDistinctSet = new HashSet<> ();
                countDistinctSet.add(firstValue);
                decimalValue = new BigDecimal(1);
            }
        } else {
            switch (summaryType) {
                case COUNTDISTINCT:
                    countDistinctSet = new HashSet<> ();
                    countDistinctSet.add(firstValue);
                    decimalValue = BigDecimal.valueOf(1);
                    break;
                case COUNT:
                    decimalValue = BigDecimal.valueOf(1);
                    break;
                case SUM:
                case MIN:
                case MAX:
                case AVG:
                default:
                    decimalValue = new BigDecimal(String.valueOf(firstValue));
                    break;
            }
        }
    }


    public Object getSummaryValue() {
        switch (summaryType) {
            case MAX:
            case MIN:
                if (isStringData) {
                    return stringValue;
                } else {
                    return decimalValue;
                }
            case AVG:
                return decimalValue.divide(BigDecimal.valueOf(dataLength), 5, RoundingMode.HALF_UP);
            case SUM:
            case COUNT:
            case COUNTDISTINCT:
            default:
                return decimalValue;
        }
    };

    public SummaryCalculator calculateSummaryValue(Object newValue) {
        dataLength++;
        switch (summaryType) {
            case SUM:
            case AVG:
                decimalValue = decimalValue.add(new BigDecimal(String.valueOf(newValue)));
                break;
            case COUNT:
                decimalValue = decimalValue.add(one);
                break;
            case COUNTDISTINCT:
                countDistinctSet.add(newValue);
                break;
            case MAX:
                if (!isStringData) {
                    decimalValue = decimalValue.max(new BigDecimal(String.valueOf(newValue)));
                }
                break;
            case MIN:
                if (!isStringData) {
                    decimalValue = decimalValue.min(new BigDecimal(String.valueOf(newValue)));
                }
                break;
            default:
                break;
        }

        return this;
    }
}
