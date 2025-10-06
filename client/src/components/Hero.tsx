import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Rocket, Coins, ChevronDown } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/attached_assets/0f10dd51-7166-40e7-9a7e-92483dfac284_1753920093356.png')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      />
      <div className="absolute inset-0 bg-bitcoin-orange bg-opacity-75 z-10" />
      
      <div className="relative z-20 text-center text-white max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          The Future of
          <span className="block text-white">Research & Innovation</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-2xl mx-auto">
          Join the world's first decentralized research institution where scientists, funders, and students collaborate on groundbreaking Web3 research projects.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/programs">
            <Button className="text-bitcoin-orange px-8 py-4 text-lg font-semibold hover:bg-gray-100 bg-[#000000]">
              <Rocket className="w-5 h-5 mr-2" />
              Explore Programs
            </Button>
          </Link>
          <Link href="/funding">
            <Button variant="outline" className="border-2 border-white px-8 py-4 text-lg font-semibold hover:bg-white hover:text-bitcoin-orange bg-[#000000] text-[#ff6f00]">
              <Coins className="w-5 h-5 mr-2" />
              View Funding
            </Button>
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="animate-bounce">
          <ChevronDown className="text-white h-8 w-8" />
        </div>
      </div>
    </section>
  );
}
