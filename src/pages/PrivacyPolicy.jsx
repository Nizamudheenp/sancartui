import React from "react";
import SEO from "../components/SEO";

const PrivacyPolicy = () => {
  return (
    <>
      <SEO 
        title="Privacy Policy" 
        description="Learn how sancart collects, uses, and protects your personal information." 
      />
      <section className="max-w-4xl mx-auto px-6 py-24 mt-10 text-start">
        {/* Page Header */}
        <div className="mb-12 border-b border-slate-100 pb-8">
          <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-50 rounded-lg mb-3">
            Legal
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-gray-950 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Last Updated: August 8, 2026
          </p>
        </div>

        <div className="prose prose-slate max-w-none space-y-8 text-gray-600">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Information We Collect</h2>
            <p className="leading-relaxed">
              We collect information to provide better services to our users. This includes:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Personal Data:</strong> Name, email address, shipping/billing address, and phone number when you place an order or register.</li>
              <li><strong>Payment Data:</strong> Transaction details processed securely via our payment gateways (e.g., Razorpay, Stripe). We do not store credit card credentials.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. How We Use Your Information</h2>
            <p className="leading-relaxed">
              The information we collect is utilized for the following purposes:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Processing orders, shipments, and providing customer support.</li>
              <li>Improving our website, store catalog, and user experiences.</li>
              <li>Sending transactional emails, order updates, and marketing communications (with your consent).</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Data Security and Retention</h2>
            <p className="leading-relaxed">
              We secure your personal data with standard encryption techniques. However, no transmission method over the internet is 100% secure. We retain your information for as long as your account remains active or as needed to comply with legal obligations, resolve disputes, and enforce our agreements.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Cookies & Session Management</h2>
            <p className="leading-relaxed">
              We use cookies to manage active user sessions and preserve items in your shopping cart. These cookies are essential for the core functionality of the shopping platform. You can choose to disable cookies in your browser settings, though doing so may prevent you from placing orders or maintaining a logged-in session.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Third-Party Disclosures</h2>
            <p className="leading-relaxed">
              We do not sell or rent your personal data to third parties. We share data only with trusted partners essential for service delivery, such as delivery companies (couriers) and payment gateway providers, who must adhere to privacy terms.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Your Rights</h2>
            <p className="leading-relaxed">
              You have the right to request access to the personal data we hold about you, request corrections, or request deletion. If you wish to make a request, please contact us at <span className="font-semibold text-primary-600">sancartofficial@gmail.com</span>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default PrivacyPolicy;
