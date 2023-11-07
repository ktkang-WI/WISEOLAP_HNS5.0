package com.wise.MarketingPlatForm.report.domain.item.pivot.pivotmatrix.schema.converters;

import com.wise.MarketingPlatForm.report.domain.item.pivot.param.UdfGroupParam;
import com.wise.MarketingPlatForm.report.domain.item.pivot.pivotmatrix.schema.AvroConverter;
import com.wise.MarketingPlatForm.report.domain.item.pivot.pivotmatrix.schema.avro.AvroUdfGroupParam;

public class UdfGroupParamConverter implements AvroConverter<UdfGroupParam, AvroUdfGroupParam> {

    @Override
    public AvroUdfGroupParam convert(UdfGroupParam unconverted) {
        return new AvroUdfGroupParam(unconverted.getName(), unconverted.getSelectors(),
                unconverted.getGroupIntervals(), unconverted.getExpression());
    }

    @Override
    public UdfGroupParam unconvert(AvroUdfGroupParam converted) {
        final UdfGroupParam udfGroupParam = new UdfGroupParam(converted.getName(),
                converted.getSelectors(), converted.getGroupIntervals());
        udfGroupParam.setExpression(converted.getExpression());
        return udfGroupParam;
    }

}
