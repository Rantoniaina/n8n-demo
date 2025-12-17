# Technology Watch Workflow - Usage Guide

## Overview

This n8n workflow aggregates technology news and articles from multiple sources for your technology domains:

- AI (Artificial Intelligence, Machine Learning)
- Java
- Spring Boot
- ReactJS
- TypeScript
- Team Management
- Project Management
- GraphQL
- Retail Technology

## Features

- **Manual Trigger**: Run manually every Monday (or whenever you want)
- **Multiple Sources**:
  - Reddit (r/programming, r/java, r/reactjs, r/graphql)
  - HackerNews (top stories)
  - Dev.to (top articles)
  - Official Blog RSS/Atom Feeds:
    - React Blog (react.dev/blog/rss.xml)
    - Spring Blog (spring.io/blog.atom)
    - GraphQL Blog (graphql.org/blog/feed.xml)
- **Smart Categorization**: Automatically categorizes articles by your technology domains
- **AI-Powered Selection**: Uses AI to intelligently analyze and select the top 5 most pertinent articles from all sources
- **Single Email Delivery**: Collects all articles first, then sends ONE email with the top 5 selected articles
- **LinkedIn Post Ideas**: Generates 5 ready-to-use LinkedIn post ideas for each of the top 5 articles
- **Formatted Reports**: Generates both human-readable text and JSON reports with relevance scores
- **File Output**: Saves reports with date stamps
- **Email Delivery**: Automatically sends the formatted report with LinkedIn post ideas via email

## How to Import

1. Open your n8n instance
2. Click on "Workflows" → "Import from File"
3. Select `tech-watch-workflow.json`
4. The workflow will be imported with all nodes configured

## How to Use

1. **Configure Email** (First Time Only):

   - Set up email credentials in n8n (Settings → Credentials → Add Email credentials)
   - Configure the "Send Email Report" node with your email provider (SMTP, Gmail, etc.)
   - Set environment variables or update the node:
     - `EMAIL_FROM`: Your sender email address
     - `EMAIL_TO`: Your recipient email address (where you want to receive reports)

2. **Manual Execution**: Click the "Execute Workflow" button (or use the play button)

3. **Wait for Completion**: The workflow will:

   - Fetch articles from all sources
   - Categorize them by your technology domains
   - Rank articles by relevance
   - Generate formatted reports
   - Save files to your n8n data directory
   - **Send the report via email**

4. **View Results**:
   - **Check your email** for the formatted report
   - Check the output of "Format Report" node for the formatted text
   - Check saved files: `tech-watch-YYYY-MM-DD.txt` and `tech-watch-YYYY-MM-DD.json`

## AI Configuration

### Free AI Options Available

The workflow supports multiple AI providers, including **FREE options**:

1. **Hugging Face (FREE - Default)** ⭐ Recommended for free use

   - No API key required for basic use (rate limited)
   - Free tier available
   - Uses Mistral-7B-Instruct model
   - Get free API key at: https://huggingface.co/settings/tokens (optional, for higher rate limits)

2. **Groq (FREE Tier)**

   - Very fast inference
   - Free tier with generous limits
   - Get API key at: https://console.groq.com/
   - Set: `AI_PROVIDER=groq` and `GROQ_API_KEY=your-key`

3. **Google Gemini (FREE Tier)**

   - Free tier available
   - Get API key at: https://makersuite.google.com/app/apikey
   - Set: `AI_PROVIDER=gemini` and `GEMINI_API_KEY=your-key`

4. **OpenAI (Paid)**
   - Requires paid API key
   - Set: `AI_PROVIDER=openai` and `OPENAI_API_KEY=your-key`

### Setting Up (Default - Hugging Face FREE)

**No configuration needed!** The workflow uses Hugging Face by default, which works without an API key (with rate limits).

For better performance, optionally set:

```bash
HUGGINGFACE_API_KEY=your-free-key-here  # Get at https://huggingface.co/settings/tokens
```

### Setting Up Other Providers

If you want to use a different provider, set environment variables:

```bash
# Choose your provider
AI_PROVIDER=groq      # or: gemini, openai, huggingface (default)

# Provider-specific keys (only needed if not using default)
HUGGINGFACE_API_KEY=your-key  # Optional, for higher rate limits
GROQ_API_KEY=your-key         # Required if using Groq
GEMINI_API_KEY=your-key       # Required if using Gemini
OPENAI_API_KEY=your-key       # Required if using OpenAI

# Optional: Model selection
OPENAI_MODEL=gpt-4           # or gpt-3.5-turbo
GROQ_MODEL=mixtral-8x7b-32768
```

### Fallback Behavior

If the AI selection fails or the AI provider is unavailable, the workflow will:

- Use a fallback algorithm based on source quality and engagement metrics
- Still provide 5 articles, just selected by algorithm instead of AI
- Continue with LinkedIn post generation and email delivery

## Email Configuration

### Setting Up Email Credentials

The workflow uses n8n's Email Send node. You need to configure email credentials:

1. **In n8n UI**:

   - Go to Settings → Credentials
   - Add new credentials for your email provider:
     - **SMTP**: For generic SMTP servers (Gmail, Outlook, custom SMTP)
     - **Gmail OAuth2**: For Gmail accounts
     - **Microsoft OAuth2**: For Outlook/Office 365

2. **Configure the "Send Email Report" Node**:

   - Open the workflow
   - Click on "Send Email Report" node
   - Select your email credentials
   - Update email addresses:
     - `fromEmail`: Your sender email (or use `$env.EMAIL_FROM`)
     - `toEmail`: Your recipient email (or use `$env.EMAIL_TO`)

