import { GraduationCap, X, Linkedin, Github, Info } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-charcoal dark:bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center mb-4">
              <GraduationCap className="h-8 w-8 text-bitcoin-orange mr-3" />
              <span className="text-xl font-bold">Bitcoin University</span>
            </div>
            <p className="text-gray-400 mb-4">Decentralized research institution dedicated to education and scientific research for the future generations.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-bitcoin-orange transition-colors">
                <X className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-bitcoin-orange transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-bitcoin-orange transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Research</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/programs" className="hover:text-bitcoin-orange transition-colors">Programs</a></li>
              <li><a href="/funding" className="hover:text-bitcoin-orange transition-colors">Funding</a></li>
              <li><a href="/facilities" className="hover:text-bitcoin-orange transition-colors">Facilities</a></li>
              <li><a href="/publications" className="hover:text-bitcoin-orange transition-colors">Publications</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Education</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/courses" className="hover:text-bitcoin-orange transition-colors">Courses</a></li>
              <li><a href="/campuses" className="hover:text-bitcoin-orange transition-colors">Campuses</a></li>
              <li><a href="#" className="hover:text-bitcoin-orange transition-colors">Student Portal</a></li>
              <li><a href="#" className="hover:text-bitcoin-orange transition-colors">Faculty</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">About</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-bitcoin-orange transition-colors">Mission</a></li>
              <li><a href="/nature-reserve" className="hover:text-bitcoin-orange transition-colors">Nature Reserve</a></li>
              <li><a href="#" className="hover:text-bitcoin-orange transition-colors">Governance</a></li>
              <li><a href="#" className="hover:text-bitcoin-orange transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        {/* Fee Disclosure Banner */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <div className="bg-bitcoin-orange bg-opacity-20 border border-bitcoin-orange rounded-lg px-4 py-2 inline-block">
                <Info className="inline w-4 h-4 text-bitcoin-orange mr-2" />
                <span className="text-bitcoin-orange font-medium">Platform Bridge Fee: 1%</span>
                <span className="text-gray-300 ml-2">All transactions processed through BUFeeRouter.sol</span>
              </div>
            </div>
            <div className="text-center md:text-right text-gray-400 text-sm">
              <p>© 2024 Bitcoin University. All rights reserved.</p>
              <p className="mt-1">Built on Ethereum • Powered by Thirdweb</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
