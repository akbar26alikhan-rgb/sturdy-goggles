import { Dbf } from 'dbf-reader';
import { DBFData, DBFField } from '@/types/dbf';
import { Buffer } from 'buffer';

export async function parseDBF(buffer: ArrayBuffer): Promise<DBFData> {
  // Convert ArrayBuffer to Buffer for dbf-reader
  const nodeBuffer = Buffer.from(buffer);
  
  // Ensure Buffer is available globally for dbf-reader's internal use if needed
  if (typeof window !== 'undefined' && !(window as any).Buffer) {
    (window as any).Buffer = Buffer;
  }
  const datatable = Dbf.read(nodeBuffer);
  
  if (!datatable) {
    throw new Error('Failed to parse DBF file');
  }

  const fields: DBFField[] = datatable.columns.map(col => ({
    name: col.name,
    type: col.type,
    length: (col as any).length || 0,
    decimalCount: (col as any).decimalCount || 0
  }));

  return {
    fields,
    records: datatable.rows
  };
}
