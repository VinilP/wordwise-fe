import { test, expect, Page } from '@playwright/test';

interface PerformanceMetrics {
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
  totalBlockingTime: number;
  speedIndex: number;
  timeToInteractive: number;
}

class PerformanceTester {
  async measurePagePerformance(page: Page, url: string): Promise<PerformanceMetrics> {
    await page.goto(url);
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Wait a bit more for metrics to be collected
    await page.waitForTimeout(2000);
    
    // Measure Core Web Vitals
    const metrics = await page.evaluate(() => {
      return new Promise<PerformanceMetrics>((resolve) => {
        const collectedMetrics: Partial<PerformanceMetrics> = {
          firstContentfulPaint: 0,
          largestContentfulPaint: 0,
          firstInputDelay: 0,
          cumulativeLayoutShift: 0,
          totalBlockingTime: 0,
          speedIndex: 0,
          timeToInteractive: 0,
        };
        
        // Try to get metrics from performance API
        try {
          const paintEntries = performance.getEntriesByType('paint');
          const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
          if (fcpEntry) {
            collectedMetrics.firstContentfulPaint = fcpEntry.startTime;
          }
          
          const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
          if (lcpEntries.length > 0) {
            collectedMetrics.largestContentfulPaint = lcpEntries[lcpEntries.length - 1].startTime;
          }
          
          const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          if (navigationEntry) {
            collectedMetrics.totalBlockingTime = Math.max(0, navigationEntry.loadEventEnd - navigationEntry.domContentLoadedEventEnd);
            collectedMetrics.timeToInteractive = navigationEntry.loadEventEnd - navigationEntry.fetchStart;
          }
          
          // Use PerformanceObserver for metrics that might not be available yet
          if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
              const entries = list.getEntries();
              
              entries.forEach((entry) => {
                if (entry.entryType === 'first-input') {
                  collectedMetrics.firstInputDelay = Math.max(0, (entry as any).processingStart - entry.startTime);
                } else if (entry.entryType === 'layout-shift') {
                  if (!(entry as any).hadRecentInput) {
                    collectedMetrics.cumulativeLayoutShift = (collectedMetrics.cumulativeLayoutShift || 0) + (entry as any).value;
                  }
                }
              });
            });
            
            observer.observe({ entryTypes: ['first-input', 'layout-shift'] });
          }
        } catch (error) {
          console.warn('Performance metrics collection failed:', error);
        }
        
        // Resolve with collected metrics after a short delay
        setTimeout(() => {
          resolve(collectedMetrics as PerformanceMetrics);
        }, 1000);
      });
    });
    
    return metrics;
  }

  async measureAPIResponseTime(page: Page, endpoint: string): Promise<number> {
    const startTime = Date.now();
    
    try {
      const response = await page.request.get(endpoint);
      const endTime = Date.now();
      
      expect(response.status()).toBe(200);
      return endTime - startTime;
    } catch (error) {
      throw new Error(`API request failed: ${error}`);
    }
  }

  async measureBundleSize(page: Page): Promise<{ jsSize: number; cssSize: number; totalSize: number }> {
    const resources = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      let jsSize = 0;
      let cssSize = 0;
      
      resources.forEach((resource) => {
        if (resource.name.includes('.js')) {
          jsSize += resource.transferSize || 0;
        } else if (resource.name.includes('.css')) {
          cssSize += resource.transferSize || 0;
        }
      });
      
      return { jsSize, cssSize, totalSize: jsSize + cssSize };
    });
    
    return resources;
  }
}

