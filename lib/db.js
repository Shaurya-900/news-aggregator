// import
const {createClient} = require('@libsql/client')

// turso client connection
const turso = createClient({
    url: "file:local.db",
    syncUrl: process.env.TURSO_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
    syncInterval: 60000,
});

//insert function 
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
// function export
module.exports = {insertArticle}; 

