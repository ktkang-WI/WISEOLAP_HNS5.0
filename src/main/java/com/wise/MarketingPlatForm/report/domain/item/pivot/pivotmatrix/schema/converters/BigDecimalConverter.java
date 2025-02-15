package com.wise.MarketingPlatForm.report.domain.item.pivot.pivotmatrix.schema.converters;

import java.math.BigDecimal;

import org.apache.commons.lang3.StringUtils;

import com.wise.MarketingPlatForm.report.domain.item.pivot.pivotmatrix.schema.AvroConverter;

public class BigDecimalConverter implements AvroConverter<BigDecimal, String> {

    @Override
    public String convert(BigDecimal unconverted) {
        return unconverted != null ? unconverted.toString() : null;
    }

    @Override
    public BigDecimal unconvert(String converted) {
        return StringUtils.isNotEmpty(converted) ? new BigDecimal(converted) : null;
    }

}
