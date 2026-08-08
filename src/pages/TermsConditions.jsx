import React from "react";
import SEO from "../components/SEO";

const TermsConditions = () => {
  return (
    <>
      <SEO 
        title="Terms & Conditions" 
        description="Review the terms and conditions for using sancart premium catalog and ordering products." 
      />
      <section className="max-w-4xl mx-auto px-6 py-24 mt-10 text-start">
        {/* Page Header */}
        <div className="mb-12 border-b border-slate-100 pb-8">
          <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-50 rounded-lg mb-3">
            Legal
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-gray-950 tracking-tight">
            Terms & Conditions
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Last Updated: August 8, 2026
          </p>
        </div>

        <div className="prose prose-slate max-w-none space-y-8 text-gray-600">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Agreement to Terms</h2>
            <p className="leading-relaxed">
              By accessing and using our website, placing an order, or registering an account at sancart, you agree to comply with and be bound by the following Terms and Conditions. If you do not agree, please do not use our services.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. User Accounts</h2>
            <p className="leading-relaxed">
              When creating an account, you agree to provide accurate and complete information. You are solely responsible for maintaining the confidentiality of your credentials and for all activities under your account. We reserve the right to suspend accounts that violate our terms.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Orders, Prices & Payments</h2>
            <p className="leading-relaxed">
              All orders are subject to acceptance and product availability. Prices for our products are subject to change without notice. Payments must be processed through our authorized payment providers before order shipment. We reserve the right to refuse or cancel any order for reasons including stock limitations or pricing errors.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Intellectual Property</h2>
            <p className="leading-relaxed">
              All content on this site, including logos, images, text, illustrations, graphics, and code, is the property of sancart or its content suppliers and is protected by international copyright laws. Any unauthorized use or reproduction is strictly prohibited.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Limitation of Liability</h2>
            <p className="leading-relaxed">
              sancart shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our services, or for any costs of procurement of substitute goods.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Governing Law</h2>
            <p className="leading-relaxed">
              These Terms & Conditions are governed by and construed in accordance with the laws of India, without regard to conflict of law principles. Any dispute arising from these terms will be subject to the exclusive jurisdiction of the courts located in Wayanad, Kerala.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default TermsConditions;
