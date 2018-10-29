import templatesUtil from '../../utils/template';
import templates from '../../templates';
import atenaBefore from '../templates/atena_before.json';
import atenaAfter from '../templates/atena_after.json';


describe('isMultiLabel', () => {
  test('Some patterns', () => {
    expect(templatesUtil.isMultiLabel(templates.letterpack)).toEqual(false);
    expect(templatesUtil.isMultiLabel(templates.atena)).toEqual(true);
  });
});

describe('getLabelLengthInPage', () => {
  test('Some patterns', () => {
    expect(templatesUtil.getLabelLengthInPage(templates.letterpack)).toEqual(1);
    expect(templatesUtil.getLabelLengthInPage(templates.atena)).toEqual(8);
  });
});

describe('fmtSampledataForMultiLabel', () => {
  test('Some patterns', () => {
    expect(templatesUtil.fmtSampledataForMultiLabel(atenaBefore.atena.sampledata))
      .toEqual(atenaAfter);
  });
});

describe('fmtColumnsForMultiLabel', () => {
  test('Some patterns', () => {
    expect(templatesUtil.fmtColumnsForMultiLabel(atenaBefore.atena.columns))
      .toEqual(atenaAfter);
  });
});

describe('fmtDataSchemaForMultiLabel', () => {
  test('Some patterns', () => {
    expect(templatesUtil.fmtDataSchemaForMultiLabel(atenaBefore.atena.dataSchema))
      .toEqual(atenaAfter);
  });
});
