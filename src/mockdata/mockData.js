// Mock data for fallback when CMS is not available
export const mockArticles = [
  {
    id: 1,
    attributes: {
      title: "Welcome to Our News Platform",
      slug: "welcome-to-our-news-platform",
      description: "This is a demo article to showcase our news platform capabilities when the CMS is not available.",
      content: "This is a sample article content. In a real scenario, this would be loaded from your CMS. The platform is designed to work seamlessly with Strapi CMS, but also provides fallback content when the CMS is offline.",
      publishedAt: new Date().toISOString(),
      locale: "en",
      cover: {
        data: {
          attributes: {
            url: "/images/demo_logo.png",
            alternativeText: "Demo article cover"
          }
        }
      },
      category: {
        data: {
          attributes: {
            name: "Technology",
            slug: "technology"
          }
        }
      },
      author: {
        data: {
          attributes: {
            name: "Demo Author",
            slug: "demo-author"
          }
        }
      },
      tags: [
        { name: "demo", slug: "demo" },
        { name: "news", slug: "news" }
      ]
    }
  },
  {
    id: 2,
    attributes: {
      title: "Getting Started with Content Management",
      slug: "getting-started-with-content-management",
      description: "Learn how to manage your content effectively using our CMS integration.",
      content: "Content management is crucial for any modern website. This article explains the basics of setting up and using a CMS for your content needs.",
      publishedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      locale: "en",
      cover: {
        data: {
          attributes: {
            url: "/images/demo_logo.png",
            alternativeText: "Content management guide"
          }
        }
      },
      category: {
        data: {
          attributes: {
            name: "Tutorial",
            slug: "tutorial"
          }
        }
      },
      author: {
        data: {
          attributes: {
            name: "Content Manager",
            slug: "content-manager"
          }
        }
      },
      tags: [
        { name: "tutorial", slug: "tutorial" },
        { name: "cms", slug: "cms" }
      ]
    }
  },
  {
    id: 3,
    attributes: {
      title: "Building Responsive Websites",
      slug: "building-responsive-websites",
      description: "Best practices for creating websites that work on all devices.",
      content: "Responsive design is essential in today's multi-device world. Learn the key principles and techniques for building websites that adapt to different screen sizes.",
      publishedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      locale: "en",
      cover: {
        data: {
          attributes: {
            url: "/images/demo_logo.png",
            alternativeText: "Responsive design"
          }
        }
      },
      category: {
        data: {
          attributes: {
            name: "Web Development",
            slug: "web-development"
          }
        }
      },
      author: {
        data: {
          attributes: {
            name: "Web Developer",
            slug: "web-developer"
          }
        }
      },
      tags: [
        { name: "responsive", slug: "responsive" },
        { name: "web-design", slug: "web-design" }
      ]
    }
  }
];

export const mockCategories = [
  {
    id: 1,
    attributes: {
      name: "Technology",
      slug: "technology",
      locale: "en"
    }
  },
  {
    id: 2,
    attributes: {
      name: "Tutorial",
      slug: "tutorial",
      locale: "en"
    }
  },
  {
    id: 3,
    attributes: {
      name: "Web Development",
      slug: "web-development",
      locale: "en"
    }
  }
];

export const mockHomeData = {
  id: 1,
  attributes: {
    title: "Welcome to Our Platform",
    subtitle: "Your trusted source for news and information",
    description: "This is a demo homepage. In a real scenario, this content would be managed through your CMS.",
    locale: "en",
    banners: [
      {
        id: 1,
        title: "Featured Article",
        description: "Check out our latest featured content",
        image: {
          url: "/images/demo_logo.png",
          alternativeText: "Featured banner"
        }
      }
    ],
    homeDetails: [
      {
        id: 1,
        title: "About Us",
        description: "We provide quality content and news updates.",
        icon: "info"
      }
    ],
    homeImg: {
      url: "/images/demo_logo.png",
      alternativeText: "Homepage image"
    }
  }
};

// Helper function to create API response format
export const createMockResponse = (data, pagination = null) => ({
  data,
  meta: {
    pagination: pagination || {
      page: 1,
      pageSize: 10,
      pageCount: 1,
      total: data.length
    }
  }
});