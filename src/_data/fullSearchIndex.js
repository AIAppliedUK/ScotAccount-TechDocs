// Generate comprehensive search index with full document content
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

module.exports = function() {
  const pathPrefix = process.env.ELEVENTY_PATH_PREFIX || "/";
  
  // Helper to add path prefix to URLs
  const prefixUrl = (url) => {
    if (pathPrefix === "/") return url;
    return pathPrefix.replace(/\/$/, '') + url;
  };
  
  // Helper to clean content for search
  const cleanContent = (content) => {
    return content
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks
      .replace(/`[^`]+`/g, '') // Remove inline code
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links to text
      .replace(/[#*_~]/g, '') // Remove markdown formatting
      .replace(/\[\[toc\]\]/gi, '') // Remove TOC markers
      .replace(/<!--[\s\S]*?-->/g, '') // Remove HTML comments
      .replace(/<[^>]+>/g, '') // Remove HTML tags
      .replace(/\n{3,}/g, '\n\n') // Reduce multiple newlines
      .replace(/^\s+|\s+$/g, '') // Trim whitespace
      .toLowerCase(); // Convert to lowercase for better searching
  };
  
  // Read all markdown files from src directory
  const srcDir = path.join(__dirname, '..');
  const pages = [];
  
  // Define the pages and their files
  const pageFiles = [
    { file: 'index.md', url: '/', title: 'Home' },
    { file: 'getting-started.md', url: '/getting-started/', title: 'Getting Started' },
    { file: 'architecture.md', url: '/architecture/', title: 'Architecture' },
    { file: 'scotaccount-guide.md', url: '/scotaccount-guide/', title: 'Implementation Guide' },
    { file: 'scotaccount-complete-guide.md', url: '/scotaccount-complete-guide/', title: 'Comprehensive Guide' },
    { file: 'scotaccount-token-validation-module.md', url: '/scotaccount-token-validation-module/', title: 'Token Validation Module' },
    { file: 'integration-examples.md', url: '/integration-examples/', title: 'Integration Examples' },
    { file: 'scotaccount-modular-structure.md', url: '/scotaccount-modular-structure/', title: 'Modular Structure' }
  ];
  
  pageFiles.forEach(page => {
    const filePath = path.join(srcDir, page.file);
    
    try {
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data, content } = matter(fileContent);
        
        // Use frontmatter title if available, otherwise use default
        const title = data.title || page.title;
        
        // Clean and prepare content for search
        const cleanedContent = cleanContent(content);
        
        // Extract first 200 characters for summary
        const summary = cleanedContent.substring(0, 200) + '...';
        
        pages.push({
          title: title,
          url: prefixUrl(page.url),
          content: cleanedContent,
          summary: summary,
          // Add keywords from headers
          keywords: content.match(/^#{1,3}\s+(.+)$/gm)?.map(h => h.replace(/^#+\s+/, '').toLowerCase()).join(' ') || ''
        });
      }
    } catch (error) {
      console.error(`Error processing ${page.file}:`, error);
    }
  });
  
  return { pages };
};