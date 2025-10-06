import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Leaf, GraduationCap } from "lucide-react";

const stats = [
  { value: "15", label: "Global Reserve Sites" },
  { value: "500+", label: "Species Protected" },
  { value: "50", label: "Indigenous Communities" },
  { value: "100%", label: "Open Access Education" }
];

export default function NatureReserve() {
  const handleExploreReserve = () => {
    console.log("Exploring nature reserve research projects...");
  };

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-charcoal mb-4">Global Nature Reserve Network</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Protected conservation sites distributed globally, dedicated to open education, scientific research, and Indigenous communities with ancestral connections to the land.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
              alt="Pristine forest ecosystem"
              className="rounded-xl shadow-lg w-full h-auto"
            />
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-charcoal">Conservation & Indigenous Stewardship</h3>
            <p className="text-gray-600 text-lg">
              Our global network of protected sites honors Indigenous land rights while advancing open science. Each reserve is stewarded in partnership with local Indigenous communities, combining traditional ecological knowledge with modern conservation technology.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <Card key={index} className="bg-white shadow">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-bitcoin-orange mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button 
              onClick={handleExploreReserve}
              className="bg-bitcoin-orange hover:bg-orange-600 px-6 py-3 font-semibold"
            >
              <Leaf className="w-5 h-5 mr-2" />
              Explore Research Projects
            </Button>
          </div>
        </div>

        {/* Indigenous Partnership Section */}
        <div className="mt-20 bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-charcoal mb-4">Indigenous Partnerships & Access</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our commitment to land sovereignty and traditional ecological knowledge
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-green-200">
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <Leaf className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-charcoal mb-2">Land Sovereignty</h3>
                <p className="text-gray-600 text-sm">
                  Access reserved for Indigenous communities with ancestral connections to protected lands
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <GraduationCap className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-charcoal mb-2">Open Education</h3>
                <p className="text-gray-600 text-sm">
                  Free educational access for research, conservation, and traditional knowledge sharing
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-green-600 font-bold text-xl">🌍</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-charcoal mb-2">Global Network</h3>
                <p className="text-gray-600 text-sm">
                  Protected sites across continents, each managed with local Indigenous stewardship
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
