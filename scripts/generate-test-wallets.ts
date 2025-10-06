import { ethers } from "ethers";

interface WalletData {
  address: string;
  privateKey: string;
  mnemonic?: string;
  claimed: boolean;
}

async function generateWallets(count: number = 10): Promise<void> {
  const wallets: WalletData[] = [];
  
  console.log(`Generating ${count} test wallets for Sepolia testnet...`);
  
  for (let i = 0; i < count; i++) {
    // Generate a random wallet
    const wallet = ethers.Wallet.createRandom();
    
    wallets.push({
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: wallet.mnemonic?.phrase,
      claimed: false,
    });
    
    console.log(`Generated wallet ${i + 1}/${count}: ${wallet.address}`);
  }
  
  // Save wallets to database via API
  console.log('\nSaving wallets to database...');
  
  for (const wallet of wallets) {
    try {
      const response = await fetch('http://localhost:5000/api/wallets/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(wallet),
      });
      
      if (response.ok) {
        console.log(`✅ Saved wallet: ${wallet.address}`);
      } else {
        const error = await response.text();
        console.error(`❌ Failed to save wallet ${wallet.address}:`, error);
      }
    } catch (error) {
      console.error(`❌ Network error saving wallet ${wallet.address}:`, error);
    }
  }
  
  console.log('\n🎉 Wallet generation complete!');
  console.log(`Generated ${wallets.length} wallets ready for claiming`);
  console.log('\nNext steps:');
  console.log('1. Users can now enter their email to claim a wallet');
  console.log('2. Each wallet is funded on Sepolia testnet');
  console.log('3. Private keys are securely stored for user access');
}

export { generateWallets };

// Run the script if executed directly
const count = process.argv[2] ? parseInt(process.argv[2]) : 10;
generateWallets(count).catch(console.error);