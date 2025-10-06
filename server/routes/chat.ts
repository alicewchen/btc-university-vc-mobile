import { Router } from 'express';
import { z } from 'zod';

interface PerplexityResponse {
  id: string;
  model: string;
  object: string;
  created: number;
  choices: Array<{
    index: number;
    finish_reason: string;
    message: {
      role: string;
      content: string;
    };
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

const router = Router();

// Schema for chat requests
const chatRequestSchema = z.object({
  message: z.string().min(1).max(1000),
  context: z.object({
    availableDAOs: z.array(z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      category: z.string(),
      status: z.string(),
      fundingGoal: z.number(),
      fundingRaised: z.number(),
      memberCount: z.number(),
      tags: z.array(z.string())
    }))
  }).optional()
});

router.post('/chat', async (req, res) => {
  try {
    const { message, context } = chatRequestSchema.parse(req.body);
    
    // Try Perplexity API first, then fallback to intelligent responses
    let aiResponse: string;
    let suggestions: string[];
    
    try {
      const perplexityResponse = await callPerplexityAPI(message, context?.availableDAOs || []);
      aiResponse = perplexityResponse.response;
      suggestions = generateSuggestions(message, context?.availableDAOs || []);
    } catch (perplexityError) {
      console.warn('Perplexity API failed, using fallback:', perplexityError);
      // Use intelligent fallback system
      aiResponse = generateFallbackResponse(message, context?.availableDAOs || []);
      suggestions = generateSuggestions(message, context?.availableDAOs || []);
    }
    
    res.json({
      response: aiResponse,
      suggestions: suggestions
    });

  } catch (error) {
    console.error('Chat API error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Invalid request format',
        details: error.errors 
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to process chat request' 
    });
  }
});

