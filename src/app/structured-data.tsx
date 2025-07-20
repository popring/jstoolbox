export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "JS Toolbox",
    "description": "Discover the best JavaScript tools and libraries to boost your development efficiency. Comprehensive collection of UI libraries, build tools, testing frameworks, and more.",
    "url": "https://js-toolbox-ten.vercel.app",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://js-toolbox-ten.vercel.app/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "JS Toolbox",
      "url": "https://js-toolbox-ten.vercel.app"
    },
    "mainEntity": {
      "@type": "ItemList",
      "name": "JavaScript Tools and Libraries",
      "description": "A comprehensive collection of JavaScript development tools and libraries",
      "itemListElement": [
        {
          "@type": "SoftwareApplication",
          "name": "UI Libraries",
          "description": "React, Vue, Angular and other UI component libraries",
          "applicationCategory": "DeveloperApplication",
          "operatingSystem": "Web"
        },
        {
          "@type": "SoftwareApplication",
          "name": "Build Tools",
          "description": "Webpack, Vite, Rollup and other build tools",
          "applicationCategory": "DeveloperApplication",
          "operatingSystem": "Web"
        },
        {
          "@type": "SoftwareApplication",
          "name": "Testing Frameworks",
          "description": "Jest, Vitest, Cypress and other testing tools",
          "applicationCategory": "DeveloperApplication",
          "operatingSystem": "Web"
        }
      ]
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
} 