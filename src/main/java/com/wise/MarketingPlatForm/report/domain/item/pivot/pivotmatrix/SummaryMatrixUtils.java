package com.wise.MarketingPlatForm.report.domain.item.pivot.pivotmatrix;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.wise.MarketingPlatForm.report.domain.item.pivot.model.Paging;
import com.wise.MarketingPlatForm.report.domain.item.pivot.model.SummaryValue;
import com.wise.MarketingPlatForm.report.domain.item.pivot.param.GroupParam;
import com.wise.MarketingPlatForm.report.domain.item.pivot.param.SummaryParam;
import com.wise.MarketingPlatForm.report.domain.item.pivot.pivotmatrix.impl.DefaultSummaryMatrixImpl;

public final class SummaryMatrixUtils {

    private static Logger log = LoggerFactory.getLogger(SummaryMatrixUtils.class);

    private SummaryMatrixUtils() {
    }

    public static void aggregateSummaryValueListTo(final List<SummaryValue> target,
            final List<SummaryValue> source) {
        final int targetSize = target != null ? target.size() : 0;
        final int sourceSize = source != null ? source.size() : 0;
        final int size = Math.min(targetSize, sourceSize);

        for (int i = 0; i < size; i++) {
            SummaryValue targetSummaryValue = target.get(i);
            SummaryValue sourceSummaryValue = source.get(i);
            aggregateSummaryValueTo(targetSummaryValue, sourceSummaryValue);
            target.set(i, targetSummaryValue);
        }
    }

    public static void aggregateSummaryValueTo(final SummaryValue target,
            final SummaryValue source) {
        switch (target.getSummaryType()) {
        case SUM:
        case CUSTOM:
            target.setCount(target.getCount() + source.getCount());
            if (target.getSum() != null && source.getSum() != null) {
                target.addSum(source.getSum());
            }
            if (target.getValue() != null && source.getValue() != null) {
                target.setValue(target.getValue().add(source.getValue()));
            }
            break;
        case AVERAGE:
        case AVG:
            target.setCount(target.getCount() + source.getCount());
            if (target.getSum() != null && source.getSum() != null) {
                target.addSum(source.getSum());
            }
            if (target.getSum() != null && target.getCount() > 0) {
                target.setValue(target.getSum().divide(BigDecimal.valueOf(target.getCount()), 5, BigDecimal.ROUND_HALF_UP));
            }
            break;
        case COUNT:
            target.setCount(target.getCount() + source.getCount());
            break;
        case COUNTDISTINCT:
            final Set<BigDecimal> sourceDistinctValues = source.getDistinctValues();
            if (sourceDistinctValues != null) {
                for (BigDecimal value : sourceDistinctValues) {
                    target.addDistinctValue(value);
                }
            }
            break;
        case MIN:
            if (target.getValue() != null && source.getValue() != null) {
                target.setValue(target.getValue().min(source.getValue()));
            }
            break;
        case MAX:
            if (target.getValue() != null && source.getValue() != null) {
                target.setValue(target.getValue().max(source.getValue()));
            }
            break;
        default:
            break;
        }
    }

    public static void writeSummaryMatrixToJson(final JsonGenerator gen, final Paging paging,
            final SummaryMatrix matrix) throws IOException {
        writeSummaryMatrixToJson(gen, paging, matrix, 0, -1);
    }

