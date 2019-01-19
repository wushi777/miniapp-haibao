export class PayUtils {
    //创建一个 out_trade_no, 用于微信/支付宝支付时的商户订单号 (20个数字字符)
    public static makeOutTradeNo(): string {
        const now = new Date();
        
        const year:     number          = now.getFullYear();

        let month:      number | string = now.getMonth() + 1;
        let date:       number | string = now.getDate();
        let hours:      number | string = now.getHours();
        let minutes:    number | string = now.getMinutes();
        let seconds:    number | string = now.getSeconds();
        let mSeconds:   number | string = now.getMilliseconds();

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

        if (mSeconds < 10) {
            mSeconds = '00' + mSeconds.toString();
        }else if (mSeconds < 100) {
            mSeconds = '0' + mSeconds.toString();
        }

        let suffix: string = Math.floor(Math.random() * 1000).toString();
        while (suffix.length < 3) {
            suffix = '0' + suffix;
        }

        const S: string = `${year}${month}${date}${hours}${minutes}${seconds}${mSeconds}${suffix}`;
        return S;
    }
}