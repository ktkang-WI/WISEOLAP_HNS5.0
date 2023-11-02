package com.wise.MarketingPlatForm.report.domain.item.pivot.pivotmatrix;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import org.apache.avro.io.DatumReader;
import org.apache.avro.io.DatumWriter;
import org.apache.avro.io.Decoder;
import org.apache.avro.io.DecoderFactory;
import org.apache.avro.io.Encoder;
import org.apache.avro.io.EncoderFactory;
import org.apache.avro.specific.SpecificDatumReader;
import org.apache.avro.specific.SpecificDatumWriter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.wise.MarketingPlatForm.report.domain.item.pivot.pivotmatrix.schema.avro.AvroSummaryMatrix;

public final class AvroSummaryMatrixUtils {

    private static Logger log = LoggerFactory.getLogger(AvroSummaryMatrixUtils.class);

    private AvroSummaryMatrixUtils() {
    }

    public static void serializeAvroSummaryMatrixToAvroData(final OutputStream output,
            final AvroSummaryMatrix avroSummaryMatrix) throws IOException {
        DatumWriter<AvroSummaryMatrix> writer = new SpecificDatumWriter<>(AvroSummaryMatrix.class);
        Encoder encoder = EncoderFactory.get().binaryEncoder(output, null);
        writer.write(avroSummaryMatrix, encoder);
        encoder.flush();
    }

    public static AvroSummaryMatrix deserializeSummaryMatrixFromAvroData(final InputStream input)
            throws IOException {
        DatumReader<AvroSummaryMatrix> reader = new SpecificDatumReader<>(AvroSummaryMatrix.class);
        Decoder decoder = DecoderFactory.get().binaryDecoder(input, null);
        return reader.read(null, decoder);
    }
}
