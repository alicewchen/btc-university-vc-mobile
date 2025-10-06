import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Book } from "lucide-react";

const publications = [
  {
    title: "Quantum-Resistant Consensus Mechanisms for Bitcoin Networks",
    authors: "Dr. Sarah Chen, Prof. Michael Rodriguez, Dr. Aisha Patel",
    journal: "Journal of Cryptographic Engineering • Vol. 23, Issue 4",
    abstract: "This paper presents novel approaches to developing quantum-resistant consensus algorithms that maintain the security guarantees of Bitcoin while preparing for the post-quantum era...",
    date: "Published March 2024"
  },
  {
    title: "Energy-Efficient Mining Through AI-Optimized Resource Allocation",
    authors: "Prof. James Park, Dr. Elena Volkov, Dr. Marcus Thompson",
    journal: "IEEE Transactions on Sustainable Computing • Vol. 8, Issue 2",
    abstract: "We propose a machine learning framework that reduces cryptocurrency mining energy consumption by 35% while maintaining network security through dynamic resource optimization...",
    date: "Published February 2024"
  },
  {
    title: "Decentralized Identity Systems: A Comprehensive Privacy Analysis",
    authors: "Dr. Lisa Kumar, Prof. David Wilson, Dr. Ana Gutierrez",
    journal: "ACM Transactions on Privacy and Security • Vol. 27, Issue 1",
    abstract: "A systematic evaluation of privacy guarantees in decentralized identity protocols, identifying vulnerabilities and proposing enhanced privacy-preserving mechanisms...",
    date: "Published January 2024"
  },
  {
    title: "Cross-Chain Interoperability: Bridging Blockchain Ecosystems",
    authors: "Prof. Robert Chang, Dr. Maria Santos, Dr. Ahmed Hassan",
    journal: "Nature Computational Science • Vol. 4, Issue 3",
    abstract: "We introduce a novel protocol for secure asset transfers between heterogeneous blockchain networks, addressing key challenges in cross-chain communication and trust...",
    date: "Published March 2024"
  }
];

export default function Publications() {
  const handleDownloadPaper = (title: string) => {
    console.log(`Downloading research paper: ${title} from IPFS...`);
  };

  const handleViewAllPublications = () => {
    console.log("Viewing all publications...");
  };

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-charcoal mb-4">Recent Publications</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Peer-reviewed research advancing the frontiers of blockchain technology and Web3 innovation.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {publications.map((publication, index) => (
            <Card key={index} className="hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-bitcoin-orange p-2 rounded-lg">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-charcoal mb-2">
                      {publication.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {publication.authors}
                    </p>
                    <p className="text-bitcoin-orange text-sm font-medium mb-2">
                      {publication.journal}
                    </p>
                    <p className="text-gray-600 text-sm mb-4">
                      {publication.abstract}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-xs">{publication.date}</span>
                      <Button 
                        onClick={() => handleDownloadPaper(publication.title)}
                        variant="ghost"
                        className="text-bitcoin-orange hover:text-orange-600 text-sm p-0"
                      >
                        Download PDF <Download className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button 
            onClick={handleViewAllPublications}
            className="bg-bitcoin-orange hover:bg-orange-600 px-6 py-3 font-semibold"
          >
            <Book className="w-5 h-5 mr-2" />
            View All Publications
          </Button>
        </div>
      </div>
    </section>
  );
}
