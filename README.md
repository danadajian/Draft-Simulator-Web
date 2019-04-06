# Draft Simulator

Python Dependencies:
* requests
* bs4

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
* Python development with Flask
* Javascript
* Frontend development (React)
* backend/frontend communication via HTTP requests
* Web design (CSS layout)
* Frontend testing (Cypress)
* Pipeline deployments (Concourse)

Trello Board:
* https://trello.com/b/A9vXVNaE/draft-simulator