// Generate intelligent fallback responses based on user query and available DAOs
function generateFallbackResponse(query: string, availableDAOs: any[]): string {
  const lowercaseQuery = query.toLowerCase();
  
  // Climate science queries
  if (lowercaseQuery.includes('climate') || lowercaseQuery.includes('environment') || lowercaseQuery.includes('carbon')) {
    const climateDAOs = availableDAOs.filter(dao => 
      dao.category.includes('Climate') || 
      dao.tags.some((tag: string) => tag.toLowerCase().includes('climate') || tag.toLowerCase().includes('environment'))
    );
    
    if (climateDAOs.length > 0) {
      return `I found ${climateDAOs.length} climate science DAO${climateDAOs.length > 1 ? 's' : ''}:\n\n${climateDAOs.map(dao => 
        `🌍 **${dao.name}** - ${dao.description}\n• Status: ${dao.status}\n• Members: ${dao.memberCount}\n• Funding: $${dao.fundingRaised.toLocaleString()}/$${dao.fundingGoal.toLocaleString()}`
      ).join('\n\n')}\n\nThese DAOs are working on cutting-edge climate research and would welcome new contributors!`;
    }
    return "Climate science is crucial for our future! While I don't see specific climate DAOs in the current results, try searching for 'Conservation Technology' or 'Climate Science' categories to find relevant research opportunities.";
  }
  
  // AI/ML queries
  if (lowercaseQuery.includes('ai') || lowercaseQuery.includes('artificial intelligence') || lowercaseQuery.includes('machine learning')) {
    const aiDAOs = availableDAOs.filter(dao => 
      dao.category.includes('AI') || dao.category.includes('Biotechnology') ||
      dao.tags.some((tag: string) => tag.toLowerCase().includes('ai') || tag.toLowerCase().includes('machine learning'))
    );
    
    if (aiDAOs.length > 0) {
      return `Found ${aiDAOs.length} AI research DAO${aiDAOs.length > 1 ? 's' : ''}:\n\n${aiDAOs.map(dao => 
        `🤖 **${dao.name}** - ${dao.description}\n• Status: ${dao.status}\n• Members: ${dao.memberCount}\n• Category: ${dao.category}`
      ).join('\n\n')}\n\nAI research DAOs are at the forefront of technological innovation!`;
    }
    return "AI research is rapidly evolving! Look for DAOs in Biotechnology, Quantum Computing, or Conservation Technology categories as they often incorporate AI/ML components.";
  }
  
  // Quantum computing queries
  if (lowercaseQuery.includes('quantum')) {
    const quantumDAOs = availableDAOs.filter(dao => 
      dao.category.includes('Quantum') ||
      dao.tags.some((tag: string) => tag.toLowerCase().includes('quantum'))
    );
    
    if (quantumDAOs.length > 0) {
      return `Found ${quantumDAOs.length} quantum computing DAO${quantumDAOs.length > 1 ? 's' : ''}:\n\n${quantumDAOs.map(dao => 
        `⚛️ **${dao.name}** - ${dao.description}\n• Status: ${dao.status}\n• Members: ${dao.memberCount}\n• Focus: ${dao.tags.join(', ')}`
      ).join('\n\n')}\n\nQuantum research is the future of computing and cryptography!`;
    }
    return "Quantum computing is an exciting field! Search for 'Quantum Computing' category or look for DAOs working on cryptography and advanced computing.";
  }
  
  // Indigenous knowledge queries
  if (lowercaseQuery.includes('indigenous') || lowercaseQuery.includes('traditional')) {
    const indigenousDAOs = availableDAOs.filter(dao => 
      dao.category.includes('Indigenous') ||
      dao.tags.some((tag: string) => tag.toLowerCase().includes('indigenous') || tag.toLowerCase().includes('traditional'))
    );
    
    if (indigenousDAOs.length > 0) {
      return `Found ${indigenousDAOs.length} Indigenous knowledge DAO${indigenousDAOs.length > 1 ? 's' : ''}:\n\n${indigenousDAOs.map(dao => 
        `🏛️ **${dao.name}** - ${dao.description}\n• Status: ${dao.status}\n• Members: ${dao.memberCount}\n• Focus: Preserving and advancing traditional knowledge`
      ).join('\n\n')}\n\nThese DAOs honor traditional wisdom while advancing modern research.`;
    }
    return "Indigenous knowledge systems offer invaluable insights! Look for 'Indigenous Knowledge' category DAOs that focus on traditional ecological wisdom and cultural preservation.";
  }
  
  // Funding queries
  if (lowercaseQuery.includes('funding') || lowercaseQuery.includes('investment') || lowercaseQuery.includes('money')) {
    const fundingDAOs = availableDAOs.filter(dao => dao.status === 'Funding');
    const activeDAOs = availableDAOs.filter(dao => dao.status === 'Active');
    
    if (fundingDAOs.length > 0) {
      return `${fundingDAOs.length} DAOs are currently seeking funding:\n\n${fundingDAOs.map(dao => 
        `💰 **${dao.name}**\n• Category: ${dao.category}\n• Progress: $${dao.fundingRaised.toLocaleString()}/$${dao.fundingGoal.toLocaleString()} (${Math.round((dao.fundingRaised/dao.fundingGoal)*100)}%)\n• Members: ${dao.memberCount}`
      ).join('\n\n')}\n\n${activeDAOs.length > 0 ? `Additionally, ${activeDAOs.length} active DAOs may have ongoing funding opportunities.` : ''}`;
    }
    return "Most research DAOs welcome funding! Active DAOs often have treasury systems where you can contribute. Check individual DAO pages for specific funding mechanisms.";
  }
  
  // Join/participate queries
  if (lowercaseQuery.includes('join') || lowercaseQuery.includes('participate') || lowercaseQuery.includes('contribute')) {
    const activeDAOs = availableDAOs.filter(dao => dao.status === 'Active');
    
    if (activeDAOs.length > 0) {
      return `${activeDAOs.length} active DAOs are welcoming new members:\n\n${activeDAOs.slice(0, 3).map(dao => 
        `✨ **${dao.name}**\n• Category: ${dao.category}\n• Current Members: ${dao.memberCount}\n• How to help: ${dao.description.split('.')[0]}`
      ).join('\n\n')}\n\n${activeDAOs.length > 3 ? `...and ${activeDAOs.length - 3} more! ` : ''}Most DAOs welcome contributors with various skills - research, development, governance, and community building.`;
    }
    return "Great enthusiasm! Active DAOs typically welcome new members. Look for DAOs with 'Active' status and explore their governance systems to get involved.";
  }
  
  // General queries
  if (lowercaseQuery.includes('what') || lowercaseQuery.includes('how') || lowercaseQuery.includes('help')) {
    const totalDAOs = availableDAOs.length;
    const categories = Array.from(new Set(availableDAOs.map(dao => dao.category)));
    
    return `Welcome to the Research DAO platform! Here's what's available:\n\n📊 **${totalDAOs} Research DAOs** across ${categories.length} categories:\n• ${categories.join('\n• ')}\n\n🔍 **How to explore:**\n• Use the search bar to find specific topics\n• Filter by category, status, or funding level\n• Click on any DAO to learn more about joining\n\n💡 **Need help?** Ask me about specific research areas like "climate science," "quantum computing," or "AI research"!`;
  }
  
  // Default response
  const randomDAO = availableDAOs[Math.floor(Math.random() * availableDAOs.length)];
  if (randomDAO) {
    return `I found ${availableDAOs.length} research DAOs for you! Here's a highlighted project:\n\n🔬 **${randomDAO.name}**\n${randomDAO.description}\n\n• Category: ${randomDAO.category}\n• Status: ${randomDAO.status}\n• Members: ${randomDAO.memberCount}\n\nTry asking me about specific research areas like "climate science," "quantum computing," or "AI research" for more targeted recommendations!`;
  }
  
  return "Welcome! I'm here to help you discover amazing research DAOs. Try asking about specific topics like 'climate science,' 'AI research,' or 'quantum computing' to find relevant projects!";
}

