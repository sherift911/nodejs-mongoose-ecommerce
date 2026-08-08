const fs = require("fs");

const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;
  if (url === "/") {
    res.end(
      '<body><form action="/message" method="POST"><input type="text" name="username"></input><button type="submit">send</button></form></body>',
    );
  } else if (url === "/about") {
    res.end("<h1>welcome to about page</h1>");
  } else if (url === "/message" && method === "POST") {
    const body = [];
    req.on("data", (chunk) => {
      console.log(`from chunk ${chunk.toString()}`);
      body.push(chunk);
    });
    req.on("end", () => {
      const data = Buffer.concat(body).toString();
      console.log(`the final data is ${data}`);
      fs.writeFileSync("message.txt", data);
    });
    res.end("<h1>message received</h1>");
  } else {
    res.end("<h1>page not found</h1>");
  }
};

module.exports = requestHandler;
