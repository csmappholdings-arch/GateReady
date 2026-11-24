import React from 'react';
import { PageLayout } from './PageLayout';
import { ProductShowcase } from '../components/ProductShowcase';

export const DemoPage: React.FC = () => {
  return (
    <PageLayout pathname="/demo" fullWidthContent>
      <ProductShowcase
        isStandaloneDemoPage
        onStartTrip={() => {
          window.location.href = '/?action=new_trip';
        }}
        onExploreBaggage={() => {
          window.location.href = '/baggage-fee-calculator';
        }}
        onExplorePacking={() => {
          window.location.href = '/?action=new_trip';
        }}
        onOpenPricing={() => {
          window.location.href = '/pricing';
        }}
      />
    </PageLayout>
  );
};
