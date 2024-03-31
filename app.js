const express = require("express");
const connectDB = require("./connection");
const {User,Author,Book}=require('./schemas');

const app = express();
const port = 4001;

connectDB();

// Route for "Active Users"
app.get('/active-users', async (req, res) => {
    try {
      const pipeline = [
        {
          $match: { isActive: true }
        },
        {
          $count: 'Active Users'
        }
      ];
  
      const result = await User.aggregate(pipeline);
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Route for "Average Age of Total Users"
  app.get('/avg-age', async (req, res) => {
    try {
      const pipeline = [
        {
          $group: {
            _id: null,  //If we pass null then all data will be under one document
            averageAge: { $avg: "$age" }
          }
        }
      ];
  
      const result = await User.aggregate(pipeline);
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Route for "List top 2 most common favourite fruits"
  app.get('/fav-fruits', async (req, res) => {
    try {
      const pipeline = [
        {
          $group: {
            _id: "$favoriteFruit",
            total: { $sum: 1 }
          }
        },
        {
          $sort: { total: -1 } // "-1" is for descending Order
        },
        {
          $limit: 2
        }
      ];
  
      const result = await User.aggregate(pipeline);
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  // Route for "Second Highest country having highest number of users"
app.get('/second-HighestUsersCountry', async (req, res) => {
    try {
      const pipeline = [
        {
          $group: {
            _id: "$company.location.country",
            Total_Users_in_Country: { $sum: 1 }
          }
        },
        {
          $sort: { Total_Users_in_Country: -1 }
        },
        {
          $skip: 1
        },
        {
          $limit: 1
        }
      ];
  
      const result = await User.aggregate(pipeline);
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  // Route for "Average Number of Tags per User"
app.get('/avg-tagsPerUser', async (req, res) => {
    try {
      const pipeline = [
        {
          $addFields: {
            noOfTags: { $size: { $ifNull: ["$tags", []] } }
          }
        },
        {
          $group: {
            _id: null,
            avgNoOfTags: { $avg: "$noOfTags" }
          }
        }
      ];
  
      const result = await User.aggregate(pipeline);
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  // Route for "How many users have 'enim' as one of their tags"
app.get('/includes-enim', async (req, res) => {
    try {
      const pipeline = [
        {
          $match: { tags: 'enim' }
        },
        {
          $count: 'usersWithEnimTags'
        }
      ];
  
      const result = await User.aggregate(pipeline);
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

  // Route for "Names and age of inactive users with 'velit' as one of their tags"
app.get('/inactive-withVelitTag', async (req, res) => {
    try {
      const pipeline = [
        {
          $match: { isActive: false, tags: 'velit' }
        },
        {
          $project: {   //Projects ie. Shows only specified fields in output document
            _id: false,
            name: 1,
            age: 1
          }
        }
      ];
  
      const result = await User.aggregate(pipeline);
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  // Route for "Lookup Example"
app.get('/lookup', async (req, res) => {
    try {
        const pipeline = [
            {
                $lookup: {  //Matches Documents from other collections
                    from: "authors", // Matches Documents from other collections
                    localField: "author_id", // Field from the current collection
                    foreignField: "_id", // Field from the referenced collection
                    as: "authorDetails" 
                }
            },
            {
                $addFields: {
                    author_details: { $first: "$authorDetails" } 
                }
            }
        ];

        const result = await Book.aggregate(pipeline);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


  // Route for "Most Recent Registered Users"
app.get('/recent-registerd', async (req, res) => {
    try {
      const pipeline = [
        {
          $sort: { registered: -1 }
        },
        {
          $limit: 10
        },
        {
          $project: { name: 1, age: 1, company: 1 }
        }
      ];
  
      const result = await User.aggregate(pipeline);
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  
// Route for "Categorize Users by Favorite Fruit"
app.get('/byFavFruit', async (req, res) => {
    try {
      const pipeline = [
        {
          $group: {
            _id: "$favoriteFruit",
            users: { $push: { name: "$name", age: "$age" } }
          }
        }
      ];
  
      const result = await User.aggregate(pipeline);
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Route for "How many users have 'ad' tag as their 2nd tag in their list of tags?"
app.get('/ad@2nd', async (req, res) => {
    try {
      const pipeline = [
        {
          $match: { tags: 'ad' }
        },
        {
          $project: {
            tags: { $slice: ['$tags', 1, 1] } // Extract the second tag from the list
          }
        },
        {
          $match: { tags: 'ad' }
        },
        {
          $count: 'count'
        }
      ];
  
      const result = await User.aggregate(pipeline);
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  
// Route for "Find users having both 'enim' and 'id' in their tags"
app.get('/enim&idInTag', async (req, res) => {
    try {
      const pipeline = [
        {
          $match: {
             tags: {
                 $all: ["enim", "id"] // Matches arrays containing all specified elements
                }
             } 
        }
      ];
  
      const result = await User.aggregate(pipeline);
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  
  // Route for "List all companies located in USA with their user count"
app.get('/compInUSA', async (req, res) => {
    try {
      const pipeline = [
        {
          $match: { "company.location.country": "USA" }
        },
        {
          $group: {
            _id: "$company.title",
            users: { $sum: 1 }
          }
        },
        {
          $sort: { users: -1 }
        }
      ];
  
      const result = await User.aggregate(pipeline);
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});