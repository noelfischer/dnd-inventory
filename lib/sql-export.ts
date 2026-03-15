type Row = Record<string, unknown>;

type ExportTable = {
  tableName: string;
  rows: Row[];
  primaryKey: string;
};

function formatSqlValue(value: unknown): string {
  if (value === null || value === undefined) {
    return 'NULL';
  }

  if (value instanceof Date) {
    return `'${value.toISOString()}'`;
  }

  if (typeof value === 'string') {
    return `'${value.replace(/'/g, "''")}'`;
  }

  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }

  if (typeof value === 'bigint') {
    return value.toString();
  }

  return String(value);
}

export function generateInsertStatements(
  tableName: string,
  rows: Row[],
  primaryKey: string,
): string {
  if (!rows.length) {
    return '';
  }

  return rows
    .map((row) => {
      const columns = Object.keys(row)
        .map((column) => `"${column}"`)
        .join(', ');
      const values = Object.values(row)
        .map((value) => formatSqlValue(value))
        .join(', ');

      return `INSERT INTO "${tableName}" (${columns}) VALUES (${values}) ON CONFLICT ("${primaryKey}") DO NOTHING;`;
    })
    .join('\n');
}

export function buildSqlExport(tables: ExportTable[]): string {
  return tables
    .map((table) => generateInsertStatements(table.tableName, table.rows, table.primaryKey))
    .filter((chunk) => chunk.length > 0)
    .join('\n\n');
}
