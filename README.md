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

To-Dos:
* ~~Communicate back and forth between backend and frontend~~
* ~~Figure out CSS layout~~
* ~~Bind sliders to backend and make them dynamic~~
* ~~Create drafting animation~~
* ~~Experiment with returning full lineup with highest frequency rather than per player~~
* ~~Make position first column and add draft frequency to expected team~~
* Add random checkbox
* Fix bug with adding players after drafting, lists don't reset
* Add colors to results grid(s)
* Create nav bar
* Implement flex in CSS for smaller screen sizes
* Make import/export functionality
* Insert documentation and/or instructions somewhere

Nice-to-haves:
* Find a nice CSS template
* Get deployments setup on pc remotely with ip

Skills Learned and/or Developed:
* Python development with Flask
* Javascript
* Frontend development (React)
* backend/frontend communication via HTTP requests
* Web design (CSS layout)
* Frontend testing (Cypress)
* Pipeline deployments (Concourse)
