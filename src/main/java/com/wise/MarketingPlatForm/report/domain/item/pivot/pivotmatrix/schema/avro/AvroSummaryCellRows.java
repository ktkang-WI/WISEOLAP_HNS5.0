package com.wise.MarketingPlatForm.report.domain.item.pivot.pivotmatrix.schema.avro;

import org.apache.avro.specific.SpecificData;
import org.apache.avro.message.BinaryMessageEncoder;
import org.apache.avro.message.BinaryMessageDecoder;
import org.apache.avro.message.SchemaStore;

@SuppressWarnings("all")
@org.apache.avro.specific.AvroGenerated
public class AvroSummaryCellRows extends org.apache.avro.specific.SpecificRecordBase implements org.apache.avro.specific.SpecificRecord {
  private static final long serialVersionUID = 5325948544952211376L;
  public static final org.apache.avro.Schema SCHEMA$ = new org.apache.avro.Schema.Parser().parse("{\"type\":\"record\",\"name\":\"AvroSummaryCellRows\",\"namespace\":\"com.wise.comp.pivotmatrix.schema.avro\",\"fields\":[{\"name\":\"rows\",\"type\":{\"type\":\"array\",\"items\":{\"type\":\"record\",\"name\":\"AvroSummaryCellRow\",\"fields\":[{\"name\":\"row\",\"type\":{\"type\":\"array\",\"items\":{\"type\":\"record\",\"name\":\"AvroSummaryCell\",\"fields\":[{\"name\":\"summaryValues\",\"type\":{\"type\":\"array\",\"items\":{\"type\":\"record\",\"name\":\"AvroSummaryValue\",\"fields\":[{\"name\":\"fieldName\",\"type\":[{\"type\":\"string\",\"avro.java.string\":\"String\"},\"null\"]},{\"name\":\"summaryType\",\"type\":[{\"type\":\"string\",\"avro.java.string\":\"String\"},\"null\"]},{\"name\":\"count\",\"type\":\"long\"},{\"name\":\"sum\",\"type\":[{\"type\":\"string\",\"avro.java.string\":\"String\"},\"null\"]},{\"name\":\"value\",\"type\":[{\"type\":\"string\",\"avro.java.string\":\"String\"},\"null\"]},{\"name\":\"distinctValues\",\"type\":{\"type\":\"array\",\"items\":{\"type\":\"string\",\"avro.java.string\":\"String\"}}},{\"name\":\"textValue\",\"type\":[{\"type\":\"string\",\"avro.java.string\":\"String\"},\"null\"]}]}}}]}}}]}}}]}");
  public static org.apache.avro.Schema getClassSchema() { return SCHEMA$; }

  private static SpecificData MODEL$ = new SpecificData();

  private static final BinaryMessageEncoder<AvroSummaryCellRows> ENCODER =
      new BinaryMessageEncoder<AvroSummaryCellRows>(MODEL$, SCHEMA$);

  private static final BinaryMessageDecoder<AvroSummaryCellRows> DECODER =
      new BinaryMessageDecoder<AvroSummaryCellRows>(MODEL$, SCHEMA$);

  /**
   * Return the BinaryMessageDecoder instance used by this class.
   */
  public static BinaryMessageDecoder<AvroSummaryCellRows> getDecoder() {
    return DECODER;
  }

  /**
   * Create a new BinaryMessageDecoder instance for this class that uses the specified {@link SchemaStore}.
   * @param resolver a {@link SchemaStore} used to find schemas by fingerprint
   */
  public static BinaryMessageDecoder<AvroSummaryCellRows> createDecoder(SchemaStore resolver) {
    return new BinaryMessageDecoder<AvroSummaryCellRows>(MODEL$, SCHEMA$, resolver);
  }

  /** Serializes this AvroSummaryCellRows to a ByteBuffer. */
  public java.nio.ByteBuffer toByteBuffer() throws java.io.IOException {
    return ENCODER.encode(this);
  }

  /** Deserializes a AvroSummaryCellRows from a ByteBuffer. */
  public static AvroSummaryCellRows fromByteBuffer(
      java.nio.ByteBuffer b) throws java.io.IOException {
    return DECODER.decode(b);
  }

