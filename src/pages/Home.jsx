import React from 'react'
import Hero from '../components/Hero'
import Banner from '../components/Banner'
import SmallBanner from '../components/SmallBanner'
import SmallBanner2 from '../components/SmallBanner2'
import NewsLetter from '../components/NewsLetter'
import ProductCollection from '../components/ProductCollection'
import TrustBadges from '../components/TrustBadges'
import CategoryShowcase from '../components/CategoryShowcase'
import Testimonials from '../components/Testimonials'
import SEO from '../components/SEO'

function Home() {
  return (
    <div className="pb-12 pt-6">
      <SEO />

      {/* Hero Redesign (Has its own full-screen backdrop) */}
      <Hero />

      {/* Trust Badges Floating Glass Pill */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 mt-4">
        <div className="glass-card rounded-[2rem] p-6 shadow-glass">
          <TrustBadges />
        </div>
      </div>

      {/* Trending Products */}
      <ProductCollection title="Trending Products" tag="Trending Product" limit={8} />

      {/* Category Showcase Glass Panel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="glass-card rounded-[2.5rem] p-3 sm:p-10 shadow-glass">
          <CategoryShowcase />
        </div>
      </div>

      {/* Featured Products */}
      <ProductCollection title="Featured Products" tag="Featured" limit={8} />

      {/* Main Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <Banner />
      </div>

      {/* Trending Collections */}
      <ProductCollection title="Trending Collections" tag="New Arrival" limit={8} />

      {/* Small Banners Row 1 (2-column grid inside) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <SmallBanner />
      </div>

      {/* Small Banners Row 2 (3-column grid inside) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <SmallBanner2 />
      </div>

      {/* Testimonials Glass Panel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="glass-card rounded-[2.5rem] p-6 sm:p-10 shadow-glass">
          <Testimonials />
        </div>
      </div>

      {/* Newsletter Signup Glass Panel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="glass-card rounded-[2.5rem] p-6 sm:p-10 shadow-glass">
          <NewsLetter />
        </div>
      </div>
    </div>
  )
}

export default Home