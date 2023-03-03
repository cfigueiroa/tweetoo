import express from 'express';
import cors from 'cors';

const port = 5000;
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
  return res.status(400).send('Todos os campos são obrigatórios!');
});

app.post('/tweets', (req, res) => {
  const { username, tweet } = req.body;
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
  return res.status(400).send('Todos os campos são obrigatórios!');
});

app.get('/tweets', (_req, res) => {
  const count = Math.min(tweets.length, 10);
  const startIndex = tweets.length - count;
  const latestTweets = tweets.slice(startIndex).reverse();
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
