const Parser = require('rss-parser');
const {insertArticle} = require('../../lib/db');

const parser = new Parser();

//keywords array here
const keywords = ['startup', 'funding', 'investment', 'founder', 'pitch'];

//RSS feed URLs array here
const rssUrls = [
    'https://feeds.techcrunch.com/techcrunch/startups/',
    'https://thestartupmag.com/feed',
    'https://startupdaily.net/feed',
    'https://eu-startups.com/feed',
    'https://ycombinator.com/blog/feed'
]

module.exports = async function handler(req,res){
    for (const rssUrl of rssUrls){
        try{
            //TODO: Loop through each RSS feed URL
            const feed = await parser.parseURL(rssUrl);
            // TODO: For each feed, fetch and parse it
            console.log(`Feed title: ${feed.title}`);
            console.log(`Number of articles: ${feed.items.length}`);
            
            for (const item of feed.items) {
                const titleLower = item.title.toLowerCase();
                const isRelevant = keywords.some(keyword => titleLower.includes(keyword));
                if (isRelevant) {
                    const article = {
                        title: item.title,
                        summary: item.content ? item.content.substring(0, 300) : 'N/A',
                        source: feed.title,
                        url: item.link,
                        published_date: item.pubDate,
                        category: 'startup'
                    };
                    await insertArticle(article);
                }
            }
            
            console.log(`Success`)
        } catch (error) {
            console.error('Cron failed:', error);
            res.status(500).json({error: error.message});
        }
    } 
    res.status(200).json({message: "News fethced and stored"});
}
