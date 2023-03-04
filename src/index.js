import express from 'express';
import cors from 'cors';

const port = 5000;
const errorFieldsRequired = 'Todos os campos são obrigatórios!';
const users = [];
const tweets = [];

const app = express();

app.use(cors());
app.use(express.json());

app.post('/sign-up', (req, res) => {
  const { username, avatar } = req.body;
  if (username && avatar) {
    if (users.find((user) => user.username === username)) {
      return res.status(409).send();
    }
    const id = users.length + 1;
    const user = { id, username, avatar };
    users.push(user);
    return res.status(201).send('OK');
  }
  return res.status(400).send(errorFieldsRequired);
});

app.post('/tweets', (req, res) => {
  const username  = req.headers.user;
  const { tweet } = req.body;
  if (username && tweet) {
    const id = tweets.length + 1;
    const user = users.find((user) => user.username === username);
    if (!user) {
      return res.status(404).send();
    }
    const newTweet = { id, username, tweet };
    tweets.push(newTweet);
    return res.status(201).send('OK');
  }
  return res.status(400).send(errorFieldsRequired);
});

app.get('/tweets', (req, res) => {
  const tweetsPerPage = Math.min(tweets.length, 10);
  const page = parseInt(req.query.page);
  const offset = tweetsPerPage * page;
  const latestTweets = page
    ? tweets.slice(offset - tweetsPerPage, offset).reverse()
    : tweets.slice(tweets.length - tweetsPerPage).reverse();
  const tweetsWithAvatar = latestTweets.map((tweet) => {
    const user = users.find((user) => user.username === tweet.username);
    return { ...tweet, avatar: user.avatar };
  });
  return res.send(tweetsWithAvatar);
});

app.get('/tweets/:username', (req, res) => {
  const { username } = req.params;
  const user = users.find((user) => user.username === username);
  if (!user) {
    return res.status(404).send();
  }
  const userTweets = tweets.filter((tweet) => tweet.username === username);
  return res.send(userTweets);
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
