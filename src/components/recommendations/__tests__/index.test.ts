import { describe, it, expect } from 'vitest';
import { RecommendationCard } from '../RecommendationCard';
import { RecommendationList } from '../RecommendationList';
import { InsufficientDataFallback } from '../InsufficientDataFallback';
import { RecommendationErrorBoundary } from '../RecommendationErrorBoundary';

describe('Recommendation Components Exports', () => {
  it('should export RecommendationCard', () => {
    expect(RecommendationCard).toBeDefined();
    expect(typeof RecommendationCard).toBe('function');
  });

  it('should export RecommendationList', () => {
    expect(RecommendationList).toBeDefined();
    expect(typeof RecommendationList).toBe('function');
  });

  it('should export InsufficientDataFallback', () => {
    expect(InsufficientDataFallback).toBeDefined();
    expect(typeof InsufficientDataFallback).toBe('function');
  });

  it('should export RecommendationErrorBoundary', () => {
    expect(RecommendationErrorBoundary).toBeDefined();
    expect(typeof RecommendationErrorBoundary).toBe('function');
  });
});

