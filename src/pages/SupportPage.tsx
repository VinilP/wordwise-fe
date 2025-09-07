import React, { useState } from 'react';

const SupportPage: React.FC = () => {
  const [selectedIssue, setSelectedIssue] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    description: '',
    priority: 'medium'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const supportOptions = [
    {
      id: 'account',
      title: 'Account Issues',
      description: 'Login problems, password reset, profile updates',
      icon: '👤',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'technical',
      title: 'Technical Problems',
      description: 'Website errors, slow loading, mobile issues',
      icon: '🔧',
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 'recommendations',
      title: 'Recommendations',
      description: 'Not getting good suggestions, algorithm questions',
      icon: '🎯',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      id: 'reviews',
      title: 'Reviews & Ratings',
      description: 'Can\'t post reviews, rating problems',
      icon: '⭐',
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      id: 'billing',
      title: 'Billing & Payments',
      description: 'Payment issues, subscription questions',
      icon: '💳',
      color: 'bg-red-100 text-red-600'
    },
    {
      id: 'general',
      title: 'General Inquiry',
      description: 'Feature requests, feedback, other questions',
      icon: '💬',
      color: 'bg-gray-100 text-gray-600'
    }
  ];

  const quickSolutions = [
    {
      title: 'Can\'t log in?',
      solution: 'Try resetting your password or check if you\'re using the correct email address.',
      link: '/forgot-password'
    },
    {
      title: 'Website loading slowly?',
      solution: 'Clear your browser cache, check your internet connection, or try a different browser.',
      link: null
    },
    {
      title: 'Not getting recommendations?',
      solution: 'Make sure you\'ve rated at least 5-10 books to get personalized suggestions.',
      link: '/books'
    },
    {
      title: 'Can\'t see book covers?',
      solution: 'This is usually due to slow internet connection. Try refreshing the page.',
      link: null
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', description: '', priority: 'medium' });
      setSelectedIssue('');
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Support Center
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're here to help! Get assistance with any issues or questions you might have.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Solutions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Solutions
              </h3>
              <div className="space-y-4">
                {quickSolutions.map((solution, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">
                      {solution.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      {solution.solution}
                    </p>
                    {solution.link && (
                      <a
                        href={solution.link}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Learn more →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Other Ways to Reach Us
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">📧</div>
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-600">support@wordwise.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">💬</div>
                  <div>
                    <p className="font-medium text-gray-900">Live Chat</p>
                    <p className="text-sm text-gray-600">Available 24/7</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">📞</div>
                  <div>
                    <p className="font-medium text-gray-900">Phone</p>
                    <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Support Categories */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                What can we help you with?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {supportOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedIssue(option.id)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                      selectedIssue === option.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${option.color}`}>
                        <span className="text-xl">{option.icon}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">
                          {option.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Support Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Submit a Support Ticket
              </h3>
              
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
                  Thank you for contacting us! We'll get back to you within 24 hours.
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
                  There was an error submitting your ticket. Please try again.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Brief description of your issue"
                  />
                </div>

                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="low">Low - General question</option>
                    <option value="medium">Medium - Minor issue</option>
                    <option value="high">High - Major issue</option>
                    <option value="urgent">Urgent - Critical problem</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={6}
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Please provide detailed information about your issue..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Support Ticket'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
