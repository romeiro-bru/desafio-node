const express = require("express");
const cors = require("cors");

const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
    return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url, 
    techs,
    likes: 0
  }

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const findRepoIndex = repositories.findIndex(repository => repository.id == id);

  if (findRepoIndex < 0) {
    return response.status(400).json({ error: 'Repository does not exist.' });
  }

  const repository = {
    id,
    title, 
    url,
    techs,
    likes: repositories[findRepoIndex].likes
  };

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const findRepoIndex = repositories.findIndex(repository => repository.id == id);

  if (findRepoIndex >= 0 ) {
    repositories.splice(findRepoIndex, 1);
  } else {
    return response.status(400).json({ error: 'Not Found.' });
  }

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const findRepoIndex = repositories.findIndex(repository => repository.id == id);

  if (findRepoIndex == -1) {
    return response.status(400).json({ error: 'Repository does not exist.' });
  }

  repositories[findRepoIndex].likes += 1;

  return response.json(repositories[findRepoIndex]);
});

module.exports = app;
