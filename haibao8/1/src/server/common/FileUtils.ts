import * as fs      from 'fs';

export class FileUtils {
    // 获取一个目录里所有的文件名和子目录名(不递归)
    public static async readdir(path: fs.PathLike): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            fs.readdir(path, (err: NodeJS.ErrnoException, files: string[]): void => {
                if (err) {
                    reject(err);
                } else {
                    resolve(files);
                }
            });
        });
    } 

    // 判断文件或目录是否存在
    public static async exists(path: fs.PathLike): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            fs.exists(path, (exists: boolean): void => {
                resolve(exists);
            });
        });
    }

    // 创建一个目录
    public static async mkdir(path: fs.PathLike): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const options: fs.MakeDirectoryOptions = {
                recursive: true
            };

            fs.mkdir(path, options, (err: NodeJS.ErrnoException): void => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    // 获取文件或目录的状态信息
    public static async lstat(path: fs.PathLike): Promise<fs.Stats> {
        return new Promise<fs.Stats>((resolve, reject) => {
            fs.lstat(path, (err: NodeJS.ErrnoException, stats: fs.Stats): void => {
                if (err) {
                    reject(err);
                } else {
                    resolve(stats);
                }
            });
        });
    }

    // 删除一个文件或目录
    public static async unlink(path: fs.PathLike): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            fs.unlink(path, (err: NodeJS.ErrnoException): void => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    // 确保目录存在
    public static async ensureDirExists(dir: string): Promise<void> {
        const bExists: boolean = await FileUtils.exists(dir);
        if (!bExists) {
            await FileUtils.mkdir(dir);
        }
    }

    //以UTF8方式读取文件内容
    public static async readFileUTF8(fileName: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            fs.readFile(fileName, 'utf-8', (err: NodeJS.ErrnoException, text: string) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(text);
                }
            });
        });
    }

    // 以UTF8方式保存字符串到文件中
    public static async writeFileUTF8(fileName: string, text: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            fs.writeFile(fileName, text, (err: NodeJS.ErrnoException) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            })
        })
    }

    // 以二进制形式读取文件内容
    public static async readFileBinary(fileName: string): Promise<Buffer> {
        return new Promise<Buffer>((resolve, reject) => {
            fs.readFile(fileName, 'binary', (err: NodeJS.ErrnoException, content: Buffer) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(content);
                }
            });
        });
    }

    // 以二进制形式保存数据到文件中
    public static async writeFileBinary(fileName: string, content: Buffer): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            fs.writeFile(fileName, content, (err: NodeJS.ErrnoException) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            })
        })
    }
}