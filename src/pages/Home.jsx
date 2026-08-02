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
    <div className="pt-20">
      <SEO />
      <Hero />
      <TrustBadges />
      <ProductCollection title="Trending Products" tag="Trending Product" limit={8} />
      <CategoryShowcase />
      <ProductCollection title="Featured Products" tag="Featured" limit={8} />
      <Banner />
      <ProductCollection title="Trending Collections" tag="New Arrival" limit={8} />
      <SmallBanner />
      <SmallBanner2 />
      <Testimonials />
      <NewsLetter />
    </div>
  )
}

export default Home