// Generate smart suggestions based on user query and available DAOs
function generateSuggestions(query: string, availableDAOs: any[]) {
  const lowercaseQuery = query.toLowerCase();
  const suggestions = [];

  // Category-based suggestions
  if (lowercaseQuery.includes('climate') || lowercaseQuery.includes('environment')) {
    suggestions.push('Show me climate science DAOs');
    suggestions.push('Find carbon tracking projects');
  }
  
  if (lowercaseQuery.includes('ai') || lowercaseQuery.includes('artificial intelligence')) {
    suggestions.push('List AI research DAOs');
    suggestions.push('Show machine learning projects');
  }
  
  if (lowercaseQuery.includes('quantum')) {
    suggestions.push('Find quantum computing DAOs');
    suggestions.push('Show cryptography projects');
  }
  
  if (lowercaseQuery.includes('biotech') || lowercaseQuery.includes('biology')) {
    suggestions.push('Show biotechnology DAOs');
    suggestions.push('Find drug discovery projects');
  }

  // Status-based suggestions
  if (lowercaseQuery.includes('join') || lowercaseQuery.includes('participate')) {
    suggestions.push('Which DAOs are actively recruiting?');
    suggestions.push('Show me DAOs I can join today');
  }

  // Funding-based suggestions
  if (lowercaseQuery.includes('funding') || lowercaseQuery.includes('investment')) {
    suggestions.push('Which DAOs need funding?');
    suggestions.push('Show high-impact investment opportunities');
  }

  // Default suggestions if no specific matches
  if (suggestions.length === 0) {
    suggestions.push('Show me active research DAOs');
    suggestions.push('What are the most popular DAOs?');
    suggestions.push('Help me find a DAO to join');
  }

  return suggestions.slice(0, 3); // Return max 3 suggestions
}

// Call Perplexity API for intelligent DAO discovery responses
async function callPerplexityAPI(userMessage: string, availableDAOs: any[]): Promise<{ response: string }> {
  const apiKey = process.env.PERPLEXITY_API_KEY;
  if (!apiKey) {
    throw new Error('PERPLEXITY_API_KEY not configured');
  }

  // Build context about available DAOs for the AI
  const daoContext = availableDAOs.length > 0 ? 
    `\n\nAvailable Research DAOs:\n${availableDAOs.map(dao => 
      `- ${dao.name} (${dao.category}): ${dao.description} [Status: ${dao.status}, Members: ${dao.memberCount}, Funding: $${dao.fundingRaised.toLocaleString()}/$${dao.fundingGoal.toLocaleString()}]`
    ).join('\n')}` : '';

  const systemPrompt = `You are an AI assistant for the Ethereum Nature Reserve Research DAO Discovery Platform. Help users find and understand research DAOs (Decentralized Autonomous Organizations) focused on climate science, conservation technology, quantum computing, biotechnology, and other cutting-edge research areas.

Guidelines:
- Be helpful, informative, and enthusiastic about research collaboration
- Focus on matching users with relevant DAOs based on their interests
- Explain DAO concepts simply for newcomers
- Encourage participation in decentralized research
- Keep responses concise but informative (max 200 words)
- Use emojis sparingly and appropriately${daoContext}`;

  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3.1-sonar-small-128k-online',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: userMessage
        }
      ],
      max_tokens: 300,
      temperature: 0.7,
      top_p: 0.9,
      return_images: false,
      return_related_questions: false,
      search_recency_filter: 'month',
      stream: false,
      presence_penalty: 0,
      frequency_penalty: 0.1
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Perplexity API error: ${response.status} - ${errorText}`);
  }

  const data: PerplexityResponse = await response.json();
  
  if (!data.choices || data.choices.length === 0) {
    throw new Error('No response from Perplexity API');
  }

  return {
    response: data.choices[0].message.content
  };
}

export default router;