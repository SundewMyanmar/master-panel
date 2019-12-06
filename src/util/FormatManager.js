import moment from 'moment';

// import {
//     DATE_FORMAT,
// } from "../config/Constant.js";

export default class FormatManager {
    static formatDate = (date, format) => {
        const unixTS = parseInt(date / 1000);
        return moment.unix(unixTS).format(format);
    }

    static toTimestamp = (date) => {
        return moment(date).valueOf();
    }

    static ValidateEmail = (mail) => {
        var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(mail);
    }

    static ValidateUser = (user) => {
        return /^[a-zA-Z0-9\\.]*$/.test(user);
    }

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
    }

    static TimeDiff = (date1, date2) => {
        return Math.abs(date1 - date2) / 36e5;
    }
}