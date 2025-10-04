import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Sign up a new user and create business
export const signUp = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    ownerName: v.string(),
    businessName: v.string(),
    businessDescription: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Create user
    const userId = await ctx.db.insert("users", {
      email: args.email,
      password: args.password, // TODO: Hash password in production
      name: args.ownerName,
      createdAt: Date.now(),
      lastLoginAt: Date.now(),
    });

    // Create business
    const businessId = await ctx.db.insert("businesses", {
      ownerName: args.ownerName,
      email: args.email,
      ownerId: userId,
      businessName: args.businessName,
      businessDescription: args.businessDescription,
      whatsappIntegrated: false,
      createdAt: Date.now(),
      roles: ["businessOwner"],
      settings: {
        notifications: true,
        language: "en",
      },
      lastLoginAt: Date.now(),
    });

    // Update user with businessId
    await ctx.db.patch(userId, {
      businessId: businessId,
    });

    return { userId, businessId };
  },
});

// Sign in a user or create one if they don't exist (for demo purposes)
export const signIn = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // Find user by email
    let user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    // If user doesn't exist, create a demo user and business
    if (!user) {
      // Validate email format
      if (!args.email.includes('@')) {
        throw new Error("Please enter a valid email address");
      }

      // Create user
      const userId = await ctx.db.insert("users", {
        email: args.email,
        password: args.password, // TODO: Hash password in production
        name: args.email.split('@')[0], // Use email prefix as name
        createdAt: Date.now(),
        lastLoginAt: Date.now(),
      });

      // Create business for the user
      const businessId = await ctx.db.insert("businesses", {
        ownerName: args.email.split('@')[0],
        email: args.email,
        ownerId: userId,
        businessName: `${args.email.split('@')[0]}'s Business`,
        businessDescription: "Demo business created for QuickAI",
        whatsappIntegrated: false,
        createdAt: Date.now(),
        roles: ["businessOwner"],
        settings: {
          notifications: true,
          language: "en",
        },
        lastLoginAt: Date.now(),
      });

      // Update user with businessId
      await ctx.db.patch(userId, {
        businessId: businessId,
      });

      return { 
        userId: userId, 
        businessId: businessId,
        businessName: `${args.email.split('@')[0]}'s Business`,
        email: args.email,
        ownerName: args.email.split('@')[0]
      };
    }

    // TODO: Verify password hash in production
    if (user.password !== args.password) {
      throw new Error("Invalid password");
    }

    // Update last login time
    await ctx.db.patch(user._id, {
      lastLoginAt: Date.now(),
    });

    // Update business last login time if business exists and get business name
    let businessName = null;
    if (user.businessId) {
      await ctx.db.patch(user.businessId, {
        lastLoginAt: Date.now(),
      });
      
      // Fetch business information to get the business name
      const business = await ctx.db.get(user.businessId);
      businessName = business?.businessName || null;
    }

    return { 
      userId: user._id, 
      businessId: user.businessId,
      businessName: businessName,
      email: user.email,
      ownerName: user.name
    };
  },
});

// Get user by email
export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

// Get business by owner ID
export const getBusinessByOwnerId = query({
  args: { ownerId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("businesses")
      .withIndex("by_ownerId", (q) => q.eq("ownerId", args.ownerId))
      .first();
  },
});

// Get business by ID
export const getBusiness = query({
  args: { businessId: v.id("businesses") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.businessId);
  },
});

// Update business information
export const updateBusiness = mutation({
  args: {
    businessId: v.id("businesses"),
    businessName: v.string(),
    businessDescription: v.string(),
    whatsappToken: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.businessId, {
      businessName: args.businessName,
      businessDescription: args.businessDescription,
      whatsappToken: args.whatsappToken,
      whatsappIntegrated: args.whatsappToken ? true : false,
    });
    
    return { success: true };
  },
});

// Logout (placeholder - in a real app you'd handle session management)
export const logout = mutation({
  args: {},
  handler: async (ctx) => {
    // In a real application, you would:
    // 1. Invalidate the session token
    // 2. Clear any cached user data
    // 3. Update last logout time
    console.log("User logged out");
    return { success: true };
  },
});
