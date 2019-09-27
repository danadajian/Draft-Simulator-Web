describe('Home page tests', function () {
    it('Lets you login', function () {
        cy.visit('http://localhost:5000');
        cy.get('[class^=btn]').contains('Log In').click();
        cy.url().should('eq', 'http://localhost:5000/login');
        cy.get('[class^=form-group]').find('#username').type('testytest');
        cy.get('#password').type('testing123');
        cy.get('[class^=btn]').contains('Log In').click();
        cy.url().should('eq', 'http://localhost:5000/home');
    });
    it('Lets you signup', function () {
        cy.visit('http://localhost:5000');
        cy.get('[class^=btn]').contains('Sign Up').click();
        cy.url().should('eq', 'http://localhost:5000/signup');
        const randomString = Math.random().toString().slice(2, 13);
        cy.get('[class^=form-group]').find('#username').type('test'.concat(randomString));
        cy.get('#email').type('testing@test'.concat(randomString).concat('.com'));
        cy.get('#password').type('testing123');
        const stub = cy.stub();
        cy.on ('window:alert', stub);
        cy.get('[class^=btn]').contains('Create Account').click().then(() => {
          expect(stub.getCall(0)).to.be.calledWith('Your account has been created!  Now please login.')
        });
        cy.url().should('eq', 'http://localhost:5000/login');
    });
    it('Prevents you from signing up when using existing username', function () {
        cy.visit('http://localhost:5000');
        cy.get('[class^=btn]').contains('Sign Up').click();
        cy.url().should('eq', 'http://localhost:5000/signup');
        cy.get('[class^=form-group]').find('#username').type('testytest');
        cy.get('#email').type('testing@test.com');
        cy.get('#password').type('testing123');
        const stub = cy.stub();
        cy.on ('window:alert', stub);
        cy.get('[class^=btn]').contains('Create Account').click().then(() => {
          expect(stub.getCall(0)).to.be.calledWith('Username already exists.  Please try again.')
        });
    });
    it('Prevents you from signing up when using existing email', function () {
        cy.visit('http://localhost:5000');
        cy.get('[class^=btn]').contains('Sign Up').click();
        cy.url().should('eq', 'http://localhost:5000/signup');
        cy.get('[class^=form-group]').find('#username').type('test'
            .concat(Math.random().toString().slice(2, 13)));
        cy.get('#email').type('testing@test.com');
        cy.get('#password').type('testing123');
        const stub = cy.stub();
        cy.on ('window:alert', stub);
        cy.get('[class^=btn]').contains('Create Account').click().then(() => {
          expect(stub.getCall(0)).to.be.calledWith('Email has been taken.  Please try again.')
        });
    });
});