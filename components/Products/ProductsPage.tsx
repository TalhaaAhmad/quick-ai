import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import ProductModal from './ProductModal';
import CSVImportModal from './CSVImportModal';

const PRIMARY_COLOR = '#2C7B34';

interface Business {
  _id: string;
  ownerName: string;
  email: string;
  ownerId: string;
  businessName: string;
  businessDescription: string;
  whatsappIntegrated: boolean;
  whatsappToken?: string;
  createdAt: number;
  roles: string[];
  settings: {
    notifications: boolean;
    language: string;
  };
  lastLoginAt: number;
}

interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category?: string;
  sku?: string;
  imageUrl?: string;
  isActive: boolean;
}

interface ProductsPageProps {
  business: Business;
}

export default function ProductsPage({ business }: ProductsPageProps) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Debug logging
  console.log('📊 ProductsPage - Business object:', business);
  console.log('📊 ProductsPage - Business ID:', business?._id);

  // Detect mobile screen size
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Queries
  const products = useQuery(api.products.getProducts, 
    business?._id ? {
      businessId: business._id,
      category: selectedCategory || undefined,
    } : "skip"
  );

  const categories = useQuery(api.products.getCategories, 
    business?._id ? {
      businessId: business._id,
    } : "skip"
  );

  // Mutations
  const deleteProduct = useMutation(api.products.deleteProduct);

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct({ productId });
        console.log('Product deleted successfully');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleCloseCSVModal = () => {
    setShowCSVModal(false);
  };

  if (!business?._id) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading business information...</p>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: isMobile ? '1rem' : '2rem',
      maxWidth: '100%',
      overflowX: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: isMobile ? 'flex-start' : 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem',
        flexDirection: isMobile ? 'column' : 'row'
      }}>
        <div style={{ flex: isMobile ? '1' : 'auto' }}>
          <h1 style={{
            fontSize: isMobile ? '1.5rem' : '2rem',
            fontWeight: '700',
            color: PRIMARY_COLOR,
            margin: '0 0 0.5rem 0',
            lineHeight: '1.2'
          }}>
            Products Management
          </h1>
          <p style={{ 
            color: '#666', 
            margin: 0,
            fontSize: isMobile ? '0.9rem' : '1rem'
          }}>
            Manage your product inventory and pricing
          </p>
        </div>
        
        <div style={{ 
          display: 'flex', 
          gap: isMobile ? '0.5rem' : '1rem', 
          flexWrap: 'wrap',
          width: isMobile ? '100%' : 'auto'
        }}>
          <button
            onClick={() => setShowCSVModal(true)}
            style={{
              backgroundColor: '#6B7280',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: isMobile ? '10px 16px' : '12px 24px',
              fontSize: isMobile ? '12px' : '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'background-color 0.3s',
              flex: isMobile ? '1' : 'auto',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4B5563'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6B7280'}
          >
            📁 {isMobile ? 'Import' : 'Import CSV'}
          </button>
          
          <button
            onClick={() => setShowModal(true)}
            style={{
              backgroundColor: PRIMARY_COLOR,
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: isMobile ? '10px 16px' : '12px 24px',
              fontSize: isMobile ? '12px' : '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'background-color 0.3s',
              flex: isMobile ? '1' : 'auto',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#245f28'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = PRIMARY_COLOR}
          >
            ➕ {isMobile ? 'Add' : 'Add Product'}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex',
        gap: isMobile ? '0.5rem' : '1rem',
        marginBottom: '2rem',
        alignItems: isMobile ? 'flex-start' : 'center',
        flexWrap: 'wrap',
        flexDirection: isMobile ? 'column' : 'row'
      }}>
        <div style={{ width: isMobile ? '100%' : 'auto' }}>
          <label style={{
            display: 'block',
            fontSize: isMobile ? '12px' : '14px',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '4px'
          }}>
            Category Filter:
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: isMobile ? '10px 12px' : '8px 12px',
              border: '1px solid #D1D5DB',
              borderRadius: '6px',
              fontSize: isMobile ? '14px' : '14px',
              backgroundColor: 'white',
              width: isMobile ? '100%' : '200px',
              minWidth: isMobile ? 'auto' : '200px'
            }}
          >
            <option value="">All Categories</option>
            {categories?.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        
        <div style={{ 
          fontSize: isMobile ? '12px' : '14px', 
          color: '#6B7280',
          alignSelf: isMobile ? 'flex-start' : 'center',
          marginTop: isMobile ? '0.5rem' : '0'
        }}>
          {products ? `${products.length} products` : 'Loading...'}
        </div>
      </div>

      {/* Products Table/Cards */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {products && products.length > 0 ? (
          isMobile ? (
            // Mobile Card Layout
            <div style={{ padding: '1rem' }}>
              {products.map((product) => (
                <div key={product._id} style={{
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  padding: '1rem',
                  marginBottom: '1rem',
                  backgroundColor: '#FAFAFA'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '0.5rem'
                  }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#111827',
                        margin: '0 0 0.25rem 0'
                      }}>
                        {product.name}
                      </h3>
                      {product.description && (
                        <p style={{
                          fontSize: '12px',
                          color: '#6B7280',
                          margin: '0 0 0.5rem 0',
                          lineHeight: '1.4'
                        }}>
                          {product.description}
                        </p>
                      )}
                    </div>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '10px',
                      fontWeight: '600',
                      backgroundColor: product.isActive ? '#D1FAE5' : '#FEE2E2',
                      color: product.isActive ? '#065F46' : '#991B1B'
                    }}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.5rem',
                    marginBottom: '1rem',
                    fontSize: '12px'
                  }}>
                    <div>
                      <span style={{ color: '#6B7280' }}>Price:</span>
                      <span style={{ fontWeight: '600', marginLeft: '0.25rem' }}>
                        ${product.price.toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: '#6B7280' }}>Stock:</span>
                      <span style={{ fontWeight: '600', marginLeft: '0.25rem' }}>
                        {product.stock}
                      </span>
                    </div>
                    {product.category && (
                      <div>
                        <span style={{ color: '#6B7280' }}>Category:</span>
                        <span style={{ fontWeight: '600', marginLeft: '0.25rem' }}>
                          {product.category}
                        </span>
                      </div>
                    )}
                    {product.sku && (
                      <div>
                        <span style={{ color: '#6B7280' }}>SKU:</span>
                        <span style={{ fontWeight: '600', marginLeft: '0.25rem' }}>
                          {product.sku}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    justifyContent: 'flex-end'
                  }}>
                    <button
                      onClick={() => handleEditProduct(product)}
                      style={{
                        backgroundColor: '#F3F4F6',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        color: '#374151',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E5E7EB'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      style={{
                        backgroundColor: '#FEE2E2',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        color: '#DC2626',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FECACA'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FEE2E2'}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Desktop Table Layout
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse'
              }}>
              <thead>
                <tr style={{
                  backgroundColor: '#F9FAFB',
                  borderBottom: '1px solid #E5E7EB'
                }}>
                  <th style={{
                    padding: '16px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151'
                  }}>Product</th>
                  <th style={{
                    padding: '16px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151'
                  }}>Category</th>
                  <th style={{
                    padding: '16px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151'
                  }}>SKU</th>
                  <th style={{
                    padding: '16px',
                    textAlign: 'right',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151'
                  }}>Price</th>
                  <th style={{
                    padding: '16px',
                    textAlign: 'right',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151'
                  }}>Stock</th>
                  <th style={{
                    padding: '16px',
                    textAlign: 'center',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151'
                  }}>Status</th>
                  <th style={{
                    padding: '16px',
                    textAlign: 'center',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151'
                  }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} style={{
                    borderBottom: '1px solid #F3F4F6',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '16px' }}>
                      <div>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#111827',
                          marginBottom: '4px'
                        }}>
                          {product.name}
                        </div>
                        {product.description && (
                          <div style={{
                            fontSize: '12px',
                            color: '#6B7280',
                            maxWidth: '200px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {product.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#374151' }}>
                      {product.category || '-'}
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#374151' }}>
                      {product.sku || '-'}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right', fontSize: '14px', color: '#111827' }}>
                      ${product.price.toFixed(2)}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right', fontSize: '14px', color: '#111827' }}>
                      {product.stock}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: product.isActive ? '#D1FAE5' : '#FEE2E2',
                        color: product.isActive ? '#065F46' : '#991B1B'
                      }}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button
                          onClick={() => handleEditProduct(product)}
                          style={{
                            backgroundColor: '#F3F4F6',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '6px 8px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            color: '#374151',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E5E7EB'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
                          title="Edit Product"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          style={{
                            backgroundColor: '#FEE2E2',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '6px 8px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            color: '#DC2626',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FECACA'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FEE2E2'}
                          title="Delete Product"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )
        ) : (
          <div style={{
            padding: isMobile ? '2rem 1rem' : '4rem 2rem',
            textAlign: 'center',
            color: '#6B7280'
          }}>
            <div style={{ fontSize: isMobile ? '36px' : '48px', marginBottom: '1rem' }}>📦</div>
            <h3 style={{ 
              fontSize: isMobile ? '16px' : '18px', 
              fontWeight: '600', 
              marginBottom: '0.5rem' 
            }}>
              No products found
            </h3>
            <p style={{ 
              fontSize: isMobile ? '12px' : '14px', 
              marginBottom: '2rem',
              lineHeight: '1.4'
            }}>
              {selectedCategory 
                ? `No products found in the "${selectedCategory}" category.`
                : "Get started by adding your first product or importing from CSV."
              }
            </p>
            <div style={{ 
              display: 'flex', 
              gap: isMobile ? '0.5rem' : '1rem', 
              justifyContent: 'center', 
              flexWrap: 'wrap',
              flexDirection: isMobile ? 'column' : 'row'
            }}>
              <button
                onClick={() => setShowModal(true)}
                style={{
                  backgroundColor: PRIMARY_COLOR,
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: isMobile ? '12px 20px' : '12px 24px',
                  fontSize: isMobile ? '12px' : '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  width: isMobile ? '100%' : 'auto'
                }}
              >
                ➕ Add Product
              </button>
              <button
                onClick={() => setShowCSVModal(true)}
                style={{
                  backgroundColor: '#6B7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: isMobile ? '12px 20px' : '12px 24px',
                  fontSize: isMobile ? '12px' : '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  width: isMobile ? '100%' : 'auto'
                }}
              >
                📁 Import CSV
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showModal && (
        <ProductModal
          product={editingProduct}
          businessId={business._id}
          onClose={handleCloseModal}
        />
      )}

      {showCSVModal && (
        <CSVImportModal
          businessId={business._id}
          onClose={handleCloseCSVModal}
        />
      )}
    </div>
  );
}
