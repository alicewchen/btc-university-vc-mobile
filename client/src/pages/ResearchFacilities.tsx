import { Server, Microscope, Brain, Shield } from "lucide-react";

const facilities = [
  {
    icon: Server,
    title: "Quantum Computing Lab",
    description: "Advanced quantum processors for cryptographic research and blockchain scalability testing."
  },
  {
    icon: Microscope,
    title: "Nanotechnology Center",
    description: "Precision manufacturing and materials science for next-generation hardware solutions."
  },
  {
    icon: Brain,
    title: "AI Research Hub",
    description: "High-performance computing clusters for machine learning and neural network development."
  },
  {
    icon: Shield,
    title: "Cybersecurity Lab",
    description: "Isolated testing environments for security protocol validation and threat analysis."
  }
];

export default function ResearchFacilities() {
  return (
    <section className="py-20 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-charcoal mb-4">Research Facilities</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            State-of-the-art facilities equipped with cutting-edge technology for groundbreaking research.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            {facilities.map((facility, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="bg-bitcoin-orange p-3 rounded-lg">
                  <facility.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-charcoal mb-2">{facility.title}</h3>
                  <p className="text-gray-600">{facility.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1581092921461-eab62e97a780?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
              alt="Advanced Research Laboratory"
              className="rounded-xl shadow-lg w-full h-auto"
            />
            <div className="absolute inset-0 bg-bitcoin-orange bg-opacity-20 rounded-xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
