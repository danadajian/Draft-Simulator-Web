# Fantasy-Draft-Simulator

Python Dependencies:
* requests
* bs4

Heroku CLI deploy command:
* `git subtree push --prefix backend heroku master`
* `git push heroku `git subtree split --prefix backend master`:master --force`

Docker Commands:
* in concourse-setup:
    * docker-compose up -d
    * docker-compose down
    * fly set-pipeline -p ds-pipeline -c pipeline.yml -l credentials.yml -t ci

Notes:
* check out cypress
* heroku login with credentials in yml
* get it going on pc remotely with ip