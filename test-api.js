// Simple test to verify API is working
import { getArticles, getArticlesWithSpecificPopulate, getStrapiMediaURL } from './src/lib/api.js';

async function testAPI() {
  console.log('Testing Strapi API...');
  
  try {
    // Test basic articles fetch with populate=*
    console.log('\n1. Fetching articles with populate=*...');
    const articles = await getArticles({ pagination: { page: 1, pageSize: 2 } });
    console.log('Articles found:', articles.data?.length || 0);
    
    if (articles.data?.length > 0) {
      const firstArticle = articles.data[0];
      console.log('First article title:', firstArticle.title);
      console.log('Has cover image:', !!firstArticle.cover);
      
      if (firstArticle.cover?.url) {
        const imageUrl = getStrapiMediaURL(firstArticle.cover.url);
        console.log('Image URL:', imageUrl);
      }
    }
    
    // Test specific populate format
    console.log('\n2. Testing populate[field]=* format...');
    const specificArticles = await getArticlesWithSpecificPopulate({ 
      pagination: { page: 1, pageSize: 1 } 
    });
    console.log('Specific populate articles found:', specificArticles.data?.length || 0);
    
    if (specificArticles.data?.length > 0) {
      const article = specificArticles.data[0];
      console.log('Article with specific populate - title:', article.title);
      console.log('Has cover:', !!article.cover);
      console.log('Has author:', !!article.author);
      console.log('Has category:', !!article.category);
    }
    
    console.log('\n✅ API test completed successfully!');
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
  }
}

testAPI();
