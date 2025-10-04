# Convex Setup Instructions

## 1. Create a Convex Deployment

1. Go to [convex.dev](https://convex.dev) and sign up
2. Create a new project
3. Get your deployment URL

## 2. Environment Variables

Create a `.env.local` file in your project root with:

```
NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url_here
```

## 3. Deploy Convex Functions

Run these commands to deploy your Convex backend:

```bash
npx convex dev
```

This will:
- Generate the Convex API types
- Deploy your functions to Convex
- Start watching for changes

## 4. Authentication

The current setup uses a simple authentication system:
- Sign up creates a new business in Convex
- Login checks if business exists and updates last login time
- User data is stored in localStorage for session management

## 5. Access Dashboard

1. Go to `/auth` to sign up or login
2. After successful authentication, you'll be redirected to `/dashboard`
3. The dashboard will show your business information from Convex

## Next Steps

For production, consider:
- Adding proper password authentication
- Implementing JWT tokens
- Adding route protection
- Setting up proper user sessions
