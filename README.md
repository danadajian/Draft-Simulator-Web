# Draft Simulator

https://www.draftsimulator.app/

Languages/services used:
* Backend: Python
* Backend testing: unittest
* Frontend: Javascript, Typescript, React
* Frontend testing: Jest, Cypress
* Database: PostgreSQL
* Web hosting: Heroku
* Deployment pipeline: Concourse, Docker

Building frontend:
* `cd frontend`
* `npm install chalk`
* `npm run build`

Running Cypress:
* `cd frontend`
* `npm install cypress`
* `cd node_modules/.bin/`
* `cypress open`

Heroku Postgres commands:
* Push local db:
    * `heroku pg:push draftsimulator DATABASE_URL -a draft-simulator`
* Pull heroku db:
    * `heroku pg:pull DATABASE_URL draftsimulator -a draft-simulator`
* Run SQL in heroku db:
    * `heroku pg:psql -a draft-simulator`

Docker Commands:
* in concourse-setup:
    * `docker-compose up -d`
    * `docker-compose down`
* in ci:
    * `fly set-pipeline -p ds-pipeline -c pipeline.yml -l credentials.yml -t ci`
    * `fly pause-pipeline -p ds-pipeline -t ci`
    * `fly unpause-pipeline -p ds-pipeline -t ci`

Refresh SSL certificate post deployment:
* `heroku certs:auto:refresh`

Skills Learned and/or Developed:
* Python backend development
* Javascript frontend development
* backend/frontend communication
* Database connection, creation, and management
* Web hosting
* Web design (CSS layout)
* Frontend testing (Cypress)
* Pipeline deployments (Concourse)
* SSL certificate authentication

Trello Board:
* https://trello.com/b/A9vXVNaE/draft-simulator