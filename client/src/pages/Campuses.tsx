import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { University, Users, FlaskConical, GraduationCap, ExternalLink } from "lucide-react";

const campuses = [
  {
    name: "Silicon Valley Campus",
    location: "Palo Alto, California",
    researchers: "250 Researchers",
    labs: "15 Labs",
    students: "500 Students"
  },
  {
    name: "European Hub",
    location: "Zurich, Switzerland",
    researchers: "180 Researchers",
    labs: "12 Labs",
    students: "350 Students"
  },
  {
    name: "Asia-Pacific Center",
    location: "Singapore",
    researchers: "320 Researchers",
    labs: "20 Labs",
    students: "600 Students"
  }
];

export default function Campuses() {
  const handleVisitCampus = (campusName: string) => {
    console.log(`Starting virtual tour of ${campusName}...`);
  };

  return (
    <section className="py-20 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-charcoal mb-4">Global Campuses</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Research centers strategically located worldwide to foster international collaboration.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {campuses.map((campus, index) => (
            <Card key={index} className="bg-light-orange hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <University className="h-12 w-12 text-bitcoin-orange mx-auto mb-3" />
                  <h3 className="text-xl font-semibold text-charcoal">{campus.name}</h3>
                  <p className="text-gray-600">{campus.location}</p>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2 text-bitcoin-orange" />
                    <span>{campus.researchers}</span>
                  </div>
                  <div className="flex items-center">
                    <FlaskConical className="w-4 h-4 mr-2 text-bitcoin-orange" />
                    <span>{campus.labs}</span>
                  </div>
                  <div className="flex items-center">
                    <GraduationCap className="w-4 h-4 mr-2 text-bitcoin-orange" />
                    <span>{campus.students}</span>
                  </div>
                </div>
                <Button 
                  onClick={() => handleVisitCampus(campus.name)}
                  variant="ghost"
                  className="w-full mt-4 text-bitcoin-orange hover:text-orange-600"
                >
                  Virtual Tour <ExternalLink className="w-4 h-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
