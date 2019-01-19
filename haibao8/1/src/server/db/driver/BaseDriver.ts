export class BaseDriver {
    public get primaryKey(): string {
        return 'ID';
    }

    public async count(tableName: string, filter: any): Promise<number> {
        return 0;
    }

    public async find(tableName: string, filter: any): Promise<any[]> {
        return [];
    }

    public async findEx(tableName: string, filter: any, sort: string, desc: boolean, 
        from: number, count: number): Promise<any[]> 
    {
        return [];
    }

    public async findOne(tableName: string, filter: any): Promise<any> {
        return null;
    }

    public async insertOne(tableName: string, doc: any): Promise<number> {
        return 0;
    }

    public async upsertOne(tableName: string, filter: any, update: any): Promise<void> {

    }

    public async update(tableName: string, filter: any, update: any): Promise<void> {

    }

    public async delete(tableName: string, filter: any): Promise<void> {
        
    }

    public async aggregate(tableName: string, pipeline: any): Promise<any[]> {
        return [];
    }

    public async forceField(tableName: string, fieldName: string, fieldType: string): Promise<void> {
        
    }
}