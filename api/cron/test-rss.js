const Parser = require('rss-parser');
const parser = new Parser();

const keywords = ['startup', 'funding', 'investment', 'founder', 'pitch'];
const rssUrls = [
    'https://feeds.techcrunch.com/techcrunch/startups/',
    'https://thestartupmag.com/feed',
    'https://startupdaily.net/feed',
    'https://eu-startups.com/feed',
    'https://ycombinator.com/blog/feed'
]

async function testFeed() {
    for ( const rssUrl of rssUrls){
        try{
            const feed = await parser.parseURL(rssUrl);
            console.log(`Feed title: ${feed.title}`);
            console.log(`Number of articles: ${feed.items.length}`);
            
            feed.items.forEach((item, index) => {
                const titleLower = item.title.toLowerCase();
                const isRelevant = keywords.some(keyword => titleLower.includes(keyword));
                if (isRelevant){
                    console.log(`${index + 1}. ${item.title}`);
                    console.log(`   Link: ${item.link}`);
                    console.log(`   Published: ${item.pubDate}`);
                    console.log(`   Summary: ${item.content ? item.content.substring(0, 150) : 'N/A'}...`);
                    console.log('');
                }
            });
        } catch (error) {
            console.error('Error fetching or parsing the feed:', error.message);
        }
    }
}

testFeed();