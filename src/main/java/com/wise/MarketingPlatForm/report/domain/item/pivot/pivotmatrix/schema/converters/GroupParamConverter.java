package com.wise.MarketingPlatForm.report.domain.item.pivot.pivotmatrix.schema.converters;

import com.wise.MarketingPlatForm.report.domain.item.pivot.param.GroupParam;
import com.wise.MarketingPlatForm.report.domain.item.pivot.pivotmatrix.schema.AvroConverter;
import com.wise.MarketingPlatForm.report.domain.item.pivot.pivotmatrix.schema.avro.AvroGroupParam;

public class GroupParamConverter implements AvroConverter<GroupParam, AvroGroupParam> {

    @Override
    public AvroGroupParam convert(GroupParam unconverted) {
        return new AvroGroupParam(unconverted.getSelector(), unconverted.getGroupInterval(),
                unconverted.getIsExpanded());
    }

    @Override
    public GroupParam unconvert(AvroGroupParam converted) {
        return new GroupParam(converted.getSelector(), converted.getGroupInterval(),
                converted.getIsExpanded());
    }

}
