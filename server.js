const http = require('http');

const server = http.createServer((req, res) => {
	res.setHeader("Content-Type", "text/html");
	res.write("<h1>Hello World</h1>");
	res.write("<p>This is a Node demo</p>");
	res.end();
});

const PORT = 3000;

server.listen(PORT, () => {
	console.log(`listening on ${PORT}`);
})