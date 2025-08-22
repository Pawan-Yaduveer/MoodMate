import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, BarChart3, MessageCircle, Music, TrendingUp, Shield, Zap } from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <Heart className="w-8 h-8 text-primary-600" />,
      title: 'Track Your Moods',
      description: 'Record and monitor your daily emotional states with detailed insights and patterns.'
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-primary-600" />,
      title: 'Analytics & Trends',
      description: 'Visualize your mood patterns over time with beautiful charts and statistics.'
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-primary-600" />,
      title: 'AI Wellness Assistant',
      description: 'Get personalized advice and support from our intelligent wellness chatbot.'
    },
    {
      icon: <Music className="w-8 h-8 text-primary-600" />,
      title: 'Mood-Based Music',
      description: 'Discover playlists curated specifically for your current emotional state.'
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-primary-600" />,
      title: 'Progress Tracking',
      description: 'Monitor your wellness journey and celebrate your emotional growth.'
    },
    {
      icon: <Shield className="w-8 h-8 text-primary-600" />,
      title: 'Privacy First',
      description: 'Your emotional data is secure and private, always under your control.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-blue-50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Your Journey to
              <span className="text-primary-600"> Emotional Wellness</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Track your moods, understand your patterns, and get personalized support on your path to better mental health.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn-primary text-lg px-8 py-3">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn-primary text-lg px-8 py-3">
                    Start Your Journey
                  </Link>
                  <Link to="/login" className="btn-outline text-lg px-8 py-3">
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Emotional Wellness
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools and insights to help you understand and improve your emotional well-being.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card hover:shadow-lg transition-shadow duration-300">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 p-3 bg-primary-50 rounded-full">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Your Wellness Journey?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of users who are already tracking their moods and improving their emotional well-being.
            </p>
            {!isAuthenticated && (
              <Link to="/register" className="bg-white text-primary-600 hover:bg-gray-50 font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200">
                Get Started Free
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-xl font-bold">MoodMate</span>
            </div>
            <p className="text-gray-400 mb-4">
              Empowering emotional wellness through intelligent mood tracking and personalized support.
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Contact</span>
            </div>
            <p className="text-gray-500 text-sm mt-6">
              © 2024 MoodMate. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
