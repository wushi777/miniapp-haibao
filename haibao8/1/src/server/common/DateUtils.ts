export class DateUtils {
    public static sameDay(date1: Date, date2: Date): boolean {
        return (date1.getFullYear() === date2.getFullYear() &&
                date1.getMonth()    === date2.getMonth() &&
                date1.getDate()     === date2.getDate());
    }

    public static getNowString(): string {
        const now = new Date();
        
        const year:     number  = now.getFullYear();

        let month:      any     = now.getMonth() + 1;
        let date:       any     = now.getDate();
        let hours:      any     = now.getHours();
        let minutes:    any     = now.getMinutes();
        let seconds:    any 	= now.getSeconds();

        if (month < 10){
            month = '0' + month.toString();
        }

        if (date < 10){
            date = '0' + date.toString();
        }

        if (hours < 10) {
            hours = '0' + hours.toString();
        }

        if (minutes < 10) {
            minutes = '0' + minutes.toString();
        }

        if (seconds < 10) {
            seconds = '0' + seconds.toString();
        }

        return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
    }

    //获取当前时间戳(以毫秒为单位)
    public static now(): number {
        return new Date().getTime();
    }

    //endDate 和 startDate 都为毫秒数
    public static getRangeDateShowFormat(startDate: number, endDate: number) : string {
        const startDateObj  = new Date(startDate);
        const startYear     = startDateObj.getFullYear();
        const startMonth    = startDateObj.getMonth() + 1;
        const startDay      = startDateObj.getDate();
        const startHour     = startDateObj.getHours();

        const endDateObj    = new Date(endDate);
        const endYear       = endDateObj.getFullYear();
        const endMonth      = endDateObj.getMonth() + 1;
        const endDay        = endDateObj.getDate();
        const endHour       = endDateObj.getHours();

        if (startYear !== endYear) {
            return '%Y';
        }

        if (startMonth !== endMonth) {
            return '%Y-%m';
        }

        if (startDay !== endDay) {
            return '%Y-%m-%d';
        }

        if (startHour !== endHour) {
            return '%m-%d %H:00';
        }

        return '%H:%M';

        // const seconds = (endDate - startDate) / 1000;
        // let format: string;

        // if (seconds <= 60 * 60) {
        //     format = '%H:%M'; //分钟  
        // } else if (seconds <= 60 * 60 * 24) {
        //     format = '%m-%d %H:00';
        // } else if (seconds <= 60 * 60 * 24 * 7) {
        //     format = '%Y-%m-%d';
        // } else if (seconds <= 60 * 60 * 24 * 31) {
        //     format = '%Y-%m-%d';
        // }  else if (seconds <= 60 * 60 * 24 * 31 * 3) {
        //     format = '%Y-%m-%d';
        // } else if (seconds <= 60 * 60 * 24 * 31 * 12) {
        //     format = '%Y-%m';
        // } else {
        //     format = '%Y';
        // }

        // return format;
    }

    public static getTimeZone(): string {
        let timeZone       = '';
        let timeZoneOffset = new Date().getTimezoneOffset() / 60;

        if (timeZoneOffset < 0) {
            timeZoneOffset = Math.abs(timeZoneOffset);
            timeZone = timeZoneOffset < 10 ? `+0${timeZoneOffset}:00` : `+${timeZoneOffset}:00`;
        } else {
            timeZoneOffset = Math.abs(timeZoneOffset);
            timeZone = timeZoneOffset < 10 ? `-0${timeZoneOffset}:00` : `-${timeZoneOffset}:00`;
        }
        return timeZone;
    }

    //dateType: 1按年, 2按月, 3按日
    public static getDateShowFormatByType(dateType: number): string {
        switch (dateType) {
            case 1: 
                return '%Y';
            case 2: 
                return '%Y-%m';
            default:
                return '%Y-%m-%d';
        }
    }
}