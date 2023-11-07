package com.wise.MarketingPlatForm.report.domain.item.pivot.pivotmatrix.schema;

public interface AvroConverter<U, C> {

    public C convert(U unconverted);

    public U unconvert(C converted);

}
