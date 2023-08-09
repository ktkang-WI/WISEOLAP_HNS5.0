import localizedString from '../localization';

describe('Localization', () => {
    it('Localization ko test', () => {
        localizedString.setLanguage("ko");
        expect(localizedString.test).toEqual("테스트");
    })

    it('Localization en test', () => {
        localizedString.setLanguage("en");
        expect(localizedString.test).toEqual("TEST");
    })
})