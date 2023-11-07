package com.wise.MarketingPlatForm.report.domain.item.pivot.pivotmatrix.schema.converters;

import com.wise.MarketingPlatForm.report.type.SummaryType;
import com.wise.MarketingPlatForm.report.domain.item.pivot.param.SummaryParam;
import com.wise.MarketingPlatForm.report.domain.item.pivot.pivotmatrix.schema.AvroConverter;
import com.wise.MarketingPlatForm.report.domain.item.pivot.pivotmatrix.schema.avro.AvroSummaryParam;

public class SummaryParamConverter implements AvroConverter<SummaryParam, AvroSummaryParam> {

    private final EnumConverter<SummaryType> summaryTypeConverter = new EnumConverter<>(
            SummaryType.class);

    @Override
    public AvroSummaryParam convert(SummaryParam unconverted) {
        return new AvroSummaryParam(unconverted.getSelector(),
                summaryTypeConverter.convert(unconverted.getSummaryType()));
    }

    @Override
    public SummaryParam unconvert(AvroSummaryParam converted) {
        return new SummaryParam(converted.getSelector(),
                SummaryType.valueOf(converted.getSummaryType()));
    }

}
