export class MathUtils {
    public static ensureRange(value: number, minValue: number, maxValue: number): number {
        const result = Math.min(Math.max(minValue, value), maxValue);
        return result;
    }

    //取整
    public static trunc(D: number): number {
        const S:        string = D.toString();
        const result:   number = parseInt(S);
        return result;
    }

    //获取一个在 min 和 max 之间的随机数(包含 min 和 max)
    public static makeRandomNum(min: number, max: number): number {   
        const range:    number = max - min;   
        const rand:     number = Math.random();   
        const result:   number = min + Math.round(rand * range);
        return result;
    } 
}