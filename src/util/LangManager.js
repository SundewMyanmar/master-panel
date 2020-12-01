import Translator from '../config/Translate';

export default class LangManager {
    static textConverter = (content, mmFont) => {
        //Display Text Analysis
        if (typeof content === 'object') {
            mmFont = mmFont.startsWith('mm') ? mmFont.replace('mm', '') : 'zg';
            return {
                text: content[mmFont],
                isMyanmar: true,
            };
        }

        return {
            text: content,
            isMyanmar: false,
        };
    };

    static translateToUni = content => {
        return this.translateText(content, 'uni');
    };

    static translateText = (content, lang) => {
        if (content && typeof content === 'object') {
            if (lang === 'zg' && content.zg) {
                return content.zg;
            } else if (lang === 'uni' && content.uni) {
                return content.uni;
            }
            return JSON.stringify(content);
        } else if (content && Translator[content]) {
            return Translator[content][lang];
        }
        return content;
    };
}
