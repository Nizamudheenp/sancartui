import React, { useState } from "react";
import SEO from "../components/SEO";
import { Link } from "react-router-dom";
import { FiChevronDown, FiHelpCircle, FiMail, FiPhone, FiCompass } from "react-icons/fi";

const Help = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How do I track my order?",
      answer: "You can track the status of your order directly on our website. Simply log in, click on your profile icon, and head to the 'My Orders' section to see the real-time status of your shipments."
    },
    {
      question: "What are your shipping times?",
      answer: "We process orders within 1-2 business days. Shipping usually takes 3 to 7 business days depending on your location. Delivery updates are sent in real-time."
    },
    {
      question: "Which payment methods are accepted?",
      answer: "We accept all major debit cards, credit cards, UPI (GPay, PhonePe, Paytm), and Net Banking. All transactions are fully secured and processed via Razorpay or Stripe."
    },
    {
      question: "What is your product return policy?",
      answer: "Customers can request a return within 7 days of delivery. The product must be unused, undamaged, and in its original packaging with all tags, accessories, and invoices. For damaged or defective products, please inform us within 24 hours of delivery. See our Terms & Conditions page for the complete return guidelines."
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <SEO 
        title="Help & Support" 
        description="Find answers to frequently asked questions or contact sancart customer support." 
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 pt-28">
        <div className="glass-card rounded-[2.5rem] p-6 sm:p-10 shadow-glass text-start">
          {/* Page Header */}
          <div className="mb-10 text-center max-w-xl mx-auto">
            <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-500/10 rounded-lg mb-3">
              Support Center
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-gray-955 tracking-tight">
              How can we help?
            </h1>
            <p className="text-gray-500 mt-2 text-sm font-semibold">
              Search our knowledge base or get in touch with our customer service team.
            </p>

            {/* Search Bar */}
            <div className="mt-6 relative">
              <input
                type="text"
                placeholder="Search for questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-5 py-3 rounded-2xl border border-white/60 bg-white/40 focus:outline-none focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 transition font-semibold text-gray-800 text-sm placeholder-gray-400"
              />
            </div>
          </div>

          {/* FAQs */}
          <div className="mb-12">
            <h2 className="text-lg font-extrabold text-gray-950 mb-6 flex items-center gap-2 uppercase tracking-wider">
              <FiHelpCircle className="text-primary-600" /> Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq, index) => (
                  <div 
                    key={index}
                    className="bg-white/40 border border-white/50 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm"
                  >
                    <button
                      onClick={() => toggleAccordion(index)}
                      className="w-full flex items-center justify-between p-5 text-left text-gray-950 font-bold hover:bg-white/40 transition-colors"
                    >
                      <span className="text-sm">{faq.question}</span>
                      <FiChevronDown 
                        className={`text-gray-500 transition-transform duration-300 ${
                          openIndex === index ? "transform rotate-180" : ""
                        }`}
                      />
                    </button>
                    <div 
                      className={`transition-all duration-300 overflow-hidden ${
                        openIndex === index ? "max-h-40 border-t border-white/30" : "max-h-0"
                      }`}
                    >
                      <p className="p-5 text-xs text-gray-700 leading-relaxed bg-white/30 font-medium">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-xs font-bold italic">No matching questions found.</p>
              )}
            </div>
          </div>

          {/* Still Need Help? Section */}
          <div className="bg-white/30 backdrop-blur-md border border-white/55 rounded-3xl p-6 sm:p-8 text-center max-w-2xl mx-auto shadow-sm">
            <h3 className="text-base font-extrabold text-gray-950 mb-2">Still need support?</h3>
            <p className="text-xs text-gray-500 font-semibold mb-6">
              If you couldn't find the answer to your question, our support team is online to assist you.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <a 
                href="mailto:sancartofficial@gmail.com"
                className="flex flex-col items-center justify-center p-4 bg-white/40 border border-white/50 rounded-2xl hover:shadow-md hover:bg-white/60 transition text-gray-700 hover:text-primary-600"
              >
                <FiMail className="text-xl mb-2 text-primary-600" />
                <span className="text-[10px] font-black uppercase tracking-wider">Email Support</span>
              </a>
              <a 
                href="https://wa.me/916235320612"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-4 bg-white/40 border border-white/50 rounded-2xl hover:shadow-md hover:bg-white/60 transition text-gray-700 hover:text-primary-600"
              >
                <FiPhone className="text-xl mb-2 text-primary-600" />
                <span className="text-[10px] font-black uppercase tracking-wider">WhatsApp Us</span>
              </a>
              <Link 
                to="/contact"
                className="flex flex-col items-center justify-center p-4 bg-white/40 border border-white/50 rounded-2xl hover:shadow-md hover:bg-white/60 transition text-gray-700 hover:text-primary-600"
              >
                <FiCompass className="text-xl mb-2 text-primary-600" />
                <span className="text-[10px] font-black uppercase tracking-wider">Contact Page</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Help;