  @Deprecated public java.util.List<com.wise.MarketingPlatForm.report.domain.item.pivot.pivotmatrix.schema.avro.AvroSummaryCellRow> rows;

  /**
   * Default constructor.  Note that this does not initialize fields
   * to their default values from the schema.  If that is desired then
   * one should use <code>newBuilder()</code>.
   */
  public AvroSummaryCellRows() {}

  /**
   * All-args constructor.
   * @param rows The new value for rows
   */
  public AvroSummaryCellRows(java.util.List<com.wise.MarketingPlatForm.report.domain.item.pivot.pivotmatrix.schema.avro.AvroSummaryCellRow> rows) {
    this.rows = rows;
  }

  public org.apache.avro.Schema getSchema() { return SCHEMA$; }
  // Used by DatumWriter.  Applications should not call.
  public java.lang.Object get(int field$) {
    switch (field$) {
    case 0: return rows;
    default: throw new org.apache.avro.AvroRuntimeException("Bad index");
    }
  }

  // Used by DatumReader.  Applications should not call.
  @SuppressWarnings(value="unchecked")
  public void put(int field$, java.lang.Object value$) {
    switch (field$) {
    case 0: rows = (java.util.List<com.wise.MarketingPlatForm.report.domain.item.pivot.pivotmatrix.schema.avro.AvroSummaryCellRow>)value$; break;
    default: throw new org.apache.avro.AvroRuntimeException("Bad index");
    }
  }

  /**
   * Gets the value of the 'rows' field.
   * @return The value of the 'rows' field.
   */
  public java.util.List<com.wise.MarketingPlatForm.report.domain.item.pivot.pivotmatrix.schema.avro.AvroSummaryCellRow> getRows() {
    return rows;
  }

  /**
   * Sets the value of the 'rows' field.
   * @param value the value to set.
   */
  public void setRows(java.util.List<com.wise.MarketingPlatForm.report.domain.item.pivot.pivotmatrix.schema.avro.AvroSummaryCellRow> value) {
    this.rows = value;
  }

  /**
   * Creates a new AvroSummaryCellRows RecordBuilder.
   * @return A new AvroSummaryCellRows RecordBuilder
   */
  public static com.wise.MarketingPlatForm.report.domain.item.pivot.pivotmatrix.schema.avro.AvroSummaryCellRows.Builder newBuilder() {
    return new com.wise.MarketingPlatForm.report.domain.item.pivot.pivotmatrix.schema.avro.AvroSummaryCellRows.Builder();
  }

  /**
   * Creates a new AvroSummaryCellRows RecordBuilder by copying an existing Builder.
   * @param other The existing builder to copy.
   * @return A new AvroSummaryCellRows RecordBuilder
   */
  public static com.wise.MarketingPlatForm.report.domain.item.pivot.pivotmatrix.schema.avro.AvroSummaryCellRows.Builder newBuilder(com.wise.MarketingPlatForm.report.domain.item.pivot.pivotmatrix.schema.avro.AvroSummaryCellRows.Builder other) {
    return new com.wise.MarketingPlatForm.report.domain.item.pivot.pivotmatrix.schema.avro.AvroSummaryCellRows.Builder(other);
  }

  /**
   * Creates a new AvroSummaryCellRows RecordBuilder by copying an existing AvroSummaryCellRows instance.
   * @param other The existing instance to copy.
   * @return A new AvroSummaryCellRows RecordBuilder
   */
  public static com.wise.MarketingPlatForm.report.domain.item.pivot.pivotmatrix.schema.avro.AvroSummaryCellRows.Builder newBuilder(com.wise.MarketingPlatForm.report.domain.item.pivot.pivotmatrix.schema.avro.AvroSummaryCellRows other) {
    return new com.wise.MarketingPlatForm.report.domain.item.pivot.pivotmatrix.schema.avro.AvroSummaryCellRows.Builder(other);
  }

