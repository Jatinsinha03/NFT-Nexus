# NFT Nexus

NFT Nexus is a cutting-edge platform meticulously designed to cater to NFT enthusiasts and investors by offering a holistic suite of insights, analytics, and tools. With a focus on empowering users, NFT Nexus provides detailed metadata on NFT collections, in-depth market analysis, and advanced AI-powered predictions. Whether you are an investor seeking optimal opportunities or a collector ensuring the legitimacy of your NFTs, NFT Nexus delivers the data and tools you need to navigate the dynamic NFT ecosystem with confidence.

---

## Demo
- Website Link - [Link](https://nft-nexus-1.onrender.com/)
- Youtube Video Link - [Link](https://youtu.be/ec8qRhXDHWA)

## Tech Stack

**Client:** React, Redux, Vanilla CSS

**Server:** Node, Express

**Database:** MongoDB

**Model Used:** Random Forest 

**Dataset Used For training the model:** [Dataset of 1000 NFTs](https://docs.google.com/spreadsheets/d/1wajPcADmAW1-iE6GZfyo5V4UhSATcqsetpZEyrM42G8/edit?usp=sharing)

**APIs Used:**
- NFT Collection MetaData API
- Collection Analytics API
- NFT Token Price Estimate API
- NFT Marketplace Analytics API
- NFT Marketplace Holders API
- NFT Marketplace Traders API
- NFT Marketplace Wash Trades API
- NFT Transactions API
- NFT portfolio API
- ERC20 portfolio
- Find Similar Image


## Features

### 1. **Explore and Analyze NFT Collections**
- View detailed metadata for NFT collections.
- Track key metrics like volume trends and transaction patterns.
- Predict price estimates using advanced analytics.

### 2. **Favorite Collections**
- Add or remove NFT collections in your favorites section for quick access.

### 3. **Marketplace Analysis**
- Assess whether the NFT marketplace is risk-free or not.

- **Risk Score Analysis**:
  - Analyzes trading volume, sales, and transaction trends.
  - Detects wash trading activities (fraudulent transactions).
  - Evaluates trader behavior, such as buyer-seller ratios and activity patterns.
  - Categorizes marketplaces into low, medium, or high risk levels.
  - Example: 
    - Low sales + high seller activity = Medium risk (caution advised).
    - Absence of wash trades = Increased transparency.


### 4. **Top NFT Collections**
- Discover the top-performing NFTs in the marketplace.
- Filter results by time periods such as the last 24 hours or last 7 days, last 30 days or all.

### 5. **ERC20 and NFT Portfolio Management**
- View your ERC20 token portfolio and NFT token portfolio directly in the profile section.

### 6. **NFT Similarity Checker**
- Avoid copyright issues or verify the legitimacy of an NFT by checking its similarity to existing NFTs.

### 7. **Real-Time Notifications and Alerts**
- Stay informed with updates on:
  - Price changes.
  - Significant wallet activities.
  - Market trends.

### 8. **AI Models for Advanced Insights**
- **Investment Risk Analysis**:
  - Powered by an AI model trained on 1,000 NFT collection profiles.
  - Assesses risk based on:
    - Loss-making trades.
    - Average loss-making trades.
    - Trade percentage.
    - Loss-making volume.
    - Diamond hands.
    - Liquidity score.
- **Collection Anomaly Analysis**:
  - Detects patterns of potential fraud or suspicious activity.
  - Evaluates:
    - Washtrade index.
    - Zero-profit trades.
    - Loss-making volume.
    - Other behavioral indicators.

### 9. **Built with bitsCrunch APIs**
- All functionalities leverage the powerful and reliable bitsCrunch APIs, ensuring data accuracy and seamless integration.

---

### About the Dataset

This dataset was generated using the BitsCrunch API to provide insights and analytics for 1000 NFT collections. It focuses on metrics related to collection performance, trading activity, and market dynamics, enabling comprehensive analysis of the NFT ecosystem.

#### Dataset Generation Process:
1. **Collection Retrieval:**
   - The `Collection by Chain API` was used to retrieve a dataset of 1000 NFT collections, including their contract addresses and names.
   
2. **Profile Data Enrichment:**
   - The `Collection Profile API` was utilized to fetch detailed metrics for each collection, including performance scores, trading activity, liquidity, and sentiment.

3. **Data Cleaning and Structuring:**
   - The retrieved data was cleaned to ensure consistency and completeness.
   - The data was structured into an Excel file format, where each row represents an NFT collection and each column provides a specific attribute or metric.

#### Key Features in the Dataset:
- **Collection Details:**
  - `contract_address`: The unique contract address of the NFT collection.
  - `collection_name`: The name of each NFT collection.
  - `blockchain`: The blockchain platform where the collection exists (e.g., Ethereum).
  - `chain_id`: The identifier of the blockchain network.

- **Performance Metrics:**
  - `collection_score`: A score representing the overall performance of the collection.
  - `token_distribution_score`: A score indicating the distribution of tokens within the collection.
  - `metadata_score`: A score evaluating the quality of the metadata for the collection.
  - `holder_metrics_score`: A score based on the holding patterns of users.

- **Trading Metrics:**
  - `profitable_trades`: The total number of profitable trades.
  - `loss_making_trades`: The total number of loss-making trades.
  - `profitable_trades_percentage`: The percentage of trades that were profitable.
  - `loss_making_trades_percentage`: The percentage of trades that resulted in a loss.
  - `zero_profit_trades`: The number of trades with zero profit.

- **Volume Metrics:**
  - `profitable_volume`: The total volume of profitable trades.
  - `loss_making_volume`: The total volume of loss-making trades.

- **Market Dynamics:**
  - `fear_and_greed_index`: An index representing market sentiment for the collection.
  - `washtrade_index`: An index indicating the presence of wash trading activity.
  - `market_dominance_score`: A score representing the market dominance of the collection.

- **Investor Behavior:**
  - `diamond_hands`: The metric reflecting long-term holders in the collection.
  - `liquidity_score`: A score representing the liquidity of the collection.

This dataset provides a robust foundation for data-driven insights, enabling visualization, statistical analysis, and machine learning applications related to NFT collections. It is particularly valuable for understanding market trends, evaluating collection performance, and detecting manipulative trading activities in the NFT space.

---

## Getting Started

1. **Sign Up or Log In**: Create your account to access the platform.
2. **Connect Your Wallet**: Securely connect your wallet to view your token and NFT portfolio.
3. **Explore and Analyze**: Navigate through collections, perform marketplace analysis, and track your favorite NFTs.
4. **Use AI Insights**: Leverage AI-powered tools for investment risk and anomaly analysis.
5. **Stay Updated**: Enable notifications for real-time alerts on market trends and activities.

---

## Examples of Use Cases

- **Risk-Free Trading**: Use marketplace analysis to identify safe trading platforms.
- **Portfolio Management**: Track your ERC20 and NFT token holdings efficiently.
- **Copyright Verification**: Avoid purchasing counterfeit NFTs with the similarity checker.
- **Investment Decisions**: Analyze collections with AI-powered risk and anomaly assessments.

---

## License

NFT Nexus is licensed under [MIT License](LICENSE).

---


