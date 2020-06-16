const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

//midware para validação dos repositorios
function repositoryExists(req, res, next) {
  const { id } = req.params;
  const findId = repositories.find(element => element.id == id);

  if (!findId){
    return res.status(400).json({ message: "Repositories not finded." })
  }

  return next();
}

//Checa se já existe usuário com mesmo ID
function checkIDExist(req, res, next) {
  const { id } = req.body;
  const repository = repositories.findIndex(p => p.id == id);

  if (repository != -1) {
    return res.status(400).json({ error: "Id ja existe" });
  }

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", checkIDExist,(request, response) => {
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

app.put("/repositories/:id", repositoryExists,(request, response) => {
  const {id} = request.params
  const{url,title,techs} = request.body

  const repositoryIndex = repositories.findIndex(element => element.id == id)

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

app.delete("/repositories/:id", repositoryExists, (request, response) => {
  const {id} = request.params

  const repositoryIndex = repositories.findIndex(element => element.id == id)

  const repository = repositories[repositoryIndex]

  repositories.splice(repository, 1);

  return response.status(204).json({message:"Field Deleted"})

});

app.post("/repositories/:id/like", repositoryExists,(request, response) => {
  const {id} = request.params

  const repositoryIndex = repositories.findIndex(element => element.id == id)

  const repository = repositories[repositoryIndex]

  repository.likes = repository.likes + 1

  repositories[repositoryIndex] = repository

  return response.json(repository)

});

module.exports = app;
