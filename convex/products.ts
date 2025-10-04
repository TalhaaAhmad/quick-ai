import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new product
export const createProduct = mutation({
  args: {
    businessId: v.id("businesses"),
    name: v.string(),
    description: v.optional(v.string()),
    price: v.number(),
    stock: v.number(),
    category: v.optional(v.string()),
    sku: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Check if SKU already exists for this business
    if (args.sku) {
      const existingProduct = await ctx.db
        .query("products")
        .withIndex("by_sku", (q) => q.eq("sku", args.sku))
        .filter((q) => q.eq(q.field("businessId"), args.businessId))
        .first();
      
      if (existingProduct) {
        throw new Error("Product with this SKU already exists");
      }
    }

    const productId = await ctx.db.insert("products", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });

    return productId;
  },
});

// Update an existing product
export const updateProduct = mutation({
  args: {
    productId: v.id("products"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    price: v.optional(v.number()),
    stock: v.optional(v.number()),
    category: v.optional(v.string()),
    sku: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { productId, ...updates } = args;
    
    // Check if SKU already exists for another product in the same business
    if (updates.sku) {
      const product = await ctx.db.get(productId);
      if (!product) {
        throw new Error("Product not found");
      }
      
      const existingProduct = await ctx.db
        .query("products")
        .withIndex("by_sku", (q) => q.eq("sku", updates.sku))
        .filter((q) => 
          q.and(
            q.eq(q.field("businessId"), product.businessId),
            q.neq(q.field("_id"), productId)
          )
        )
        .first();
      
      if (existingProduct) {
        throw new Error("Product with this SKU already exists");
      }
    }

    await ctx.db.patch(productId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return productId;
  },
});

// Delete a product
export const deleteProduct = mutation({
  args: {
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.productId);
    return { success: true };
  },
});

// Get all products for a business
export const getProducts = query({
  args: {
    businessId: v.id("businesses"),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("products")
      .withIndex("by_business", (q) => q.eq("businessId", args.businessId));

    if (args.category) {
      query = ctx.db
        .query("products")
        .withIndex("by_business_and_category", (q) => 
          q.eq("businessId", args.businessId).eq("category", args.category)
        );
    }

    const products = await query.collect();
    return products.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Get a single product by ID
export const getProduct = query({
  args: {
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.productId);
  },
});

// Bulk import products from CSV
export const importProducts = mutation({
  args: {
    businessId: v.id("businesses"),
    products: v.array(v.object({
      name: v.string(),
      description: v.optional(v.string()),
      price: v.number(),
      stock: v.number(),
      category: v.optional(v.string()),
      sku: v.optional(v.string()),
      imageUrl: v.optional(v.string()),
      isActive: v.optional(v.boolean()),
    })),
  },
  handler: async (ctx, args) => {
    console.log('🔄 importProducts called with businessId:', args.businessId);
    console.log('📦 Products to import:', args.products.length);
    
    // Validate businessId exists
    const business = await ctx.db.get(args.businessId);
    if (!business) {
      throw new Error(`Business with ID ${args.businessId} not found`);
    }
    
    const now = Date.now();
    const results = [];
    const errors = [];

    for (const productData of args.products) {
      try {
        // Check if SKU already exists
        if (productData.sku) {
          const existingProduct = await ctx.db
            .query("products")
            .withIndex("by_sku", (q) => q.eq("sku", productData.sku))
            .filter((q) => q.eq(q.field("businessId"), args.businessId))
            .first();
          
          if (existingProduct) {
            errors.push({
              product: productData,
              error: `Product with SKU ${productData.sku} already exists`
            });
            continue;
          }
        }

        const productId = await ctx.db.insert("products", {
          ...productData,
          businessId: args.businessId,
          isActive: productData.isActive ?? true,
          createdAt: now,
          updatedAt: now,
        });

        results.push({ productId, product: productData });
      } catch (error) {
        errors.push({
          product: productData,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return {
      success: results.length,
      errors: errors.length,
      results,
      errorDetails: errors
    };
  },
});

// Get all products (for LangGraph tool usage)
export const getAllProducts = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    return products.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Get product categories for a business
export const getCategories = query({
  args: {
    businessId: v.id("businesses"),
  },
  handler: async (ctx, args) => {
    const products = await ctx.db
      .query("products")
      .withIndex("by_business", (q) => q.eq("businessId", args.businessId))
      .collect();

    const categories = [...new Set(
      products
        .map(p => p.category)
        .filter(c => c && c.trim() !== "")
    )];

    return categories.sort();
  },
});
