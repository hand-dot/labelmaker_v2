import util from './index';

const dummyImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYII=';

window.onload = () => {
  window.pdfMake.fonts = {
    GenShin: {
      normal: 'GenShinGothic-Normal-Sub.ttf',
    },
  };
};

export default {
  create(datas, image, positionData) {
    if (!Array.isArray(datas) || datas.length === 0) {
      return new Promise(resolve => resolve(new Blob([])));
    }
    const clonedDatas = JSON.parse(JSON.stringify(datas));
    const docDefinition = {
      pageSize: 'A4',
      defaultStyle: { font: 'GenShin' },
      content: [],
    };

    clonedDatas.forEach((data, index) => {
      docDefinition.content.push({
        image: image || dummyImage,
        absolutePosition: { x: 0, y: 0 },
        width: 594.35,
        pageBreak: index === 0 ? '' : 'before',
      });
      Object.keys(positionData).forEach((key) => {
        const labelData = positionData[key];
        const textObj = {
          text: data[key],
          absolutePosition: {
            x: util.mm2pt(labelData.position.x),
            y: util.mm2pt(labelData.position.y),
          },
          fontSize: labelData.size,
          characterSpacing: 'space' in labelData ? labelData.space : undefined,
        };
        docDefinition.content.push(textObj);
      });
    });
    const pdf = window.pdfMake.createPdf(docDefinition);
    return new Promise(resolve => pdf.getBlob(blob => resolve(blob)));
  },
  open(blob) {
    return window.navigator.msSaveBlob
      ? window.navigator.msSaveOrOpenBlob(blob, `${Date.now()}.pdf`) : window.open(URL.createObjectURL(blob));
  },
};
