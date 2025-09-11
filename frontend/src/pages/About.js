import React from 'react';
import { 
  Shield, 
  Zap, 
  Users, 
  Lock, 
  Globe, 
  Code,
  CheckCircle,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: Shield,
      title: 'Transparent Funding',
      description: 'All transactions are recorded on the blockchain, ensuring complete transparency and accountability.'
    },
    {
      icon: Zap,
      title: 'Milestone-Based Releases',
      description: 'Funds are released only when milestones are completed and approved, reducing risk for sponsors.'
    },
    {
      icon: Users,
      title: 'Multi-Role Support',
      description: 'Support for project creators, sponsors, and auditors with role-based access control.'
    },
    {
      icon: Lock,
      title: 'Smart Contract Security',
      description: 'Built with OpenZeppelin standards and comprehensive security measures.'
    },
    {
      icon: Globe,
      title: 'Decentralized',
      description: 'No central authority controls the funds. Smart contracts handle all operations automatically.'
    },
    {
      icon: Code,
      title: 'Open Source',
      description: 'Fully open source codebase with comprehensive documentation and community support.'
    }
  ];

  const technologies = [
    { name: 'Solidity', description: 'Smart contract development' },
    { name: 'Hardhat', description: 'Development framework' },
    { name: 'Ethers.js', description: 'Blockchain interaction' },
    { name: 'React.js', description: 'Frontend framework' },
    { name: 'TailwindCSS', description: 'Styling framework' },
    { name: 'Node.js', description: 'Backend runtime' },
    { name: 'Express.js', description: 'Web framework' },
    { name: 'MetaMask', description: 'Wallet integration' }
  ];

  const benefits = [
    'Eliminates fund misuse through transparent tracking',
    'Reduces risk for sponsors with milestone-based releases',
    'Provides immutable audit trail for all transactions',
    'Enables automated fund management through smart contracts',
    'Supports multiple projects and stakeholders simultaneously',
    'Offers real-time project monitoring and reporting'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            About BlockFund
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A revolutionary blockchain-based platform that ensures transparent, 
            milestone-driven project funding with complete accountability and 
            automated fund management through smart contracts.
          </p>
        </div>

        {/* Problem & Solution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              The Problem
            </h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-danger-500 rounded-full mt-2"></div>
                <p className="text-gray-600">
                  Traditional project funding lacks transparency and accountability
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-danger-500 rounded-full mt-2"></div>
                <p className="text-gray-600">
                  Funds are often misused or not properly tracked
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-danger-500 rounded-full mt-2"></div>
                <p className="text-gray-600">
                  Sponsors have limited control over fund releases
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-danger-500 rounded-full mt-2"></div>
                <p className="text-gray-600">
                  No immutable audit trail for financial transactions
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Our Solution
            </h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-success-500 rounded-full mt-2"></div>
                <p className="text-gray-600">
                  Blockchain-based transparent funding with smart contracts
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-success-500 rounded-full mt-2"></div>
                <p className="text-gray-600">
                  Milestone-based fund releases with sponsor approval
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-success-500 rounded-full mt-2"></div>
                <p className="text-gray-600">
                  Complete audit trail for all transactions
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-success-500 rounded-full mt-2"></div>
                <p className="text-gray-600">
                  Automated fund management and real-time monitoring
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="card text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Benefits */}
        <div className="card mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Benefits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-success-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">{benefit}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Technology Stack */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Technology Stack
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {technologies.map((tech, index) => (
              <div key={index} className="card text-center">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {tech.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {tech.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="card mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Create Project</h3>
              <p className="text-sm text-gray-600">
                Project creators set up projects with defined milestones and funding requirements.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Sponsor Funds</h3>
              <p className="text-sm text-gray-600">
                Sponsors deposit funds into the smart contract for the project.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Complete Milestones</h3>
              <p className="text-sm text-gray-600">
                Creators complete milestones and request approval from sponsors.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Release Funds</h3>
              <p className="text-sm text-gray-600">
                Sponsors approve milestones and funds are automatically released.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="card max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-gray-600 mb-6">
              Join the future of transparent project funding. Create your first project 
              or explore existing opportunities to sponsor.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/projects/create"
                className="btn-primary flex items-center justify-center space-x-2"
              >
                <span>Create Project</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="/projects"
                className="btn-secondary flex items-center justify-center space-x-2"
              >
                <span>Browse Projects</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center text-gray-500">
          <p className="mb-2">
            Built with ❤️ using modern blockchain technology
          </p>
          <p className="text-sm">
            Open source • Secure • Transparent • Decentralized
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
