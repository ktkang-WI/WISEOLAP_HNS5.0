import { getTheme, changeTheme } from "config/theme";

describe('Theme', () => {
    it('theme Test', () => {
        let theme = getTheme();

        expect(theme.color.test).toEqual(undefined);

        changeTheme("test")

        expect(theme.color.test).toEqual("test");
    })
})