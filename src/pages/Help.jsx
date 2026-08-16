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
      <section className="max-w-4xl mx-auto px-6 py-24 mt-10 text-start">
        {/* Page Header */}
        <div className="mb-12 text-center max-w-xl mx-auto">
          <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-50 rounded-lg mb-3">
            Support Center
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-gray-950 tracking-tight">
            How can we help?
          </h1>
          <p className="text-gray-500 mt-2 text-base">
            Search our knowledge base or get in touch with our customer service team.
          </p>

          {/* Search Bar */}
          <div className="mt-6 relative">
            <input
              type="text"
              placeholder="Search for questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition text-gray-800"
            />
          </div>
        </div>

        {/* FAQs */}
        <div className="mb-16">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <FiHelpCircle className="text-primary-500" /> Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
                <div 
                  key={index}
                  className="bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full flex items-center justify-between p-5 text-left text-gray-800 font-bold hover:bg-slate-100/50 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <FiChevronDown 
                      className={`text-gray-500 transition-transform duration-300 ${
                        openIndex === index ? "transform rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div 
                    className={`transition-all duration-300 overflow-hidden ${
                      openIndex === index ? "max-h-40 border-t border-slate-100" : "max-h-0"
                    }`}
                  >
                    <p className="p-5 text-sm text-gray-600 leading-relaxed bg-white">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm italic">No matching questions found.</p>
            )}
          </div>
        </div>

        {/* Still Need Help? Section */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-8 text-center max-w-2xl mx-auto">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Still need support?</h3>
          <p className="text-sm text-gray-500 mb-6">
            If you couldn't find the answer to your question, our support team is online to assist you.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a 
              href="mailto:sancartofficial@gmail.com"
              className="flex flex-col items-center justify-center p-4 bg-white border border-slate-100 rounded-xl hover:shadow-md transition text-gray-700 hover:text-primary-500"
            >
              <FiMail className="text-xl mb-2 text-primary-500" />
              <span className="text-xs font-bold">Email Support</span>
            </a>
            <a 
              href="https://wa.me/916235320612"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-4 bg-white border border-slate-100 rounded-xl hover:shadow-md transition text-gray-700 hover:text-primary-500"
            >
              <FiPhone className="text-xl mb-2 text-primary-500" />
              <span className="text-xs font-bold">WhatsApp Us</span>
            </a>
            <Link 
              to="/contact"
              className="flex flex-col items-center justify-center p-4 bg-white border border-slate-100 rounded-xl hover:shadow-md transition text-gray-700 hover:text-primary-500"
            >
              <FiCompass className="text-xl mb-2 text-primary-500" />
              <span className="text-xs font-bold">Contact Page</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Help;
