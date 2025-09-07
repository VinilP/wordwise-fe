import React from 'react';

const AboutPage: React.FC = () => {
  const team = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & CEO',
      description: 'Passionate about connecting readers with their next favorite book.',
      image: '👩‍💼'
    },
    {
      name: 'Michael Chen',
      role: 'Lead Developer',
      description: 'Building the technology that powers personalized recommendations.',
      image: '👨‍💻'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Community Manager',
      description: 'Fostering our vibrant community of book lovers.',
      image: '👩‍🎨'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Books in our database' },
    { number: '50,000+', label: 'Active readers' },
    { number: '100,000+', label: 'Reviews written' },
    { number: '1M+', label: 'Recommendations given' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About WordWise
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're on a mission to help readers discover their next favorite book through intelligent recommendations and authentic community reviews.
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-16">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Our Mission
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-lg text-gray-700 mb-4">
                  At WordWise, we believe that every reader deserves to find books that truly resonate with them. 
                  Our platform combines the power of artificial intelligence with the wisdom of a passionate 
                  reading community to deliver personalized book recommendations.
                </p>
                <p className="text-lg text-gray-700">
                  Whether you're a voracious reader looking for your next obsession or someone just starting 
                  their reading journey, we're here to guide you to books that will captivate, inspire, and transform you.
                </p>
              </div>
              <div className="text-center">
                <div className="text-8xl mb-4">📚</div>
                <p className="text-gray-600 italic">
                  "A room without books is like a body without a soul." - Cicero
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Our Impact
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-6xl mb-4">{member.image}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-blue-600 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Personalization
              </h3>
              <p className="text-gray-600">
                We believe every reader is unique, and their book recommendations should be too.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Community
              </h3>
              <p className="text-gray-600">
                We foster a supportive community where readers can share their love of books.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Authenticity
              </h3>
              <p className="text-gray-600">
                We value honest, genuine reviews that help readers make informed decisions.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Join Our Reading Community
          </h2>
          <p className="text-xl mb-6 opacity-90">
            Be part of a community that celebrates the joy of reading and helps others discover amazing books.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className="bg-white text-blue-600 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              Get Started Free
            </a>
            <a
              href="/how-it-works"
              className="border-2 border-white text-white px-6 py-3 rounded-md font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200"
            >
              Learn How It Works
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
