import { DateTime } from 'luxon';
import chroma from 'chroma-js';

export default class FormatManager {
    static tryParseJson = (text) => {
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

    static defaultNull = (input) => {
        if (typeof input === 'undefined') {
            return null;
        }
        return input;
    };

    //Luxon Formatting
    static formatDate = (ms, format) => {
        if (!ms) return '-';
        if (typeof ms === 'number') {
            return DateTime.fromMillis(ms).toFormat(format);
        } else if (typeof ms === 'object') {
            return DateTime.fromObject(ms).toFormat(format);
        }
        return ms.toLocaleString();
    };

    static validURL = (str) => {
        const pattern = new RegExp(
            '^(https?:\\/\\/)?' + // protocol
                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
                '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
                '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
                '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
                '(\\#[-a-z\\d_]*)?$',
            'i',
        ); // fragment locator
        return !!pattern.test(str);
    };

    static isFunction(functionToCheck) {
        return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
    }

    static buildCSV = (input) => {
        if (typeof input === 'boolean') {
            return '"' + input + '"';
        }

        if (!input) {
            return '""';
        }

        return '"' + input.replace(/["]/g, '""') + '"';
    };

    static snakeToCamel = (str) => {
        return str.replace(/([-_][a-z])/g, (word) => word.toUpperCase().replace('_', ''));
    };

    static camelToSnake = (str) => {
        return str.replace(/([A-Z])/g, (word) => '_' + word.toLowerCase()).replace(/^_/, '');
    };

    static camelToReadable = (str) => {
        return str
            .match(/^[a-z]+|[A-Z][a-z]*/g)
            .map(function (x) {
                return x[0].toUpperCase() + x.substr(1).toLowerCase();
            })
            .join(' ');
    };

    static readableToSnake = (str) => {
        return str.toLowerCase().replace(/\s/g, '_');
    };

    static ValidateEmail = (mail) => {
        const re =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(mail);
    };

    static ValidateUser = (user) => {
        return /^[a-zA-Z0-9\\.]*$/.test(user);
    };

    static DateDiff = (date1, date2) => {
        //Get 1 day in milliseconds
        const one_day = 1000 * 60 * 60 * 24;

        // Convert both dates to milliseconds
        const date1_ms = date1.getTime();
        const date2_ms = date2.getTime();

        // Calculate the difference in milliseconds
        const difference_ms = date2_ms - date1_ms;

        // Convert back to days and return
        return Math.round(difference_ms / one_day);
    };

    static TimeDiff = (date1, date2) => {
        return Math.abs(date1 - date2) / 36e5;
    };

    static thousandSeparator = (input) => {
        return parseFloat(input).toLocaleString('en');
    };

    static hex2Rgb = (e) => {
        if (!e) return null;
        let t = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        e = e.replace(t, function (e, t, r, o) {
            return t + t + r + r + o + o;
        });
        let r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);
        return r
            ? {
                  r: parseInt(r[1], 16),
                  g: parseInt(r[2], 16),
                  b: parseInt(r[3], 16),
              }
            : null;
    };

    static rgb2Hex = (e) => {
        let t = Math.round(e.b) + 256 * Math.round(e.g) + 65536 * Math.round(e.r);
        return '#' + ('000000' + t.toString(16)).substr(-6);
    };

    static lightenHex = (hex) => {
        return chroma(hex).brighten().hex();
    };

    static darkenHex = (hex) => {
        return chroma(hex).darken().hex();
    };

    static contrastText = (hex) => {
        let c = hex.substring(1); // strip #
        let rgb = parseInt(c, 16); // convert rrggbb to decimal
        let r = (rgb >> 16) & 0xff; // extract red
        let g = (rgb >> 8) & 0xff; // extract green
        let b = (rgb >> 0) & 0xff; // extract blue

        let luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
        console.log('light/dark', luma);
        if (luma < 127.5) {
            return '#FFF';
        }
        return '#000';
    };

    static generateThemeColors = (hex) => {
        return {
            main: hex,
            light: this.darkenHex(hex),
            dark: this.lightenHex(hex),
            contrastText: this.contrastText(hex),
        };
    };

    static randomColor = () => {
        let letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    static createTimer = (value, interval, onChange) => {
        // Update the count down every 1 second
        let distance = value;
        let x = setInterval(function () {
            distance--;
            if (distance < 0) {
                clearInterval(x);
                if (onChange) onChange(null);
            } else {
                if (onChange) onChange(distance);
            }
        }, interval);
    };

    static cleanPhoneNumber = (phone) => {
        if (!phone) {
            return false;
        }
        //Check Mobile Number or Not
        const matches = phone.replace(/\s/, '').match(/^\+?(?![0][1-8]+)[0-9]{7,15}$/);
        if (!matches || matches.length <= 0) {
            return false;
        }

        //Clean Prefix
        if (phone.startsWith('09')) {
            phone = phone.substring(2, phone.length);
        } else if (phone.startsWith('959')) {
            phone = phone.substring(3, phone.length);
        } else if (phone.startsWith('+959')) {
            phone = phone.substring(4, phone.length);
        } else if (phone.startsWith('+9509')) {
            phone = phone.substring(5, phone.length);
        }

        return phone.trim();
    };
}
