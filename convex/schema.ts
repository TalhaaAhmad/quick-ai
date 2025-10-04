import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  businesses: defineTable({
    ownerName: v.string(),
    email: v.string(),
    ownerId: v.string(),
    businessName: v.string(),
    businessDescription: v.string(),
    whatsappIntegrated: v.boolean(),
    whatsappToken: v.optional(v.string()),
    createdAt: v.number(),
    roles: v.array(v.string()),
    settings: v.object({
      notifications: v.boolean(),
      language: v.string(),
    }),
    lastLoginAt: v.number(),
  }).index("by_email", ["email"])
    .index("by_ownerId", ["ownerId"]),

  users: defineTable({
    email: v.string(),
    password: v.string(), // In production, this should be hashed
    name: v.string(),
    businessId: v.optional(v.id("businesses")),
    createdAt: v.number(),
    lastLoginAt: v.number(),
  }).index("by_email", ["email"]),

  products: defineTable({
    businessId: v.id("businesses"),
    name: v.string(),
    description: v.optional(v.string()),
    price: v.number(),
    stock: v.number(),
    category: v.optional(v.string()),
    sku: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_business", ["businessId"])
    .index("by_business_and_category", ["businessId", "category"])
    .index("by_sku", ["sku"]),

  orders: defineTable({
    businessId: v.id("businesses"),
    orderNumber: v.string(),
    customerName: v.string(),
    customerEmail: v.optional(v.string()),
    customerPhone: v.optional(v.string()),
    shippingAddress: v.object({
      street: v.string(),
      city: v.string(),
      state: v.string(),
      zipCode: v.string(),
      country: v.string(),
    }),
    status: v.string(), // pending, confirmed, processing, shipped, delivered, cancelled
    paymentStatus: v.string(), // pending, paid, failed, refunded
    paymentMethod: v.optional(v.string()),
    subtotal: v.number(),
    shippingCost: v.number(),
    tax: v.number(),
    total: v.number(),
    notes: v.optional(v.string()),
    trackingNumber: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_business", ["businessId"])
    .index("by_business_and_status", ["businessId", "status"])
    .index("by_order_number", ["orderNumber"]),

  orderItems: defineTable({
    orderId: v.id("orders"),
    productId: v.id("products"),
    productName: v.string(),
    productSku: v.optional(v.string()),
    quantity: v.number(),
    unitPrice: v.number(),
    totalPrice: v.number(),
    createdAt: v.number(),
  }).index("by_order", ["orderId"])
    .index("by_product", ["productId"]),
});