  /**
   * RecordBuilder for AvroSummaryCellRows instances.
   */
  public static class Builder extends org.apache.avro.specific.SpecificRecordBuilderBase<AvroSummaryCellRows>
    implements org.apache.avro.data.RecordBuilder<AvroSummaryCellRows> {

    private java.util.List<com.wise.MarketingPlatForm.report.domain.item.pivot.pivotmatrix.schema.avro.AvroSummaryCellRow> rows;

    /** Creates a new Builder */
    private Builder() {
      super(SCHEMA$);
    }

    /**
     * Creates a Builder by copying an existing Builder.
     * @param other The existing Builder to copy.
     */
    private Builder(com.wise.MarketingPlatForm.report.domain.item.pivot.pivotmatrix.schema.avro.AvroSummaryCellRows.Builder other) {
      super(other);
      if (isValidValue(fields()[0], other.rows)) {
        this.rows = data().deepCopy(fields()[0].schema(), other.rows);
        fieldSetFlags()[0] = true;
      }
    }

    /**
     * Creates a Builder by copying an existing AvroSummaryCellRows instance
     * @param other The existing instance to copy.
     */
    private Builder(com.wise.MarketingPlatForm.report.domain.item.pivot.pivotmatrix.schema.avro.AvroSummaryCellRows other) {
            super(SCHEMA$);
      if (isValidValue(fields()[0], other.rows)) {
        this.rows = data().deepCopy(fields()[0].schema(), other.rows);
        fieldSetFlags()[0] = true;
      }
    }

    /**
      * Gets the value of the 'rows' field.
      * @return The value.
      */
    public java.util.List<com.wise.MarketingPlatForm.report.domain.item.pivot.pivotmatrix.schema.avro.AvroSummaryCellRow> getRows() {
      return rows;
    }

    /**
      * Sets the value of the 'rows' field.
      * @param value The value of 'rows'.
      * @return This builder.
      */
    public com.wise.MarketingPlatForm.report.domain.item.pivot.pivotmatrix.schema.avro.AvroSummaryCellRows.Builder setRows(java.util.List<com.wise.MarketingPlatForm.report.domain.item.pivot.pivotmatrix.schema.avro.AvroSummaryCellRow> value) {
      validate(fields()[0], value);
      this.rows = value;
      fieldSetFlags()[0] = true;
      return this;
    }

    /**
      * Checks whether the 'rows' field has been set.
      * @return True if the 'rows' field has been set, false otherwise.
      */
    public boolean hasRows() {
      return fieldSetFlags()[0];
    }


    /**
      * Clears the value of the 'rows' field.
      * @return This builder.
      */
    public com.wise.MarketingPlatForm.report.domain.item.pivot.pivotmatrix.schema.avro.AvroSummaryCellRows.Builder clearRows() {
      rows = null;
      fieldSetFlags()[0] = false;
      return this;
    }

    @Override
    @SuppressWarnings("unchecked")
    public AvroSummaryCellRows build() {
      try {
        AvroSummaryCellRows record = new AvroSummaryCellRows();
        record.rows = fieldSetFlags()[0] ? this.rows : (java.util.List<com.wise.MarketingPlatForm.report.domain.item.pivot.pivotmatrix.schema.avro.AvroSummaryCellRow>) defaultValue(fields()[0]);
        return record;
      } catch (java.lang.Exception e) {
        throw new org.apache.avro.AvroRuntimeException(e);
      }
    }
  }

  @SuppressWarnings("unchecked")
  private static final org.apache.avro.io.DatumWriter<AvroSummaryCellRows>
    WRITER$ = (org.apache.avro.io.DatumWriter<AvroSummaryCellRows>)MODEL$.createDatumWriter(SCHEMA$);

  @Override public void writeExternal(java.io.ObjectOutput out)
    throws java.io.IOException {
    WRITER$.write(this, SpecificData.getEncoder(out));
  }

  @SuppressWarnings("unchecked")
  private static final org.apache.avro.io.DatumReader<AvroSummaryCellRows>
    READER$ = (org.apache.avro.io.DatumReader<AvroSummaryCellRows>)MODEL$.createDatumReader(SCHEMA$);

  @Override public void readExternal(java.io.ObjectInput in)
    throws java.io.IOException {
    READER$.read(this, SpecificData.getDecoder(in));
  }

}

