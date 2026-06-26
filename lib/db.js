const {createClient} = require('@libsql/client')

// TODO: Create a client connection here using TURSO_URL and TURSO_AUTH_TOKEN
const turso = createClient({
    url: "file:local.db",
    syncUrl: process.env.TURSO_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
    syncInterval: 60000,
});

// TODO: Write an async function insertArticle(article)
// It should take an article object like:
// { title, summary, source, url, published_date, category }
// And insert it into the articles table using client.execute()
async function insertArticle(article) {
    try{
            await turso.execute({
            sql: "INSERT INTO articles(title, summary, source, url, published_date, category) VALUES(?,?,?,?,?,?)",
            args: [article.title, article.summary, article.source, article.url, article.published_date, article.category],
        });
    } catch (error) {
        if (error.message.includes('UNIQUE constraint')) {
            console.log(`Article already exists: ${article.url}`);
        }else {
            throw error;
        }
    }
}

module.exports = {insertArticle}; 

// TODO: Export the function so other files can use it