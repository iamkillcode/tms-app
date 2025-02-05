import { Link } from 'react-router-dom';
import { DocumentTextIcon, CalculatorIcon, ClipboardDocumentListIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const ToolsDashboard = () => {
  const tools = [
    {
      title: "Tender Number Generator",
      description: "Generate standardized tender numbers following organizational guidelines",
      icon: DocumentTextIcon,
      link: "/generate-tender",
      color: "bg-blue-100"
    },
    {
      title: "Cost Calculator (Coming Soon)",
      description: "Estimate procurement costs and budgets",
      icon: CalculatorIcon,
      link: "#",
      color: "bg-purple-100",
      disabled: true
    },
    {
      title: "Document Checklist (Coming Soon)",
      description: "Generate required documentation checklists for tenders",
      icon: ClipboardDocumentListIcon,
      link: "#",
      color: "bg-green-100",
      disabled: true
    },
    {
      title: "Analytics (Coming Soon)",
      description: "View procurement metrics and reports",
      icon: ChartBarIcon,
      link: "#",
      color: "bg-yellow-100",
      disabled: true
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Procurement Tools</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, index) => (
            <div 
              key={index}
              className={`${tool.color} rounded-lg shadow-sm hover:shadow-md transition-shadow ${
                tool.disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Link 
                to={tool.link} 
                className="block p-6 h-full"
                onClick={(e) => tool.disabled ? e.preventDefault() : null}
              >
                <div className="flex items-start space-x-4">
                  <tool.icon className="h-8 w-8 text-gray-700" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{tool.title}</h3>
                    <p className="text-sm text-gray-600">{tool.description}</p>
                    {!tool.disabled && (
                      <div className="mt-4">
                        <span className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          Open Tool →
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ToolsDashboard; 