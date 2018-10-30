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

describe('fmtTemplateForMultiLabel', () => {
  test('Some patterns', () => {
    expect(templatesUtil.fmtTemplateForMultiLabel(atenaBefore))
      .toEqual(atenaAfter);
  });
});
