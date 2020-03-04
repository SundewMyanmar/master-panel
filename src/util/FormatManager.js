import moment from 'moment';

export default class FormatManager {
    static tryParseJson = text => {
        try {
            const jsonObj = JSON.parse(text);
            if (jsonObj && typeof jsonObj === 'object') {
                return jsonObj;
            } else {
                return text;
            }
        } catch (e) {
            return text;
        }
    };

    static formatDate = (date, format) => {
        const unixTS = parseInt(date / 1000);
        return moment.unix(unixTS).format(format);
    };

    static buildCSV = input => {
        if (!input) {
            return '""';
        }
        return '"' + input.replace(/["]/g, '""') + '"';
    };

    static toTimestamp = date => {
        return moment(date).valueOf();
    };

    static snakeToCamel = str => {
        return str.replace(/([-_][a-z])/g, word => word.toUpperCase().replace('_', ''));
    };

    static camelToSnake = str => {
        return str.replace(/([A-Z])/g, word => '_' + word.toLowerCase()).replace(/^_/, '');
    };

    static ValidateEmail = mail => {
        var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(mail);
    };

    static ValidateUser = user => {
        return /^[a-zA-Z0-9\\.]*$/.test(user);
    };

    static DateDiff = (date1, date2) => {
        //Get 1 day in milliseconds
        var one_day = 1000 * 60 * 60 * 24;

        // Convert both dates to milliseconds
        var date1_ms = date1.getTime();
        var date2_ms = date2.getTime();

        // Calculate the difference in milliseconds
        var difference_ms = date2_ms - date1_ms;

        // Convert back to days and return
        return Math.round(difference_ms / one_day);
    };

    static TimeDiff = (date1, date2) => {
        return Math.abs(date1 - date2) / 36e5;
    };
}
