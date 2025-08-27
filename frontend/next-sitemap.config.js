// next-sitemap.config.js

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  // Replace with your actual, live production domain
  siteUrl: process.env.SITE_URL || 'https://prajaseva.ai',
  
  // This will create a `robots.txt` file that allows all search engines
  // and points them to your sitemap.
  generateRobotsTxt: true, 
  
  // (Optional) You can add more advanced configurations here if needed
  // For example, to exclude certain pages from the sitemap:
  // exclude: ['/dashboard/*', '/profile', '/settings'],
};