3. **Using Environment Variables** (Optional):
   ```bash
   # In your n8n environment or .env file
   EMAIL_FROM=your-email@example.com
   EMAIL_TO=your-email@example.com
   ```

### Email Format

The email includes:

- Formatted HTML report with all categories
- Relevance scores for each article
- Direct links to articles
- Clean, readable formatting

## Customization Options

### Add More Sources

You can add more HTTP Request nodes to fetch from:

- RSS feeds (use RSS Read node)
- GitHub Trending (GitHub API)
- Twitter/X (if you have API access)
- TechCrunch RSS
- Medium RSS

### Modify Topics

Edit the "Define Topics" Code node to:

- Add new technology domains
- Modify keywords for better matching
- Adjust categorization logic

### Change Output Format

Modify the "Format Report" Code node to:

- Change report format/style
- Add more metadata
- Customize the output structure

### Add Notifications

Add nodes after "Format Report" to:

- Send email notifications
- Post to Slack/Teams
- Send to Google Chat
- Save to database
- Post to a webhook

## Workflow Structure

```
Manual Trigger
    ↓
Define Topics (Code)
    ↓
┌─────────────────────────────────────┐
│  Parallel Data Fetching:            │
│  - Reddit r/programming             │
│  - Reddit r/java                    │
│  - Reddit r/reactjs                 │
│  - Reddit r/graphql                 │
│  - HackerNews Top Stories            │
│  - Dev.to Top Articles              │
│  - React Blog RSS                    │
│  - Spring Blog Atom                  │
│  - GraphQL Blog RSS                  │
└─────────────────────────────────────┘
    ↓
Process Data (Code nodes)
    ↓
Merge All Articles (Merge)
    ↓
Collect All Articles (Code)
    ↓
AI Select Top 5 (OpenAI)
    ↓
Parse AI Top 5 (Code)
    ↓
Extract Top 5 Articles (Code)
    ↓
Generate LinkedIn Post Ideas (Code)
    ↓
Format Report (Code)
    ↓
┌─────────────────────────────────────┐
│  Parallel Output:                   │
│  - Save Report to File              │
│  - Save JSON Data                   │
│  - Send Email Report                │
└─────────────────────────────────────┘
```

## Relevance Ranking System

The workflow uses an advanced scoring algorithm to rank articles by pertinence. Each article receives a relevance score based on:

### Scoring Factors

1. **Keyword Matches** (up to 20 points per match)

   - Title matches: +20 points (highest priority)
   - URL matches: +10 points
   - Description/tag matches: +5 points
   - Multiple keyword matches receive bonus points

2. **Source Quality** (up to 30 points)

   - Official blogs (React Blog, Spring Blog, GraphQL Blog): +30 points
   - HackerNews: +15 points
   - Dev.to: +10 points
   - Other sources: Base score only

3. **Engagement Metrics** (up to 30 points)

   - Article score (upvotes, reactions): +0.5 per point (capped at 20)
   - Comments: +0.1 per comment (capped at 10)

4. **Recency** (up to 25 points)
   - Published within 1 day: +25 points
   - Published within 3 days: +15 points
   - Published within 7 days: +10 points
   - Published within 14 days: +5 points
   - Older articles: No recency bonus

### Ranking Result

- Articles are sorted by relevance score (highest first)
- **Top 5 most pertinent articles** are selected per category
- Each article shows its relevance score in the report

## LinkedIn Post Ideas

The workflow automatically generates **5 ready-to-use LinkedIn post ideas** for each of the top 5 articles across all categories. Each article gets 5 different post variations:

### Post Types Generated

1. **Question Hook**: Engages audience with a question to start discussions
2. **Insight Post**: Highlights key insights and value from the article
3. **Personal Story**: Relatable personal experience format
4. **Quick Tip**: Concise summary format for quick engagement
5. **Discussion Starter**: Opens conversation about industry trends

### Features

- **Ready to Use**: Posts are formatted with proper hashtags and structure
- **Variety**: 5 different styles per article (25 total post ideas)
- **Contextual**: Posts are tailored to the article's category and content
- **Engagement Optimized**: Includes calls-to-action and discussion prompts

### Where to Find Them

LinkedIn post ideas are included in:

- **Email Report**: Beautifully formatted HTML section with all post ideas
- **Text Report**: Plain text format in the saved file
- **JSON Data**: Structured data for programmatic use

## Output Files

The workflow generates two files:

1. **tech-watch-YYYY-MM-DD.txt**: Human-readable formatted report with relevance scores
2. **tech-watch-YYYY-MM-DD.json**: Raw JSON data with relevance scores for further processing

## Troubleshooting

### No Articles Found

- Check internet connectivity
- Verify API endpoints are accessible
- Some sources may have rate limits

### HackerNews Fetching Takes Time

- The workflow fetches top 20 stories individually
- This is normal and may take 10-30 seconds
- Consider reducing the number of stories if needed

### Articles Not Categorized Correctly

- Edit keywords in "Define Topics" node
- Adjust matching logic in "Categorize Articles" node

## Future Enhancements

Consider adding:

- [ ] RSS feed reader for tech blogs
- [ ] GitHub trending repositories
- [ ] Email/Slack notifications
- [ ] Database storage for historical tracking
- [ ] Weekly summary comparison
- [ ] AI-powered article summarization
- [ ] Filter by date (last 7 days only)

## Notes

- The workflow is set to `"active": false` by default - activate it if you want scheduled runs
- For weekly automated runs, change "Manual Trigger" to "Schedule Trigger" with weekly recurrence
- File paths are relative to n8n's data directory
- All HTTP requests have error handling enabled to continue on failures
