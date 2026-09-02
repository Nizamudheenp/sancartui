import React from "react";
import SEO from "../components/SEO";

const TermsConditions = () => {
  return (
    <>
      <SEO 
        title="Terms & Conditions" 
        description="Review the terms and conditions for using sancart premium catalog and ordering products." 
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 pt-28">
        <div className="glass-card rounded-[2.5rem] p-6 sm:p-10 shadow-glass text-start">
          {/* Page Header */}
          <div className="mb-10 border-b border-white/30 pb-6">
            <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-500/10 rounded-lg mb-3">
              Legal
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-gray-955 tracking-tight">
              Terms & Conditions
            </h1>
            <p className="text-gray-400 mt-2 text-xs font-bold">
              Last Updated: August 8, 2026
            </p>
          </div>

          <div className="prose prose-slate max-w-none space-y-8 text-gray-750">
            <div>
              <h2 className="text-lg font-extrabold text-gray-955 mb-3 uppercase tracking-wider">1. Agreement to Terms</h2>
              <p className="leading-relaxed text-sm font-semibold">
                By accessing and using our website, placing an order, or registering an account at sancart, you agree to comply with and be bound by the following Terms and Conditions. If you do not agree, please do not use our services.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-extrabold text-gray-955 mb-3 uppercase tracking-wider">2. User Accounts</h2>
              <p className="leading-relaxed text-sm font-semibold">
                When creating an account, you agree to provide accurate and complete information. You are solely responsible for maintaining the confidentiality of your credentials and for all activities under your account. We reserve the right to suspend accounts that violate our terms.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-extrabold text-gray-955 mb-3 uppercase tracking-wider">3. Orders, Prices & Payments</h2>
              <p className="leading-relaxed text-sm font-semibold">
                All orders are subject to acceptance and product availability. Prices for our products are subject to change without notice. Payments must be processed through our authorized payment providers before order shipment. We reserve the right to refuse or cancel any order for reasons including stock limitations or pricing errors.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-extrabold text-gray-955 mb-3 uppercase tracking-wider">4. Intellectual Property</h2>
              <p className="leading-relaxed text-sm font-semibold">
                All content on this site, including logos, images, text, illustrations, graphics, and code, is the property of sancart or its content suppliers and is protected by international copyright laws. Any unauthorized use or reproduction is strictly prohibited.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-extrabold text-gray-955 mb-3 uppercase tracking-wider">5. Limitation of Liability</h2>
              <p className="leading-relaxed text-sm font-semibold">
                sancart shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our services, or for any costs of procurement of substitute goods.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-extrabold text-gray-955 mb-3 uppercase tracking-wider">6. Product Return Terms & Conditions</h2>
              <div className="leading-relaxed text-xs text-gray-600 font-semibold space-y-3 pl-2">
                <p>
                  <strong>6.1 Return Period:</strong> Customers can request a return within <em className="text-primary-600 font-extrabold">7 days</em> from the date of delivery.
                </p>
                <p>
                  <strong>6.2 Product Condition:</strong> Products must be unused, undamaged, and returned in their original condition with all original packaging, tags, accessories, manuals, and invoices.
                </p>
                <p>
                  <strong>6.3 Damaged/Defective Products:</strong> If the product is received damaged, defective, or incorrect, the customer must inform us within <em className="text-primary-600 font-extrabold">24 hours</em> of delivery and provide clear photos/videos as proof.
                </p>
                <p>
                  <strong>6.4 Non-Returnable Products:</strong> Certain products may not be eligible for return, including personalized, customized, perishable, hygiene-sensitive, or clearance products.
                </p>
                <p>
                  <strong>6.5 Return Shipping:</strong> For eligible returns due to a defective, damaged, or incorrect product, return shipping costs will be covered by us. For returns due to a change of mind, shipping charges may be deducted from the refund.
                </p>
                <p>
                  <strong>6.6 Refund:</strong> Once the returned product is received and inspected, the refund will be processed within <em className="text-primary-600 font-extrabold">5–7 business days</em>. Refunds will be made to the original payment method wherever applicable.
                </p>
                <p>
                  <strong>6.7 Exchange:</strong> Product exchanges are subject to product availability. If the requested replacement is unavailable, the customer may be offered a refund or another suitable option.
                </p>
                <p>
                  <strong>6.8 Return Approval:</strong> All return requests are subject to verification and approval. Products returned without prior approval may not be accepted.
                </p>
                <p>
                  <strong>6.9 Missing Items:</strong> If any accessories, parts, or original packaging are missing, the refund amount may be reduced accordingly.
                </p>
                <p>
                  <strong>6.10 Final Decision:</strong> We reserve the right to reject a return if the product does not meet the above return conditions.
                </p>
                <p className="italic mt-4 text-gray-400">
                  For return requests, please contact our customer support team with your order number and details of the issue.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-extrabold text-gray-955 mb-3 uppercase tracking-wider">7. Governing Law</h2>
              <p className="leading-relaxed text-sm font-semibold">
                These Terms & Conditions are governed by and construed in accordance with the laws of India, without regard to conflict of law principles. Any dispute arising from these terms will be subject to the exclusive jurisdiction of the courts located in Wayanad, Kerala.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsConditions;
