import type { Settings } from './../types';
import Server from './Server';
export default function createServer<DbType, IdentityModel>(settings: Settings, models: any, db: DbType): Server<DbType, IdentityModel> | null;
