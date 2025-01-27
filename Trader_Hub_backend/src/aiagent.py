import cohere
from dotenv import load_dotenv
import os 

load_dotenv()

api_key = os.environ.get("COHERE_API_KEY")

co = cohere.ClientV2(api_key=api_key)

async def normal_chat(prompt: str):
    try:
        # Stream the response from Cohere
        res = co.chat(
            model="command-r-plus-08-2024",
            messages=[
                {
  "role": "system",
  "content": """Context: You are an expert trader in NFTs, NFT collections, and tokens.  
  Instructions:  
  - Generate a JSON response for a user query about NFTs, NFT collections, or tokens.  
  - Analyze the user's query and provide an in-depth, expert-level response.  
  - Include insights on market trends, liquidity, and potential investment opportunities.  
  - Provide an unbiased assessment of the pros and cons of the NFT collection or token.  
  - Suggest safe and recommended platforms where users can buy, sell, or trade these assets.  
  - Ensure the response is structured as a clean, informative JSON object.  

  Required JSON Structure:  
  {
    "collection_name": "string",
    "collection_description": "string",
    "market_trends": "string",
    "liquidity": "string",
    "overall_benefit": "string",
    "risks": ["string"],
    "recommended_marketplaces": [
        {
            "marketplace_name": "string",
            "marketplace_link": "string"
        }
    ],
    "alternative_collections": ["string"],
    "buy_recommendation": {
        "decision": "Buy / Hold / Avoid",
        "reasoning": "string"
    }
}

  """
}
,
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            response_format={"type": "json_object"}
        )
        
        return res.message.content[0].text
    except Exception as e:
        return f"Error generating response: {str(e)}"
    
async def structured_rag_output(prompt: str, documents: list):
    #print(documents)
    try:
        res = co.chat(
            model="command-r-plus-08-2024",
            documents=documents,
            messages=[
                {
  "role": "system",
  "content": """Context: You are an expert trader in NFTs, NFT collections, and tokens.  
  Instructions:  
  - Generate a JSON response for a user query about NFTs, NFT collections, or tokens.  
  - Analyze the user's query and provide an in-depth, expert-level response.  
  - Include insights on market trends, liquidity, and potential investment opportunities.  
  - Provide an unbiased assessment of the pros and cons of the NFT collection or token.  
  - Suggest safe and recommended platforms where users can buy, sell, or trade these assets.  
  - Ensure the response is structured as a clean, informative JSON object.  

  Required JSON Structure:  
 {
    "collection_name": "string",
    "collection_description": "string",
    "market_trends": "string",
    "liquidity": "string",
    "overall_benefit": "string",
    "risks": ["string"],
    "recommended_marketplaces": [
        {
            "marketplace_name": "string",
            "marketplace_link": "string"
        }
    ],
    "alternative_collections": ["string"],
    "buy_recommendation": {
        "decision": "Buy / Hold / Avoid",
        "reasoning": "string"
    }
}

  """
}
,
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            # response_format={"type": "json_object"}
        )
        print(res.message.content[0].text)
        return res.message.content[0].text
    except Exception as e:
        raise Exception(f"Error generating response: {str(e)}") 
    
