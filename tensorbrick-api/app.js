const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3002;
const cors = require("cors");

// Middleware for JSON parsing

// Path to the JSON file
const dataFilePath = path.join(__dirname, "data.json");
app.use(cors());
// Read data from the JSON file
app.get("/data", (req, res) => {
  fs.readFile(dataFilePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.json(JSON.parse(data));
  });
});

app.get("/data/:name", (req, res) => {
  const nameToFind = req.params.name;

  fs.readFile(dataFilePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
      return;
    }

    const jsonData = JSON.parse(data);

    // Iterate through each entry to find by name
    const findByName = (name) => {
      for (const item of jsonData) {
        for (const subItem of item.list) {
          if (subItem.name === name) {
            return subItem; // Return the first matching item
          }
        }
      }
      return null; // No matching item found
    };
    const foundItem = findByName(nameToFind);
    if (!foundItem) {
      res.status(404).send("Data not found");
    } else {
      res.json(foundItem);
    }
  });
});

app.put("/data/:name", (req, res) => {
  const nameToUpdate = req.params.name;
  const newStatus = req.query.status; // Assuming you send the new status in the request body

  fs.readFile(dataFilePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
      return;
    }

    const jsonData = JSON.parse(data);

    // Update status for the item with the specified name
    jsonData.forEach((entry) => {
      entry.list.forEach((item) => {
        if (item.name === nameToUpdate) {
          item.status = parseInt(newStatus);
        }
      });
    });

    // Write the updated data back to the file
    fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
        return;
      }
      res.status(200).send("Status updated successfully");
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
