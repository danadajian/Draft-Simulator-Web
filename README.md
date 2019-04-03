# Draft Simulator

Python Dependencies:
* requests
* bs4

Heroku CLI deploy command:
* `git subtree push --prefix backend heroku master`
* If it doesn't cooperate...
    * ``git push heroku `git subtree split --prefix backend master` :master --force``

Docker Commands:
* in concourse-setup:
    * docker-compose up -d
    * docker-compose down
    * fly set-pipeline -p ds-pipeline -c pipeline.yml -l credentials.yml -t ci

To-Dos:
* Bind sliders to backend
* Create "Drafting..." spinny circle
* Create nav bar
* Make import/export functionality
* Insert documentation and/or instructions somewhere

Nice-to-haves:
* Find a nice CSS template
* Get deployments setup on pc remotely with ip