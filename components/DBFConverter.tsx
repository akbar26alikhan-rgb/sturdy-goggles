'use client';

import React, { useState, useMemo } from 'react';
import { 
  Upload, 
  FileSpreadsheet, 
  Search, 
  Download, 
  ChevronLeft, 
  ChevronRight,
  ArrowUpDown,
  FileText,
  Table as TableIcon,
  AlertCircle,
  X
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { parseDBF } from '@/lib/dbf';
import { DBFField, DBFData, SortConfig, PaginationState } from '@/types/dbf';
import { cn } from '@/lib/utils';

export default function DBFConverter() {
  const [data, setData] = useState<DBFData | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    pageSize: 10
  });
  const [isDragOver, setIsDragOver] = useState(false);

  const processFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.dbf')) {
      setError('Please upload a valid .dbf file');
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);
    setSearchQuery('');
    setSortConfig(null);
    setPagination({ currentPage: 1, pageSize: 10 });

    try {
      const buffer = await file.arrayBuffer();
      const parsedData = await parseDBF(buffer);
      setData(parsedData);
      setFileName(file.name.replace(/\.dbf$/i, ''));
    } catch (err) {
      console.error('Error parsing DBF:', err);
      setError('Failed to parse DBF file. It might be corrupted or use an unsupported format.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    await processFile(file);
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredRecords = useMemo(() => {
    if (!data) return [];

    let records = [...data.records];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      records = records.filter(record => 
        Object.values(record).some(val => 
          String(val).toLowerCase().includes(query)
        )
      );
    }

    if (sortConfig) {
      records.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return records;
  }, [data, searchQuery, sortConfig]);

  const paginatedRecords = useMemo(() => {
    const start = (pagination.currentPage - 1) * pagination.pageSize;
    return filteredRecords.slice(start, start + pagination.pageSize);
  }, [filteredRecords, pagination]);

  const totalPages = Math.ceil(filteredRecords.length / pagination.pageSize);

  const exportToCSV = () => {
    if (!data) return;
    const headers = data.fields.map(f => f.name);
    const rows = filteredRecords.map(record => 
      data.fields.map(f => record[f.name])
    );
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    if (!data) return;
    const worksheet = XLSX.utils.json_to_sheet(filteredRecords);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  const exportToPDF = () => {
    if (!data) return;
    const doc = new jsPDF();
    const headers = data.fields.map(f => f.name);
    const rows = filteredRecords.map(record => 
      data.fields.map(f => record[f.name])
    );

    autoTable(doc, {
      head: [headers],
      body: rows,
      styles: { fontSize: 8 },
      margin: { top: 20 },
    });
    
    doc.save(`${fileName}.pdf`);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Upload Section */}
      <div 
        className={cn(
          "bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border-2 border-dashed overflow-hidden transition-all duration-200",
          isDragOver 
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/10" 
            : "border-zinc-200 dark:border-zinc-800"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="p-8 text-center">
          <div className="mb-6 flex justify-center">
            <div className={cn(
              "p-4 rounded-full transition-colors duration-200",
              isDragOver 
                ? "bg-blue-100 dark:bg-blue-900/30" 
                : "bg-blue-50 dark:bg-blue-900/20"
            )}>
              <FileSpreadsheet className={cn(
                "w-12 h-12 transition-colors duration-200",
                isDragOver 
                  ? "text-blue-700 dark:text-blue-300" 
                  : "text-blue-600 dark:text-blue-400"
              )} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">DBF Converter</h2>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-md mx-auto mb-8">
            Drag and drop your dBase (.dbf) file or click to browse. Preview, filter, and export to CSV, Excel, or PDF.
          </p>

          <label className="relative group cursor-pointer inline-block">
            <input 
              type="file" 
              className="hidden" 
              accept=".dbf" 
              onChange={handleFileUpload}
              disabled={loading}
            />
            <div className={cn(
              "flex items-center gap-3 px-8 py-4 rounded-xl font-bold transition-all shadow-lg",
              loading 
                ? "bg-zinc-100 text-zinc-400 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 active:scale-95"
            )}>
              {loading ? (
                <div className="w-5 h-5 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Upload className="w-5 h-5" />
              )}
              {loading ? 'Processing...' : 'Upload DBF File'}
            </div>
          </label>

          {fileName && (
            <div className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
              Currently viewing: <span className="font-medium text-zinc-700 dark:text-zinc-300">{fileName}.dbf</span>
            </div>
          )}
          
          {error && (
            <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3 text-red-800 dark:text-red-200 text-sm max-w-md mx-auto">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
              <button onClick={() => setError(null)} className="ml-auto">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Data Section */}
      {data && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-md">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
              <input 
                type="text"
                placeholder="Search across all fields..."
                className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPagination(prev => ({ ...prev, currentPage: 1 }));
                }}
              />
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
              <button 
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <FileText className="w-4 h-4" />
                CSV
              </button>
              <button 
                onClick={exportToExcel}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Excel
              </button>
              <button 
                onClick={exportToPDF}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <Download className="w-4 h-4" />
                PDF
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
                    {data.fields.map((field) => (
                      <th 
                        key={field.name}
                        className="px-4 py-3 text-sm font-bold text-zinc-700 dark:text-zinc-300 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        onClick={() => handleSort(field.name)}
                      >
                        <div className="flex items-center gap-2 whitespace-nowrap">
                          {field.name}
                          <ArrowUpDown className={cn(
                            "w-3 h-3",
                            sortConfig?.key === field.name ? "text-blue-500" : "text-zinc-400"
                          )} />
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {paginatedRecords.length > 0 ? (
                    paginatedRecords.map((record, idx) => (
                      <tr key={idx} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                        {data.fields.map((field) => (
                          <td key={field.name} className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">
                            {String(record[field.name])}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={data.fields.length} className="px-4 py-12 text-center text-zinc-500 dark:text-zinc-400">
                        <div className="flex flex-col items-center gap-2">
                          <TableIcon className="w-8 h-8 opacity-20" />
                          <p>No records found matching your search.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-50/50 dark:bg-zinc-800/20">
              <div className="text-sm text-zinc-500 dark:text-zinc-400">
                Showing <span className="font-medium text-zinc-900 dark:text-white">
                  {filteredRecords.length > 0 ? (pagination.currentPage - 1) * pagination.pageSize + 1 : 0}
                </span> to <span className="font-medium text-zinc-900 dark:text-white">
                  {Math.min(pagination.currentPage * pagination.pageSize, filteredRecords.length)}
                </span> of <span className="font-medium text-zinc-900 dark:text-white">{filteredRecords.length}</span> records
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  disabled={pagination.currentPage === 1}
                  onClick={() => setPagination(p => ({ ...p, currentPage: p.currentPage - 1 }))}
                  className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 disabled:opacity-50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-1">
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    let pageNum = pagination.currentPage;
                    if (pagination.currentPage <= 3) pageNum = i + 1;
                    else if (pagination.currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                    else pageNum = pagination.currentPage - 2 + i;
                    
                    if (pageNum <= 0 || pageNum > totalPages) return null;
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPagination(p => ({ ...p, currentPage: pageNum }))}
                        className={cn(
                          "w-8 h-8 rounded-lg text-sm font-medium transition-colors",
                          pagination.currentPage === pageNum 
                            ? "bg-blue-600 text-white" 
                            : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                        )}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button 
                  disabled={pagination.currentPage === totalPages || totalPages === 0}
                  onClick={() => setPagination(p => ({ ...p, currentPage: p.currentPage + 1 }))}
                  className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 disabled:opacity-50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <select 
                className="bg-transparent border border-zinc-200 dark:border-zinc-700 rounded-lg px-2 py-1 text-sm focus:outline-none"
                value={pagination.pageSize}
                onChange={(e) => setPagination({ currentPage: 1, pageSize: Number(e.target.value) })}
              >
                <option value="10">10 per page</option>
                <option value="25">25 per page</option>
                <option value="50">50 per page</option>
                <option value="100">100 per page</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
