import React, { useState, useEffect } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

const PRIMARY_COLOR = '#2C7B34';

interface ProductData {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  sku: string;
  imageUrl: string;
  isActive: boolean;
}

interface ImportResult {
  success: number;
  errors: number;
}

interface CSVImportModalProps {
  businessId: string;
  onClose: () => void;
}

export default function CSVImportModal({ businessId, onClose }: CSVImportModalProps) {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const importProducts = useMutation(api.products.importProducts);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setCsvFile(file);
      parseCSV(file);
    } else {
      setError('Please select a valid CSV file');
    }
  };

  const parseCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      // Expected headers
      const expectedHeaders = ['name', 'description', 'price', 'stock', 'category', 'sku', 'imageurl', 'isactive'];
      
      // Validate headers
      const hasRequiredHeaders = expectedHeaders.slice(0, 4).every(header => 
        headers.includes(header)
      );
      
      if (!hasRequiredHeaders) {
        setError('CSV must contain headers: name, description, price, stock (at minimum)');
        return;
      }

      const data: ProductData[] = [];
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
          const values = lines[i].split(',').map(v => v.trim());
          const row: Record<string, string> = {};
          
          headers.forEach((header, index) => {
            row[header] = values[index] || '';
          });
          
          // Validate required fields
          if (row.name && row.price && row.stock) {
            data.push({
              name: row.name,
              description: row.description || '',
              price: parseFloat(row.price) || 0,
              stock: parseInt(row.stock) || 0,
              category: row.category || '',
              sku: row.sku || '',
              imageUrl: row.imageurl || '',
              isActive: row.isactive ? row.isactive.toLowerCase() === 'true' : true,
            });
          }
        }
      }
      
      setCsvData(data);
      setError('');
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (csvData.length === 0) {
      setError('No valid data to import');
      return;
    }

    // Validate businessId before proceeding
    if (!businessId) {
      setError('Business ID is required for import. Please ensure you are properly logged in.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('🔄 Starting CSV import with businessId:', businessId);
      console.log('📦 Products to import:', csvData.length);
      
      const result = await importProducts({
        businessId: businessId as Id<"businesses">,
        products: csvData,
      });

      console.log('✅ Import result:', result);
      setImportResult(result);
    } catch (err) {
      console.error('❌ Import error:', err);
      console.error('BusinessId:', businessId);
      setError(err instanceof Error ? err.message : 'An error occurred during import');
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const headers = ['name', 'description', 'price', 'stock', 'category', 'sku', 'imageurl', 'isactive'];
    const sampleData = [
      ['Sample Product 1', 'This is a sample product', '29.99', '100', 'Electronics', 'SKU001', 'https://example.com/image1.jpg', 'true'],
      ['Sample Product 2', 'Another sample product', '15.50', '50', 'Clothing', 'SKU002', '', 'false']
    ];
    
    const csvContent = [headers, ...sampleData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: isMobile ? 'flex-start' : 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: isMobile ? '0.5rem' : '1rem',
      overflowY: 'auto'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: isMobile ? '8px' : '12px',
        padding: isMobile ? '1.5rem' : '2rem',
        width: '100%',
        maxWidth: isMobile ? '100%' : '600px',
        maxHeight: isMobile ? '100vh' : '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        marginTop: isMobile ? '1rem' : '0'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: PRIMARY_COLOR,
            margin: 0
          }}>
            Import Products from CSV
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6B7280',
              padding: '4px'
            }}
          >
            ×
          </button>
        </div>

        {/* Template Download */}
        <div style={{
          backgroundColor: '#F0FDF4',
          border: '1px solid #BBF7D0',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '1.5rem'
        }}>
          <h3 style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#166534',
            margin: '0 0 0.5rem 0'
          }}>
            📋 CSV Template
          </h3>
          <p style={{
            fontSize: '12px',
            color: '#166534',
            margin: '0 0 1rem 0'
          }}>
            Download our template to see the correct format. Required columns: name, description, price, stock.
          </p>
          <button
            onClick={downloadTemplate}
            style={{
              backgroundColor: PRIMARY_COLOR,
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 16px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            📥 Download Template
          </button>
        </div>

        {/* File Upload */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '8px'
          }}>
            Select CSV File
          </label>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px dashed #D1D5DB',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          />
        </div>

        {/* Preview */}
        {csvData.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Preview ({csvData.length} products)
            </h3>
            <div style={{
              maxHeight: '200px',
              overflowY: 'auto',
              border: '1px solid #E5E7EB',
              borderRadius: '8px'
            }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '12px'
              }}>
                <thead style={{ backgroundColor: '#F9FAFB' }}>
                  <tr>
                    <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #E5E7EB' }}>Name</th>
                    <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #E5E7EB' }}>Price</th>
                    <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #E5E7EB' }}>Stock</th>
                    <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #E5E7EB' }}>Category</th>
                  </tr>
                </thead>
                <tbody>
                  {csvData.slice(0, 10).map((product, index) => (
                    <tr key={index}>
                      <td style={{ padding: '8px', borderBottom: '1px solid #F3F4F6' }}>{product.name}</td>
                      <td style={{ padding: '8px', borderBottom: '1px solid #F3F4F6' }}>${product.price}</td>
                      <td style={{ padding: '8px', borderBottom: '1px solid #F3F4F6' }}>{product.stock}</td>
                      <td style={{ padding: '8px', borderBottom: '1px solid #F3F4F6' }}>{product.category}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {csvData.length > 10 && (
                <div style={{
                  padding: '8px',
                  textAlign: 'center',
                  fontSize: '12px',
                  color: '#6B7280'
                }}>
                  ... and {csvData.length - 10} more products
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div style={{
            backgroundColor: '#FEE2E2',
            color: '#DC2626',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '1rem',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        {/* Import Result */}
        {importResult && (
          <div style={{
            backgroundColor: '#F0FDF4',
            border: '1px solid #BBF7D0',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1rem'
          }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#166534',
              margin: '0 0 0.5rem 0'
            }}>
              ✅ Import Complete
            </h3>
            <p style={{
              fontSize: '12px',
              color: '#166534',
              margin: '0'
            }}>
              Successfully imported {importResult.success} products.
              {importResult.errors > 0 && ` ${importResult.errors} products had errors.`}
            </p>
          </div>
        )}

        {/* Actions */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'flex-end',
          marginTop: '2rem',
          paddingTop: '1rem',
          borderTop: '1px solid #E5E7EB'
        }}>
          <button
            onClick={onClose}
            style={{
              backgroundColor: '#F3F4F6',
              color: '#374151',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {importResult ? 'Close' : 'Cancel'}
          </button>
          {!importResult && (
            <button
              onClick={handleImport}
              disabled={loading || csvData.length === 0}
              style={{
                backgroundColor: loading || csvData.length === 0 ? '#9CA3AF' : PRIMARY_COLOR,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: loading || csvData.length === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Importing...' : `Import ${csvData.length} Products`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
