package com.wise.MarketingPlatForm.report.domain.item.pivot.pivotmatrix.schema.converters;

import java.util.ArrayList;
import java.util.List;

import com.wise.MarketingPlatForm.report.domain.item.pivot.pivotmatrix.SummaryDimension;
import com.wise.MarketingPlatForm.report.domain.item.pivot.pivotmatrix.schema.AvroConverter;
import com.wise.MarketingPlatForm.report.domain.item.pivot.pivotmatrix.schema.avro.AvroSummaryDimension;

public class SummaryDimensionConverter
        implements AvroConverter<SummaryDimension, AvroSummaryDimension> {

    @Override
    public AvroSummaryDimension convert(SummaryDimension unconverted) {
        if (unconverted == null) {
            return null;
        }

        final int childCount = unconverted.getChildCount();
        final List<SummaryDimension> sdChildren = unconverted.getChildren();
        final List<AvroSummaryDimension> asdChildren = new ArrayList<>(childCount);

        if (sdChildren != null) {
            for (SummaryDimension sdChild : sdChildren) {
                asdChildren.add(convert(sdChild));
            }
        }

        final AvroSummaryDimension asd = new AvroSummaryDimension(
                unconverted.getChildDataGroupKey(), unconverted.getKey(), unconverted.getDepth(),
                unconverted.getPath(), unconverted.getParentPath(), asdChildren);

        return asd;
    }

    @Override
    public SummaryDimension unconvert(AvroSummaryDimension converted) {
        if (converted == null) {
            return null;
        }

        final SummaryDimension sd = new SummaryDimension();
        sd.setChildDataGroupKey(converted.getChildDataGroupKey());
        sd.setKey(converted.getKey());
        sd.setDepth(converted.getDepth());
        sd.setPath(converted.getPath());
        sd.setParentPath(converted.getParentPath());

        final List<AvroSummaryDimension> asdChildren = converted.getChildren();

        if (asdChildren != null) {
            for (AvroSummaryDimension asdChild : asdChildren) {
                sd.addChild(unconvert(asdChild));
            }
        }

        return sd;
    }

}
