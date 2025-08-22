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
  
  // Helper to extract sections with their headings
  const extractSections = (content) => {
    const sections = [];
    const lines = content.split('\n');
    let currentSection = { heading: '', id: '', content: '', level: 0 };
    
    lines.forEach(line => {
      // Check for markdown headings
      const headingMatch = line.match(/^(#{2,4})\s+(.+)$/);
      if (headingMatch) {
        // Save previous section if it has content
        if (currentSection.content) {
          sections.push({...currentSection});
        }
        // Start new section
        const level = headingMatch[1].length;
        const heading = headingMatch[2];
        // Generate ID similar to markdown-it-anchor
        const id = heading.toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/^-+|-+$/g, '');
        currentSection = { heading, id, content: '', level };
      } else {
        // Add content to current section
        currentSection.content += line + '\n';
      }
    });
    
    // Don't forget the last section
    if (currentSection.content) {
      sections.push(currentSection);
    }
    
    return sections;
  };
  
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
        
        // Extract sections for deep linking
        const sections = extractSections(content);
        
        pages.push({
          title: title,
          url: prefixUrl(page.url),
          content: cleanedContent,
          summary: summary,
          // Add keywords from headers
          keywords: content.match(/^#{1,3}\s+(.+)$/gm)?.map(h => h.replace(/^#+\s+/, '').toLowerCase()).join(' ') || '',
          // Add sections for deep linking
          sections: sections.map(s => ({
            heading: s.heading,
            id: s.id,
            content: cleanContent(s.content)
          }))
        });
      }
    } catch (error) {
      console.error(`Error processing ${page.file}:`, error);
    }
  });
  
  return { pages };
};