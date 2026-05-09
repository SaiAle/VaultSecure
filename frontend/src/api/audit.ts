import client from './client';
import { AuditLog } from '../types';

interface AuditPage {
  content: AuditLog[];
  totalElements: number;
  totalPages: number;
  number: number;
}

export const getAuditLogs = (page = 0, size = 20) =>
  client.get<AuditPage>('/audit', { params: { page, size } }).then((r) => r.data);
