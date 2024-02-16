export function objectValuesToArray(obj: { [key: string]: any }): any[] {
  return Object.values(obj);
}
export function isEqual(obj1: any, obj2: any): boolean {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}
