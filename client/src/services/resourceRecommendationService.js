import { resourceService } from '../modules/resource-management/services/resourceService';

class ResourceRecommendationService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  // Get cache key for recommendations
  getCacheKey(subject, groupSize, keywords = []) {
    return `${subject}_${groupSize}_${keywords.sort().join('_')}`;
  }

  // Check if cache is valid
  isCacheValid(cacheKey) {
    const cached = this.cache.get(cacheKey);
    return cached && Date.now() - cached.timestamp < this.cacheTimeout;
  }

  // Get recommended resources for a group
  async getRecommendedResources(groupData) {
    const { subject, capacity: groupSize, description } = groupData;
    const keywords = this.extractKeywords(description);
    const cacheKey = this.getCacheKey(subject, groupSize, keywords);

    // Return cached recommendations if valid
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey).recommendations;
    }

    try {
      // Fetch all resources
      const response = await resourceService.getResources();
      const allResources = response.resources || [];

      // Filter and score resources
      const recommendations = this.scoreAndFilterResources(
        allResources,
        subject,
        groupSize,
        keywords
      );

      // Cache the results
      this.cache.set(cacheKey, {
        recommendations,
        timestamp: Date.now()
      });

      return recommendations;
    } catch (error) {
      console.error('Error fetching resource recommendations:', error);
      return [];
    }
  }

  // Extract keywords from group description
  extractKeywords(description) {
    if (!description) return [];
    
    const commonKeywords = [
      'exam', 'study', 'tutorial', 'practice', 'notes', 'guide',
      'assignment', 'project', 'presentation', 'homework', 'quiz',
      'test', 'review', 'summary', 'introduction', 'basics', 'advanced'
    ];

    const words = description.toLowerCase().split(/\s+/);
    return words.filter(word => 
      commonKeywords.includes(word) || 
      word.length > 4 // Include longer words as potential keywords
    );
  }

  // Score and filter resources based on relevance
  scoreAndFilterResources(resources, subject, groupSize, keywords) {
    const scoredResources = resources.map(resource => {
      let score = 0;

      // Subject matching (highest weight)
      if (resource.subject?.toLowerCase() === subject?.toLowerCase()) {
        score += 50;
      } else if (resource.subject?.toLowerCase().includes(subject?.toLowerCase())) {
        score += 25;
      }

      // Title/description keyword matching
      const searchText = `${resource.title} ${resource.description}`.toLowerCase();
      keywords.forEach(keyword => {
        if (searchText.includes(keyword.toLowerCase())) {
          score += 10;
        }
      });

      // Group size appropriateness
      if (resource.tags) {
        if (groupSize <= 3 && resource.tags.includes('individual')) {
          score += 15;
        } else if (groupSize <= 10 && resource.tags.includes('small-group')) {
          score += 15;
        } else if (groupSize > 10 && resource.tags.includes('large-group')) {
          score += 15;
        }
      }

      // Resource type bonus for collaborative work
      if (resource.type === 'document' && groupSize > 5) {
        score += 10;
      } else if (resource.type === 'link' && keywords.includes('tutorial')) {
        score += 10;
      }

      return { ...resource, score };
    });

    // Sort by score and return top recommendations
    return scoredResources
      .filter(resource => resource.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6); // Return top 6 recommendations
  }

  // Get resources by subject (for general recommendations)
  async getResourcesBySubject(subject) {
    try {
      const response = await resourceService.getResources();
      const allResources = response.resources || [];
      
      return allResources.filter(resource => 
        resource.subject?.toLowerCase() === subject?.toLowerCase()
      ).slice(0, 8);
    } catch (error) {
      console.error('Error fetching resources by subject:', error);
      return [];
    }
  }

  // Get popular resources across all subjects
  async getPopularResources() {
    const cacheKey = 'popular_resources';
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey).recommendations;
    }

    try {
      const response = await resourceService.getResources();
      const allResources = response.resources || [];

      // Simulate popularity based on resource properties
      const popularResources = allResources
        .map(resource => ({
          ...resource,
          popularityScore: this.calculatePopularityScore(resource)
        }))
        .sort((a, b) => b.popularityScore - a.popularityScore)
        .slice(0, 10);

      this.cache.set(cacheKey, {
        recommendations: popularResources,
        timestamp: Date.now()
      });

      return popularResources;
    } catch (error) {
      console.error('Error fetching popular resources:', error);
      return [];
    }
  }

  // Calculate popularity score (mock implementation)
  calculatePopularityScore(resource) {
    let score = 0;

    // Newer resources get higher score
    const daysSinceCreated = resource.createdAt 
      ? (Date.now() - new Date(resource.createdAt)) / (1000 * 60 * 60 * 24)
      : 365;
    score += Math.max(0, 30 - daysSinceCreated);

    // Resources with descriptions get bonus
    if (resource.description && resource.description.length > 50) {
      score += 10;
    }

    // Resources with tags get bonus
    if (resource.tags && resource.tags.length > 0) {
      score += resource.tags.length * 2;
    }

    // Link resources might be more popular
    if (resource.type === 'link') {
      score += 5;
    }

    return score;
  }

  // Clear cache (useful for testing or when new resources are added)
  clearCache() {
    this.cache.clear();
  }
}

// Export singleton instance
export const resourceRecommendationService = new ResourceRecommendationService();
