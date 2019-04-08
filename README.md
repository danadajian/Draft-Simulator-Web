# Draft Simulator

https://www.draftsimulator.app/

Languages/services used:
* Backend: Python
* Frontend: Javascript, React
* Frontend testing: Cypress
* Web hosting: Heroku
* Deployment pipeline: Concourse, Docker

Heroku CLI deploy command:
* `git subtree push --prefix backend heroku master`
* If it doesn't cooperate...
    * ``git push heroku `git subtree split --prefix backend master`:master --force``

Docker Commands:
* in concourse-setup:
    * `docker-compose up -d`
    * `docker-compose down`
    * `fly set-pipeline -p ds-pipeline -c pipeline.yml -l credentials.yml -t ci`

Skills Learned and/or Developed:
* Python backend development
* Javascript frontend development
* backend/frontend communication
* Web hosting
* Web design (CSS layout)
* Frontend testing (Cypress)
* Pipeline deployments (Concourse)
* SSL certificate authentication

Trello Board:
* https://trello.com/b/A9vXVNaE/draft-simulator