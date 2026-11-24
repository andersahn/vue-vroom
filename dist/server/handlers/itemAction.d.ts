import type { Request } from '../Server';
export default function itemActionHandler(cb: (item: any) => any): (request: Request, db: any) => any;
