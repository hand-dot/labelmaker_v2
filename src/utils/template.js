import util from './index';

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
  fmtTemplateForMultiLabel(template) {
    if (!this.isMultiLabel(template)) return template;
    const clonedTemplate = JSON.parse(JSON.stringify(template));
    const labelInDataLength = clonedTemplate.columns.length
    / this.getLabelLengthInPage(clonedTemplate);
    // sampledata
    clonedTemplate.sampledata = util.divide(Object.entries(clonedTemplate.sampledata[0]),
      labelInDataLength).map((datas) => {
      const obj = {};
      datas.forEach((data) => {
        const [key, value] = data;
        obj[key.replace(/{\d}/, '')] = value;
      });
      return obj;
    });
    // columns
    clonedTemplate.columns = Object.keys(clonedTemplate.sampledata[0])
      .map(data => ({ title: data, data }));
    // dataSchema
    clonedTemplate.dataSchema = {};
    Object.keys(clonedTemplate.sampledata[0]).forEach((key) => {
      clonedTemplate.dataSchema[key] = null;
    });
    return clonedTemplate;
  },
};
