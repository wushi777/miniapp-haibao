import * as fs          from 'fs';
import * as path        from 'path';

import { FileUtils }    from './FileUtils';
import { DateUtils }    from './DateUtils';

const MaxLogCountPerFile = 10000;

class Logger {
    private fsLogger:       Console = null;
    private logCount:       number  = 0;
    private logPath:        string  = '';

    public redBegin:        string = '\x1B[31m';
    public yellowBegin:     string = '\x1B[33m';
    public colorEnd:        string = '\x1B[39m';

    public logConsole:      boolean = true;

    private logCatsSet:     Set<string> = new Set();

    private logFilesMap:    Map<string, number> = new Map();
    private lastCleanDate:  Date = new Date(0);

    private getLogPrefix(type): string {
        const timeInfo = this.getCurrentTimeInfo();

        const timeString = `${timeInfo.year}-${timeInfo.month}-${timeInfo.day} ` + 
                           `${timeInfo.hour}:${timeInfo.minute}:${timeInfo.second}.${timeInfo.mmSecond}`;

        return `[${timeString}] [${type}]`;
    }

    private async checkLogCount(): Promise<void> {
        this.logCount++;
        if (this.logCount >= MaxLogCountPerFile) {
            await this.setLogPath(this.logPath);
            this.logCount = 0;
        }
    }

    private getCurrentTimeInfo(): any {
        const now = new Date();
        const year = now.getFullYear();
        
        let month: number | string = now.getMonth() + 1;
        if (month < 10){
            month = '0' + month;
        }

        let day: number | string = now.getDate();
        if (day < 10){
            day = '0' + day;
        }

        let hour: number | string = now.getHours();
        if (hour < 10){
            hour = '0' + hour;
        }

        let minute: number | string = now.getMinutes();
        if (minute < 10){
            minute = '0' + minute;
        }

        let second: number | string = now.getSeconds();
        if (second < 10){
            second = '0' + second;
        }

        let mmSecond: number | string = now.getMilliseconds();
        if (mmSecond < 10){
            mmSecond = '00' + mmSecond;
        }else if (mmSecond < 100){
            mmSecond = '0' + mmSecond;
        }

        return {
            year,
            month,
            day,
            hour,
            minute,
            second,
            mmSecond
        };
    }

    public getLogPath(): string {
        return this.logPath;
    }

    public async setLogPath(logPath: string): Promise<void> {
        const bExists: boolean = await FileUtils.exists(logPath);

        if (!bExists) {
            await FileUtils.mkdir(logPath);
        }

        if (this.logPath !== logPath) {
            this.logPath = logPath;

            // 读取日志文件列表
            this.logFilesMap.clear();
            this.lastCleanDate = new Date(0);

            const files: string[] = await FileUtils.readdir(this.logPath);
            for (const item of files) {
                const fileName: string      = path.join(this.logPath, item);
                const stat:     fs.Stats    = await FileUtils.lstat(fileName);

                if (stat.isFile()) {
                    const ext: string = path.extname(item);
                    if (ext === '.log') {
                        this.logFilesMap.set(fileName, stat.mtimeMs);
                    }
                }
            }
        }

        const timeInfo = this.getCurrentTimeInfo();

        const timeString = `${timeInfo.year}-${timeInfo.month}-${timeInfo.day}_` + 
                           `${timeInfo.hour}-${timeInfo.minute}-${timeInfo.second}`;

        const fileName = path.join(logPath, `${timeString}.log`);
        const output = fs.createWriteStream(fileName);

        this.logFilesMap.set(fileName, new Date().getTime());

        this.fsLogger = null;
        this.fsLogger = new console.Console(output);

        // 删除30天之前的日志文件
        const today = new Date();
        if (!DateUtils.sameDay(today, this.lastCleanDate)) {
            const minTimeMs: number = DateUtils.now() - 3600 * 24 * 30 * 1000;
            
            for (const [fileName, mtimeMs] of this.logFilesMap.entries()) {
                if (mtimeMs < minTimeMs) {
                    const bExists: boolean = await FileUtils.exists(fileName);
                    if (bExists) {
                        await FileUtils.unlink(fileName);
                    }
                    
                    this.logFilesMap.delete(fileName);
                }
            }

            this.lastCleanDate = today;
        }
    }

    public addCategory(category: string): void {
        this.logCatsSet.add(category);
    }

    public removeCategory(category: string): void {
        this.logCatsSet.delete(category);
    }

    public clearCategory(): void {
        this.logCatsSet.clear();
    }

    public async log(cat: string, ...args): Promise<void> {
        if (!this.logCatsSet.has(cat)) {
            return;
        }

        const prefix = this.getLogPrefix('LOG');

        if (this.logConsole) {
            console.log(prefix, ...args);
        }

        if (this.fsLogger){
            this.fsLogger.log(prefix, ...args);
            await this.checkLogCount();
        }
    }

    public async info(cat: string, ...args): Promise<void> {
        if (!this.logCatsSet.has(cat)) {
            return;
        }

        const prefix = this.getLogPrefix('INFO');

        if (this.logConsole) {
            console.info(prefix, ...args);
        }
        
        if (this.fsLogger){
            this.fsLogger.info(prefix, ...args);
            await this.checkLogCount();
        }
    }

    public async trace(cat: string, ...args): Promise<void> {
        if (!this.logCatsSet.has(cat)) {
            return;
        }

        const prefix = this.getLogPrefix('TRACE');

        if (this.logConsole) {
            console.trace(prefix, ...args);
        }
        
        if (this.fsLogger){
            this.fsLogger.trace(prefix, ...args);
            await this.checkLogCount();
        }
    }

    public async warn(cat: string, ...args): Promise<void> {
        if (!this.logCatsSet.has(cat)) {
            return;
        }

        const prefix = this.getLogPrefix('WARN');

        if (this.logConsole) {
            console.warn(this.yellowBegin, prefix, ...args, this.colorEnd);
        }
        
        if (this.fsLogger) {
            this.fsLogger.warn(prefix, ...args);
            await this.checkLogCount();
        }
    }

    public async error(...args): Promise<void> {
        const prefix = this.getLogPrefix('ERROR');

        //出错信息总是要输出到终端里
        if (true) {//(this.logConsole) {
            console.log(this.redBegin, prefix, ...args, this.colorEnd);
        }
        
        if (this.fsLogger){
            this.fsLogger.error(prefix, ...args);
            await this.checkLogCount();
        }
    }

    public async spaceRow(cat: string): Promise<void> {
        if (!this.logCatsSet.has(cat)) {
            return;
        }
        
        if (this.logConsole) {
            console.log('');
        }
        
        if (this.fsLogger){
            this.fsLogger.log('');
        }
    }
}

export const logger = new Logger();