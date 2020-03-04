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
            return lang === 'zg' ? content.zg : content.uni;
        } else if (content && Translator[content]) {
            return Translator[content][lang];
        }
        return content;
    };
}
