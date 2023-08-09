import defaultColor from "./color/default.json"
import defaultFont from "./color/default.json"
import defaultMargin from "./color/default.json"
import defaultSize from "./color/default.json"

import testColor from "./color/test.json"
import testFont from "./color/test.json"
import testMargin from "./color/test.json"
import testSize from "./color/test.json"

let theme = {};

/**
 * 호출 시 테마 변경. theme는 참조를 반환하므로 해당 메서드 호출 시
 * 모든 컴포넌트에 적용된 테마값이 바뀜.
 * @param {String} themeName 입력시 입력된 테마 적용
 * @returns 없음.
 */
const changeTheme = (themeName = "default") => {
    const makeTheme = function(color, font, margin, size) {
        theme.color = color;
        theme.font = font;
        theme.margin = margin;
        theme.size = size;
    }

    if (themeName == "test") {
        makeTheme(testColor, testFont, testMargin, testSize);
    } else {
        makeTheme(defaultColor, defaultFont, defaultMargin, defaultSize);
    }
};

/**
 * 공통으로 공유하는 theme 객체가 return되므로 사용할 때 되도록 해당 객체 통째로 사용.
 * 
 * ex)
 * ${theme.color.background} (O)
 *     
 * const bg = theme.color.background (X)
 * @param {String} themeName 테마 이름 입력시 테마 바뀜.
 * @returns 
 */
const getTheme = (themeName) => {
    if (themeName) {
        changeTheme(themeName);
    } else if(!theme.color) {
        changeTheme();
    }

    return theme;
}

export { getTheme, changeTheme };