    public static void writeSummaryMatrixToJson(final JsonGenerator gen, final Paging paging,
            final SummaryMatrix matrix, final int beginCellRowIndex, final int maxCellRows)
            throws IOException {
        gen.writeStartObject();

        gen.writeFieldName("meta");

        gen.writeStartObject();
        gen.writeObjectField("rowGroupParams", matrix.getRowGroupParams());
        gen.writeObjectField("colGroupParams", matrix.getColGroupParams());
        gen.writeObjectField("summaryParams", matrix.getSummaryParams());

        if (paging == null) {
            gen.writeFieldName("rowSummaryDimension");
            writeSummaryDimensionToJson(gen, matrix.getRowSummaryDimension(), true);
            gen.writeFieldName("colSummaryDimension");
            writeSummaryDimensionToJson(gen, matrix.getColSummaryDimension(), true);
        }

        gen.writeFieldName("rowFlattendSummaryDimensions");
        SummaryDimension[] summaryDimensions = matrix.getRowFlattendSummaryDimensions();
        gen.writeStartArray();
        if (summaryDimensions != null) {
            for (SummaryDimension summaryDimension : summaryDimensions) {
                writeSummaryDimensionToJson(gen, summaryDimension, false);
            }
        }
        gen.writeEndArray();

        gen.writeFieldName("colFlattendSummaryDimensions");
        summaryDimensions = matrix.getColFlattendSummaryDimensions();
        gen.writeStartArray();
        if (summaryDimensions != null) {
            for (SummaryDimension summaryDimension : summaryDimensions) {
                writeSummaryDimensionToJson(gen, summaryDimension, false);
            }
        }
        gen.writeEndArray();

        gen.writeEndObject();

        if (paging != null && paging.getOffset() >= 0 && paging.getLimit() > 0) {
            gen.writeFieldName("paging");
            gen.writeStartObject();
            gen.writeNumberField("offset", paging.getOffset());
            gen.writeNumberField("limit", paging.getLimit());
            gen.writeNumberField("count", paging.getCount());
            gen.writeNumberField("total", paging.getTotal());
            gen.writeNumberField("distinctTotal", paging.getDistinctTotal());
            gen.writeEndObject();
        }

        gen.writeFieldName("matrix");
        gen.writeStartObject();
        gen.writeNumberField("rows", matrix.getRows());
        gen.writeNumberField("cols", matrix.getCols());

        gen.writeFieldName("cells");
        writeSummaryCellsToJson(gen, matrix.getSummaryCells(), beginCellRowIndex, maxCellRows);

        gen.writeEndObject();

        gen.writeEndObject();
    }

    public static void writeSummaryCellsToJson(final JsonGenerator gen, final SummaryCell[][] cells)
            throws IOException {
        writeSummaryCellsToJson(gen, cells, 0);
    }

    public static void writeSummaryCellsToJson(final JsonGenerator gen, final SummaryCell[][] cells,
            final int beginCellRowIndex) throws IOException {
        writeSummaryCellsToJson(gen, cells, beginCellRowIndex, -1);
    }

    public static void writeSummaryCellsToJson(final JsonGenerator gen, final SummaryCell[][] cells,
            final int beginCellRowIndex, final int maxCellRows) throws IOException {
        gen.writeStartArray();

        final int endIndex = Math.min(cells.length,
                beginCellRowIndex + (maxCellRows >= 0 ? maxCellRows : cells.length));

        for (int i = beginCellRowIndex; i < endIndex; i++) {
            gen.writeStartArray();

            final int cols = cells[i].length;
            for (int j = 0; j < cols; j++) {
                gen.writeObject(cells[i][j]);
            }

            gen.writeEndArray();
        }

        gen.writeEndArray();
    }

    private static void writeSummaryDimensionToJson(final JsonGenerator gen,
            final SummaryDimension summaryDimension, final boolean includeChildren)
            throws IOException {
        gen.writeStartObject();
        gen.writeStringField("key", summaryDimension.getKey());
        gen.writeStringField("path", summaryDimension.getPath());
        gen.writeStringField("parentPath", summaryDimension.getParentPath());
        gen.writeNumberField("depth", summaryDimension.getDepth());

        if (includeChildren) {
            gen.writeObjectField("children", summaryDimension.getChildren());
        }

        gen.writeEndObject();
    }

