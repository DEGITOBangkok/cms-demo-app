// Test sort functionality
import { getArticles } from './src/lib/api.js';

async function testSort() {
  console.log('Testing Sort Functionality...');
  
  const sortTests = [
    { value: 'newest', expected: 'publishedAt:desc' },
    { value: 'oldest', expected: 'publishedAt:asc' },
    { value: 'title-asc', expected: 'title:asc' },
    { value: 'title-desc', expected: 'title:desc' },
    { value: 'popular', expected: 'publishedAt:desc' }
  ];

  for (const test of sortTests) {
    console.log(`\nTesting sort: ${test.value}`);
    
    try {
      // Convert sort value to Strapi sort format
      let strapiSort = 'publishedAt:desc';
      switch (test.value) {
        case 'newest':
          strapiSort = 'publishedAt:desc';
          break;
        case 'oldest':
          strapiSort = 'publishedAt:asc';
          break;
        case 'title-asc':
          strapiSort = 'title:asc';
          break;
        case 'title-desc':
          strapiSort = 'title:desc';
          break;
        case 'popular':
          strapiSort = 'publishedAt:desc';
          break;
        default:
          strapiSort = 'publishedAt:desc';
      }

      const articles = await getArticles({
        sort: strapiSort,
        pagination: { page: 1, pageSize: 3 }
      });

      console.log(`✅ ${test.value} -> ${strapiSort}`);
      console.log(`   Found ${articles.data?.length || 0} articles`);
      
      if (articles.data?.length > 0) {
        console.log(`   First article: ${articles.data[0].title}`);
        console.log(`   Published: ${articles.data[0].publishedAt}`);
      }

    } catch (error) {
      console.error(`❌ ${test.value} failed:`, error.message);
    }
  }
  
  console.log('\n✅ Sort testing completed!');
}

testSort();
