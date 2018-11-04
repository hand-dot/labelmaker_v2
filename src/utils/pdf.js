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
  async getBlob(datas, image, positionData) {
    // fontの読み込みが終わるまで待つ
    if (!window.pdfMake.fonts) {
      await util.sleep(1000);
      return this.getBlob(datas, image, positionData);
    }
    const docDefinition = {
      pageSize: 'A4',
      defaultStyle: { font: 'GenShin' },
      content: [],
    };
    if (!Array.isArray(datas) || datas.length === 0) {
      docDefinition.content.push({
        image: image || dummyImage,
        absolutePosition: { x: 0, y: 0 },
        width: 594.35,
      });
    } else {
      datas.forEach((data, index) => {
        docDefinition.content.push({
          image: image || dummyImage,
          absolutePosition: { x: 0, y: 0 },
          width: 595,
          pageBreak: index === 0 ? '' : 'before',
        });
        Object.keys(positionData).forEach((key) => {
          const labelData = positionData[key];
          const textObj = {
            text: util.zenkaku2hankaku(data[key]),
            absolutePosition: {
              x: util.mm2pt(labelData.position.x),
              y: util.mm2pt(labelData.position.y),
            },
            fontSize: labelData.size,
            characterSpacing: 'space' in labelData ? labelData.space : undefined,
            lineHeight: 'lineHeight' in labelData ? labelData.lineHeight : undefined,
          };
          docDefinition.content.push(textObj);
        });
      });
    }
    const pdf = window.pdfMake.createPdf(docDefinition);
    return new Promise(resolve => pdf.getBlob(blob => resolve(blob)));
  },
};