    public static SummaryMatrix readSummaryMatrixFromJson(final ObjectMapper objectMapper,
            JsonNode rootNode) throws IOException {
        List<GroupParam> rowGroupParams = null;
        List<GroupParam> colGroupParams = null;
        List<SummaryParam> summaryParams = null;
        SummaryDimension rowSummaryDimension = null;
        SummaryDimension colSummaryDimension = null;

        final JsonNode metaNode = rootNode.get("meta");
        rowGroupParams = readGroupParamsFromJsonNode(objectMapper, metaNode.get("rowGroupParams"));
        colGroupParams = readGroupParamsFromJsonNode(objectMapper, metaNode.get("colGroupParams"));
        summaryParams = readSummaryParamsFromJsonNode(objectMapper, metaNode.get("summaryParams"));
        rowSummaryDimension = objectMapper.treeToValue(metaNode.get("rowSummaryDimension"),
                SummaryDimension.class);
        colSummaryDimension = objectMapper.treeToValue(metaNode.get("colSummaryDimension"),
                SummaryDimension.class);

        final DefaultSummaryMatrixImpl matrix = new DefaultSummaryMatrixImpl(rowGroupParams,
                colGroupParams, summaryParams, rowSummaryDimension, colSummaryDimension);

        final JsonNode matrixNode = rootNode.get("matrix");
        final int rows = matrixNode.get("rows").asInt();
        final int cols = matrixNode.get("cols").asInt();
        final SummaryCell[][] summaryCells = readSummaryCellsFromJson(objectMapper, rows, cols,
                (ArrayNode) matrixNode.get("cells"));
        matrix.setSummaryCells(summaryCells);

        return matrix;
    }

    private static List<GroupParam> readGroupParamsFromJsonNode(final ObjectMapper objectMapper,
            final JsonNode jsonNode) throws IOException {
        final List<GroupParam> groupParams = new ArrayList<>();

        if (jsonNode != null && jsonNode.isArray()) {
            final ArrayNode arrayNode = (ArrayNode) jsonNode;
            for (JsonNode itemNode : arrayNode) {
                if (itemNode.isObject()) {
                    final GroupParam groupParam = objectMapper.treeToValue(itemNode,
                            GroupParam.class);
                    groupParams.add(groupParam);
                }
            }
        }

        return groupParams;
    }

    private static List<SummaryParam> readSummaryParamsFromJsonNode(final ObjectMapper objectMapper,
            final JsonNode jsonNode) throws IOException {
        final List<SummaryParam> summaryParams = new ArrayList<>();

        if (jsonNode != null && jsonNode.isArray()) {
            final ArrayNode arrayNode = (ArrayNode) jsonNode;
            for (JsonNode itemNode : arrayNode) {
                if (itemNode.isObject()) {
                    final SummaryParam summaryParam = objectMapper.treeToValue(itemNode,
                            SummaryParam.class);
                    summaryParams.add(summaryParam);
                }
            }
        }

        return summaryParams;
    }

    public static SummaryCell[][] readSummaryCellsFromJson(final ObjectMapper objectMapper, final int rows,
            final int cols, final ArrayNode arrayNode) throws IOException {
        final int effectiveRows = rows >= 0 ? rows : arrayNode.size();
        final SummaryCell[][] cells = new SummaryCell[effectiveRows][cols];

        int r = 0;
        for (JsonNode rowNode : arrayNode) {
            final ArrayNode rowArrayNode = (ArrayNode) rowNode;
            int c = 0;
            for (JsonNode itemNode : rowArrayNode) {
                final SummaryCell cell = new SummaryCell();
                final ArrayNode summaryValuesNode = (ArrayNode) itemNode.get("vs");
                for (JsonNode summaryValueNode : summaryValuesNode) {
                    final SummaryValue summaryValue = objectMapper.treeToValue(summaryValueNode,
                            SummaryValue.class);
                    cell.addSummaryValue(summaryValue);
                }
                cells[r][c] = cell;
                c++;
            }
            r++;
        }

        return cells;
    }
}
