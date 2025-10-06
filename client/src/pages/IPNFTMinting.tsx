import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Upload, 
  FileText, 
  Users, 
  Globe, 
  Lock, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Wallet,
  Plus,
  X,
  ExternalLink
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWeb3 } from "@/hooks/useWeb3";

interface CollaboratorInput {
  id: string;
  name: string;
}

interface IPNFTFormData {
  title: string;
  description: string;
  researchField: string;
  isOpenSource: boolean;
  collaborators: CollaboratorInput[];
  file: File | null;
}

const researchFields = [
  "Blockchain Technology",
  "Artificial Intelligence",
  "Machine Learning", 
  "Cryptography",
  "Decentralized Systems",
  "Smart Contracts",
  "DeFi Protocols",
  "Genomics",
  "Bioinformatics",
  "Climate Science",
  "Conservation Technology",
  "Quantum Computing",
  "High-Performance Computing",
  "Environmental Science",
  "Renewable Energy",
  "Other"
];

export default function IPNFTMinting() {
  const { toast } = useToast();
  const web3 = useWeb3();
  
  const [formData, setFormData] = useState<IPNFTFormData>({
    title: "",
    description: "",
    researchField: "",
    isOpenSource: false,
    collaborators: [],
    file: null
  });
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileHash, setUploadedFileHash] = useState<string>("");
  const [mintedTokenId, setMintedTokenId] = useState<string>("");
  const [mintingFee] = useState("0.01"); // ETH

  // Calculate total cost including platform fee using Web3 hook
  const costBreakdown = web3.calculateMintingCost(mintingFee);

  const handleInputChange = (field: keyof IPNFTFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
      const ipfsHash = await web3.uploadToIPFS(file);
      
      setUploadedFileHash(ipfsHash);
      setFormData(prev => ({
        ...prev,
        file: file
      }));
      
      toast({
        title: "File uploaded successfully",
        description: `IPFS Hash: ${ipfsHash}`,
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload file to IPFS",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const addCollaborator = () => {
    const newCollaborator: CollaboratorInput = {
      id: Date.now().toString(),
      name: ""
    };
    setFormData(prev => ({
      ...prev,
      collaborators: [...prev.collaborators, newCollaborator]
    }));
  };

  const updateCollaborator = (id: string, name: string) => {
    setFormData(prev => ({
      ...prev,
      collaborators: prev.collaborators.map(collab => 
        collab.id === id ? { ...collab, name } : collab
      )
    }));
  };

  const removeCollaborator = (id: string) => {
    setFormData(prev => ({
      ...prev,
      collaborators: prev.collaborators.filter(collab => collab.id !== id)
    }));
  };

  const handleConnectWallet = async () => {
    try {
      const address = await web3.connectWallet();
      
      toast({
        title: "Wallet connected",
        description: `Connected to ${address.substring(0, 6)}...${address.substring(38)}`,
      });
    } catch (error) {
      toast({
        title: "Connection failed",
        description: "Failed to connect wallet",
        variant: "destructive",
      });
    }
  };

  const mintIPNFT = async () => {
    if (!formData.title || !formData.description || !formData.researchField || !uploadedFileHash) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields and upload a file",
        variant: "destructive",
      });
      return;
    }

    if (!web3.isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to mint IP-NFT",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Create metadata for the NFT
      const metadata = {
        name: formData.title,
        description: formData.description,
        image: uploadedFileHash, // IPFS hash of the main file
        attributes: [
          { trait_type: "Research Field", value: formData.researchField },
          { trait_type: "Open Source", value: formData.isOpenSource },
          { trait_type: "Collaborators", value: formData.collaborators.length },
          { trait_type: "Creator", value: web3.address }
        ]
      };

      // In production, this metadata would also be uploaded to IPFS
      const tokenURI = `ipfs://${uploadedFileHash}/metadata.json`;

      const mintParams = {
        title: formData.title,
        description: formData.description,
        researchField: formData.researchField,
        ipfsHash: uploadedFileHash,
        isOpenSource: formData.isOpenSource,
        collaborators: formData.collaborators.map(c => c.name).filter(name => name.trim()),
        tokenURI: tokenURI
      };
      
      const tokenId = await web3.mintIPNFT(mintParams);
      setMintedTokenId(tokenId);
      
      toast({
        title: "IP-NFT minted successfully!",
        description: `Token ID: ${tokenId}. Fee processed through BUFeeRouter.sol`,
      });
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        researchField: "",
        isOpenSource: false,
        collaborators: [],
        file: null
      });
      setUploadedFileHash("");
      
    } catch (error) {
      toast({
        title: "Minting failed",
        description: error instanceof Error ? error.message : "Failed to mint IP-NFT. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-charcoal mb-4">Mint IP-NFT</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create an NFT for your intellectual property with integrated fee routing through BUFeeRouter.sol
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Minting Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-bitcoin-orange" />
                  IP-NFT Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter your IP title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your intellectual property"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                </div>

                {/* Research Field */}
                <div className="space-y-2">
                  <Label htmlFor="researchField">Research Field *</Label>
                  <Select 
                    value={formData.researchField} 
                    onValueChange={(value) => handleInputChange('researchField', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select research field" />
                    </SelectTrigger>
                    <SelectContent>
                      {researchFields.map((field) => (
                        <SelectItem key={field} value={field}>
                          {field}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <Label htmlFor="file">Research Data/Files *</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    {uploadedFileHash ? (
                      <div className="space-y-2">
                        <CheckCircle className="w-8 h-8 text-green-500 mx-auto" />
                        <p className="text-sm text-gray-600">File uploaded successfully</p>
                        <p className="text-xs text-gray-500 font-mono break-all">
                          IPFS: {uploadedFileHash}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                        <div>
                          <Button
                            variant="outline"
                            disabled={isUploading}
                            onClick={() => document.getElementById('file-upload')?.click()}
                          >
                            {isUploading ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Uploading to IPFS...
                              </>
                            ) : (
                              <>
                                <Upload className="w-4 h-4 mr-2" />
                                Upload Files
                              </>
                            )}
                          </Button>
                          <input
                            id="file-upload"
                            type="file"
                            className="hidden"
                            onChange={handleFileUpload}
                            accept=".pdf,.doc,.docx,.zip,.tar.gz"
                          />
                        </div>
                        <p className="text-xs text-gray-500">
                          PDF, DOC, ZIP files up to 100MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Open Source Toggle */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="openSource"
                    checked={formData.isOpenSource}
                    onCheckedChange={(checked) => handleInputChange('isOpenSource', !!checked)}
                  />
                  <Label htmlFor="openSource" className="flex items-center cursor-pointer">
                    {formData.isOpenSource ? (
                      <Globe className="w-4 h-4 mr-2 text-green-600" />
                    ) : (
                      <Lock className="w-4 h-4 mr-2 text-gray-600" />
                    )}
                    Make this IP open source
                  </Label>
                </div>

                {/* Collaborators */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Collaborators</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addCollaborator}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Collaborator
                    </Button>
                  </div>
                  
                  {formData.collaborators.map((collaborator) => (
                    <div key={collaborator.id} className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Collaborator name or address"
                        value={collaborator.name}
                        onChange={(e) => updateCollaborator(collaborator.id, e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCollaborator(collaborator.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Wallet & Fees */}
          <div className="space-y-6">
            {/* Wallet Connection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wallet className="w-5 h-5 mr-2 text-bitcoin-orange" />
                  Wallet
                </CardTitle>
              </CardHeader>
              <CardContent>
                {web3.isConnected ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-600">Connected</span>
                    </div>
                    <p className="text-xs text-gray-500 font-mono break-all">
                      {web3.address}
                    </p>
                    <div className="text-xs text-gray-600">
                      Balance: {web3.balance}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={web3.disconnectWallet}
                      className="w-full"
                    >
                      Disconnect
                    </Button>
                  </div>
                ) : (
                  <Button onClick={handleConnectWallet} className="w-full">
                    <Wallet className="w-4 h-4 mr-2" />
                    Connect Wallet
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Fee Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Fee Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Minting Fee</span>
                  <span>{costBreakdown.baseFee.toFixed(4)} ETH</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Platform Fee (1%)</span>
                  <span>{costBreakdown.platformFee.toFixed(4)} ETH</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total Cost</span>
                    <span>{costBreakdown.totalCost.toFixed(4)} ETH</span>
                  </div>
                </div>
                
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    All transactions processed through BUFeeRouter.sol with 1% platform fee
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Mint Button */}
            <Button
              onClick={mintIPNFT}
              disabled={web3.isTransacting || !web3.isConnected || !uploadedFileHash}
              className="w-full bg-bitcoin-orange hover:bg-orange-600"
              size="lg"
            >
              {web3.isTransacting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Minting IP-NFT...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Mint IP-NFT
                </>
              )}
            </Button>

            {/* Success Message with Token ID */}
            {mintedTokenId && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <div className="font-semibold">IP-NFT Minted Successfully!</div>
                  <div className="text-sm mt-1">
                    Token ID: {mintedTokenId}
                  </div>
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 h-auto text-green-700 hover:text-green-800"
                    onClick={() => window.open(`https://etherscan.io/token/${web3.contractAddresses.ipnft}?a=${mintedTokenId}`, '_blank')}
                  >
                    View on Etherscan
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {/* Status Badges */}
            <div className="space-y-2">
              {formData.isOpenSource && (
                <Badge variant="outline" className="w-full justify-center border-green-500 text-green-700">
                  <Globe className="w-3 h-3 mr-1" />
                  Open Source
                </Badge>
              )}
              {formData.collaborators.length > 0 && (
                <Badge variant="outline" className="w-full justify-center">
                  <Users className="w-3 h-3 mr-1" />
                  {formData.collaborators.length} Collaborators
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}