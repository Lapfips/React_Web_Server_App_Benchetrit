const http = require("http");
const path = require("path");
const fs = require("fs");
const fsPromises = require("fs").promises;
const EventEmitter = require("events");

// Imports logEvents function
const logEvents = require("./logEvents");

// Extends the EventEmitter class to use it
class Emitter extends EventEmitter {}

// Initializes an Emitter
const myEmitter = new Emitter();

// Listens on log emission to write it on a specific log file
myEmitter.on("log", (msg, fileName) => logEvents(msg, fileName));

// Initializes the server PORT either 3500 or a specified in the process.env file
const PORT = process.env.PORT || 3500;

// Function that servers the user for the content he asked
const serveFile = async (filePath, contentType, response) => {
  try {
    // Reads the file given based on the contentType to check if it's an image or a text
    const rawData = await fsPromises.readFile(
      filePath,
      !contentType.includes("image") ? "utf8" : ""
    );
    // Parses the data if its type is JSON to serve it
    const data =
      contentType === "application/json" ? JSON.parse(rawData) : rawData;
    // Sets the head status code and contendType based on the given filePath
    response.writeHead(filePath.includes("404.html") ? 404 : 200, {
      "Content-Type": contentType,
    });
    // Sends the response to the user by strigify the data if necessary
    response.end(
      contentType === "application/json" ? JSON.stringify(data) : data
    );
  } catch (err) {
    // Adds the error in the log file
    myEmitter.emit("log", `${err.name}: ${err.message}`, "errLog.txt");
    // Sets statusCode to a Server Error with 500
    response.statusCode = 500;
    // Sends the respond to the user
    response.end();
  }
};

// Fonction that handle users requests and responses to give them asked files
const server = http.createServer((req, res) => {
  // Add the request informations to the requests log file
  myEmitter.emit("log", `${req.url}\t${req.method}`, "reqLog.txt");

  // Sets the extension to the file extension aked by the user
  const extension = path.extname(req.url);

  // Initalizes a contentType variable that will handle the head contentType based on the asked file
  let contentType;

  // Sets contentType based on the file extension asked
  switch (extension) {
    case ".css":
      contentType = "text/css";
      break;
    case ".js":
      contentType = "text/javascript";
      break;
    case ".jsx":
      contentType = "text/javascript";
      break;
    case ".json":
      contentType = "application/json";
      break;
    case ".jpg":
      contentType = "image/jpeg";
      break;
    case ".png":
      contentType = "image/png";
      break;
    case ".txt":
      contentType = "text/plain";
      break;
    default:
      contentType = "text/html";
  }

  // Sets the right path to find the requested file
  let filePath =
    contentType === "text/html" && req.url === "/"
      ? path.join(__dirname, "views", "index.html")
      : contentType === "text/html" && req.url.slice(-1) === "/"
      ? path.join(__dirname, "views", req.url, "index.html")
      : contentType === "text/html"
      ? path.join(__dirname, "views", req.url)
      : path.join(__dirname, req.url);

  // Makes .html extension not required in the browser
  if (!extension && req.url.slice(-1) !== "/") filePath += ".html";

  // Checks if the requested file exists
  const fileExists = fs.existsSync(filePath);

  // Serves the file if it exists
  if (fileExists) {
    serveFile(filePath, contentType, res);
  } else {
    // Sends a page based on the filePath asked to redirect somewhere else then 404 not found page
    switch (path.parse(filePath).base) {
      // Sets the asked "old-page.html" to serves the "new-page.html" file instead
      case "old-page.html":
        res.writeHead(301, { Location: "/new-page.html" });
        res.end();
        break;
      // Sets the asked "www-page.html" to serves the basic page file instead
      case "www-page.html":
        res.writeHead(301, { Location: "/" });
        res.end();
        break;
      // Sets the error 404 not found page to serve it
      default:
        serveFile(path.join(__dirname, "views", "404.html"), "text/html", res);
    }
  }
});

// Starts listening on the PORT for user actions
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
