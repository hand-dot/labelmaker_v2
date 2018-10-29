export default {
  isMultiLabel(template) {
    const regex = RegExp(/^{\d}.*/);
    return regex.test(template.columns[0].data);
  },
  getLabelLengthInPage(template) {
    if (!this.isMultiLabel(template)) return 1;
    const rowNums = template.columns.map(column => column.data.match(/^{\d}/)[0].replace(/{|}/g, ''));
    return Math.max(...rowNums);
  },
  fmtSampledataForMultiLabel(sampledata) {
    // TODO 実装
    return sampledata;
  },
  fmtColumnsForMultiLabel(columns) {
    // TODO 実装
    return columns;
  },
  fmtDataSchemaForMultiLabel(dataSchema) {
    // TODO 実装
    return dataSchema;
  },
};
