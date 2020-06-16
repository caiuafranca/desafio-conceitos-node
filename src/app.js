const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const {url, title, techs} = request.body

  const repository = {
    id: uuid(),
    url: url,
    title: title,
    techs: techs,
    likes: 0
  }

  repositories.push(repository)

  return response.json(repository)
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params
  const{url,title,techs} = request.body

  const repositoryIndex = repositories.findIndex(element => element.id == id)

  if(repositoryIndex < 0 ){
    response.status(400).json({error: 'Repository not found'})
  }
  const likes = repositories[repositoryIndex].likes
  
  const repository = {
      id,
      url,
      title,
      techs,
      likes
  }  
  repositories[repositoryIndex] = repository
  return response.json(repository)
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params

  const repositoryIndex = repositories.findIndex(element => element.id == id)

  if(repositoryIndex < 0 ){
    response.status(400).json({error: 'Repository not found'})
  }

  const repository = repositories[repositoryIndex]

  repositories.splice(repository, 1);

  return response.json({message:"Data deleted."})

});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params

  const repositoryIndex = repositories.findIndex(element => element.id == id)

  if(repositoryIndex < 0 ){
    response.status(400).json({error: 'Repository not found'})
  }

  const repository = repositories[repositoryIndex]

  repository.likes = repository.likes + 1

  repositories[repositoryIndex] = repository

  return response.json(repository)

});

module.exports = app;
