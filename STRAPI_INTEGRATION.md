# Strapi Integration Setup

This Next.js frontend is now integrated with Strapi CMS to pull article data and display images.

## Setup Instructions

### 1. Start Strapi CMS

First, make sure your Strapi CMS is running:

```bash
cd /Users/songsak/Desktop/Blue/cms
npm run develop
```

Strapi will be available at: http://localhost:1337

### 2. Configure Environment Variables

Create a `.env.local` file in the news-web directory:

```bash
# Strapi Configuration
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_STRAPI_API_TOKEN=
```

### 3. Set Up Strapi Content

1. Go to http://localhost:1337/admin
2. Create an admin account if you haven't already
3. Go to Content Manager > Articles
4. Create some articles with cover images
5. Make sure articles are published (not in draft mode)

### 4. Configure Strapi for Public Access

In Strapi admin panel:
1. Go to Settings > Users & Permissions Plugin > Roles
2. Click on "Public" role
3. Under "Article", enable:
   - find
   - findOne
4. Under "Category", enable:
   - find
   - findOne
5. Under "Author", enable:
   - find
   - findOne
6. Under "Upload", enable:
   - find
   - findOne

### 5. Start the Frontend

```bash
cd /Users/songsak/Desktop/Blue/news-web
npm run dev
```

## Features Implemented

### ✅ Banner with Article Images
- Displays the first article's cover image as banner background
- Falls back to gradient if no image is available
- Shows article title and description in banner

### ✅ Dynamic Article Display
- Fetches articles from Strapi API
- Displays article cover images
- Shows article metadata (category, author)
- Loading states and error handling

### ✅ Search Functionality
- Real-time search through Strapi articles
- Searches title, description, and tags
- Debounced search for performance

### ✅ Responsive Design
- All components work on mobile and desktop
- Proper image handling and fallbacks

## API Endpoints Used

- `GET /api/articles` - Fetch all articles
- `GET /api/articles?filters[title][$containsi]=query` - Search articles
- `GET /api/categories` - Fetch categories
- `GET /api/authors` - Fetch authors

## File Structure

```
src/
├── components/
│   ├── Banner.js (updated with image support)
│   ├── SearchInput.js
│   ├── SortBox.js
│   └── SearchAndSort.js
├── lib/
│   └── api.js (Strapi API client)
├── hooks/
│   └── useArticles.js (React hooks for data fetching)
├── config/
│   └── strapi.js (Strapi configuration)
└── app/
    └── page.js (main page with Strapi integration)
```

## Troubleshooting

### Articles not loading?
- Check if Strapi is running on http://localhost:1337
- Verify public permissions are set correctly
- Check browser console for API errors

### Images not showing?
- Make sure articles have cover images uploaded
- Check if images are published (not in draft)
- Verify upload permissions in Strapi

### Search not working?
- Check if articles have content in title, description, or tags
- Verify search permissions in Strapi
- Check network tab for API calls
