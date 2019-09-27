describe('Page navigation tests', function () {
    it('Redirects to home after required login', function () {
        cy.visit('http://localhost:5000/home');
        cy.get('[class^=btn]').contains('Log In').click();
        cy.url().should('eq', 'http://localhost:5000/login?next=%2Fhome');
        cy.get('[class^=form-group]').find('#username').type('testytest');
        cy.get('#password').type('testing123');
        cy.get('[class^=btn]').contains('Log In').click();
        cy.url().should('eq', 'http://localhost:5000/home');
        cy.get('[class^=Logout]').contains('Log Out').click();
    });
    it('Redirects to simulate after required login', function () {
        cy.visit('http://localhost:5000/simulate');
        cy.get('[class^=btn]').contains('Log In').click();
        cy.url().should('eq', 'http://localhost:5000/login?next=%2Fsimulate');
        cy.get('[class^=form-group]').find('#username').type('testytest');
        cy.get('#password').type('testing123');
        cy.get('[class^=btn]').contains('Log In').click();
        cy.url().should('eq', 'http://localhost:5000/simulate');
        cy.get('[class=nav-link]').contains('Log Out').click();
    });
    it('Redirects to optimize after required login', function () {
        cy.visit('http://localhost:5000/optimize');
        cy.get('[class^=btn]').contains('Log In').click();
        cy.url().should('eq', 'http://localhost:5000/login?next=%2Foptimize');
        cy.get('[class^=form-group]').find('#username').type('testytest');
        cy.get('#password').type('testing123');
        cy.get('[class^=btn]').contains('Log In').click();
        cy.url().should('eq', 'http://localhost:5000/optimize');
        cy.get('[class=nav-link]').contains('Log Out').click();
    });
});