test.describe('Performance Testing Suite', () => {
  let performanceTester: PerformanceTester;
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    performanceTester = new PerformanceTester();
    page = await browser.newPage();
    
    // Enable performance monitoring
    await page.addInitScript(() => {
      // Enable performance observer
      if ('PerformanceObserver' in window) {
        window.performance.mark('test-start');
      }
    });
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('Homepage Performance Test', async () => {
    const metrics = await performanceTester.measurePagePerformance(page, '/');
    
    // Core Web Vitals thresholds
    expect(metrics.firstContentfulPaint).toBeLessThan(2000); // < 2s
    expect(metrics.largestContentfulPaint).toBeLessThan(4000); // < 4s
    expect(metrics.firstInputDelay).toBeLessThan(100); // < 100ms
    expect(metrics.cumulativeLayoutShift).toBeLessThan(0.1); // < 0.1
    
    // Additional performance metrics
    expect(metrics.totalBlockingTime).toBeLessThan(300); // < 300ms
    expect(metrics.timeToInteractive).toBeLessThan(5000); // < 5s
    
    console.log('Homepage Performance Metrics:', metrics);
  });

  test('Books Page Performance Test', async () => {
    const metrics = await performanceTester.measurePagePerformance(page, '/books');
    
    // Core Web Vitals thresholds
    expect(metrics.firstContentfulPaint).toBeLessThan(2500);
    expect(metrics.largestContentfulPaint).toBeLessThan(5000);
    expect(metrics.firstInputDelay).toBeLessThan(100);
    expect(metrics.cumulativeLayoutShift).toBeLessThan(0.1);
    
    console.log('Books Page Performance Metrics:', metrics);
  });

  test('Book Detail Page Performance Test', async () => {
    // Navigate to a book detail page
    await page.goto('/books/test-book-id');
    await page.waitForLoadState('networkidle');
    
    const metrics = await performanceTester.measurePagePerformance(page, '/books/test-book-id');
    
    // Book detail pages can be slower due to content
    expect(metrics.firstContentfulPaint).toBeLessThan(3000);
    expect(metrics.largestContentfulPaint).toBeLessThan(6000);
    expect(metrics.firstInputDelay).toBeLessThan(150);
    expect(metrics.cumulativeLayoutShift).toBeLessThan(0.15);
    
    console.log('Book Detail Page Performance Metrics:', metrics);
  });

  test('API Response Time Test', async () => {
    const baseURL = process.env.API_BASE_URL || 'http://localhost:3000';
    
    // Test multiple API endpoints
    const endpoints = [
      '/api/v1/books',
      '/api/v1/books/search?q=test',
      '/api/v1/popular-books',
    ];
    
    const responseTimes: number[] = [];
    
    for (const endpoint of endpoints) {
      const responseTime = await performanceTester.measureAPIResponseTime(page, `${baseURL}${endpoint}`);
      responseTimes.push(responseTime);
      
      // Individual endpoint assertions
      expect(responseTime).toBeLessThan(2000); // < 2s per API call
    }
    
    // Calculate average response time
    const averageResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    expect(averageResponseTime).toBeLessThan(1500); // < 1.5s average
    
    console.log('API Response Times:', {
      endpoints,
      responseTimes,
      average: averageResponseTime,
    });
  });

  test('Bundle Size Analysis', async () => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const bundleSizes = await performanceTester.measureBundleSize(page);
    
    // Bundle size thresholds (in bytes) - more realistic for a React app
    expect(bundleSizes.jsSize).toBeLessThan(2000000); // < 2MB JS
    expect(bundleSizes.cssSize).toBeLessThan(200000); // < 200KB CSS
    expect(bundleSizes.totalSize).toBeLessThan(2200000); // < 2.2MB total
    
    console.log('Bundle Size Analysis:', {
      jsSize: `${(bundleSizes.jsSize / 1024).toFixed(2)}KB`,
      cssSize: `${(bundleSizes.cssSize / 1024).toFixed(2)}KB`,
      totalSize: `${(bundleSizes.totalSize / 1024).toFixed(2)}KB`,
    });
  });

  test('Memory Usage Test', async () => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Measure initial memory usage
    const initialMemory = await page.evaluate(() => {
      return (performance as any).memory ? {
        usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
        totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
        jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
      } : null;
    });
    
    // Perform memory-intensive operations
    for (let i = 0; i < 10; i++) {
      await page.click('[data-testid="search-button"]');
      await page.fill('[data-testid="search-input"]', `search term ${i}`);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(100);
    }
    
    // Measure memory usage after operations
    const finalMemory = await page.evaluate(() => {
      return (performance as any).memory ? {
        usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
        totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
        jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
      } : null;
    });
    
    if (initialMemory && finalMemory) {
      const memoryIncrease = finalMemory.usedJSHeapSize - initialMemory.usedJSHeapSize;
      const memoryIncreasePercent = (memoryIncrease / initialMemory.usedJSHeapSize) * 100;
      
      // Memory usage should not increase by more than 50%
      expect(memoryIncreasePercent).toBeLessThan(50);
      
      console.log('Memory Usage Analysis:', {
        initial: `${(initialMemory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
        final: `${(finalMemory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
        increase: `${memoryIncreasePercent.toFixed(2)}%`,
      });
    }
  });

  test('Image Loading Performance Test', async () => {
    await page.goto('/books');
    await page.waitForLoadState('networkidle');
    
    // Measure image loading performance
    const imageMetrics = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'));
      const imageLoadTimes: number[] = [];
      
      images.forEach((img) => {
        const loadTime = performance.now();
        img.addEventListener('load', () => {
          imageLoadTimes.push(performance.now() - loadTime);
        });
      });
      
      return imageLoadTimes;
    });
    
    // Wait for images to load
    await page.waitForTimeout(3000);
    
    const finalImageMetrics = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'));
      return images.map((img) => ({
        src: img.src,
        loaded: img.complete,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
      }));
    });
    
    // All images should be loaded
    const loadedImages = finalImageMetrics.filter(img => img.loaded);
    expect(loadedImages.length).toBe(finalImageMetrics.length);
    
    console.log('Image Loading Performance:', {
      totalImages: finalImageMetrics.length,
      loadedImages: loadedImages.length,
      loadSuccessRate: (loadedImages.length / finalImageMetrics.length) * 100,
    });
  });

  test('Search Performance Test', async () => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const searchTerms = ['fiction', 'mystery', 'romance', 'sci-fi', 'fantasy'];
    const searchTimes: number[] = [];
    
    for (const term of searchTerms) {
      const startTime = performance.now();
      
      await page.fill('[data-testid="search-input"]', term);
      await page.click('[data-testid="search-button"]');
      await page.waitForSelector('[data-testid="book-card"]', { timeout: 5000 });
      
      const endTime = performance.now();
      searchTimes.push(endTime - startTime);
      
      // Each search should complete within 2 seconds
      expect(endTime - startTime).toBeLessThan(2000);
    }
    
    const averageSearchTime = searchTimes.reduce((a, b) => a + b, 0) / searchTimes.length;
    expect(averageSearchTime).toBeLessThan(1500); // Average search time < 1.5s
    
    console.log('Search Performance:', {
      searchTerms,
      searchTimes,
      average: averageSearchTime,
    });
  });

  test('Mobile Performance Test', async () => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const metrics = await performanceTester.measurePagePerformance(page, '/');
    
    // Mobile performance thresholds (slightly more lenient)
    expect(metrics.firstContentfulPaint).toBeLessThan(3000);
    expect(metrics.largestContentfulPaint).toBeLessThan(6000);
    expect(metrics.firstInputDelay).toBeLessThan(150);
    expect(metrics.cumulativeLayoutShift).toBeLessThan(0.15);
    
    console.log('Mobile Performance Metrics:', metrics);
  });

  test('Concurrent User Performance Test', async ({ browser }) => {
    // Simulate multiple concurrent users
    const userCount = 5;
    const pages: Page[] = [];
    
    // Create multiple browser contexts
    for (let i = 0; i < userCount; i++) {
      const context = await browser.newContext();
      const newPage = await context.newPage();
      pages.push(newPage);
    }
    
    // Navigate all pages simultaneously
    const navigationPromises = pages.map(page => page.goto('/'));
    await Promise.all(navigationPromises);
    
    // Measure performance across all pages
    const performancePromises = pages.map(page => 
      performanceTester.measurePagePerformance(page, '/')
    );
    const allMetrics = await Promise.all(performancePromises);
    
    // Calculate average metrics
    const averageMetrics = allMetrics.reduce((acc, metrics) => {
      acc.firstContentfulPaint += metrics.firstContentfulPaint;
      acc.largestContentfulPaint += metrics.largestContentfulPaint;
      acc.firstInputDelay += metrics.firstInputDelay;
      acc.cumulativeLayoutShift += metrics.cumulativeLayoutShift;
      acc.totalBlockingTime += metrics.totalBlockingTime;
      acc.timeToInteractive += metrics.timeToInteractive;
      return acc;
    }, {
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      firstInputDelay: 0,
      cumulativeLayoutShift: 0,
      totalBlockingTime: 0,
      timeToInteractive: 0,
    });
    
    // Average the metrics
    Object.keys(averageMetrics).forEach(key => {
      averageMetrics[key] /= userCount;
    });
    
    // Performance should not degrade significantly with concurrent users
    expect(averageMetrics.firstContentfulPaint).toBeLessThan(3000);
    expect(averageMetrics.largestContentfulPaint).toBeLessThan(6000);
    expect(averageMetrics.firstInputDelay).toBeLessThan(200);
    
    console.log('Concurrent User Performance:', {
      userCount,
      averageMetrics,
    });
    
    // Clean up
    await Promise.all(pages.map(page => page.close()));
  });
});