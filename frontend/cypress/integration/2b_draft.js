describe('Draft tests', function () {
    it('cannot draft players with empty list', function () {
        cy.visit('http://localhost:5000/login');
        cy.get('[class^=form-group]').find('#username').type('testytest');
        cy.get('#password').type('testing123');
        cy.get('[class^=btn]').contains('Log In').click();
        cy.visit('http://localhost:5000/espn');
        cy.get('[class$=jqx-item]').should('not.exist');
        const stub = cy.stub();
        cy.on ('window:alert', stub);
        cy.get('button').get('[class=Draft-button]').click().then(() => {
          expect(stub.getCall(0)).to.be.calledWith('Please select at least one player to draft.')
        });
        cy.get('[class$=jqx-item]').should('not.exist');
    });

    it('can draft successfully with one player', function () {
        cy.get('[class$=jqx-item]').should('not.exist');
        cy.get('[class^=Player-list-box]:eq(1)').find('[id^=listitem0jqx]').should('not.exist');
        cy.get('[class^=Player-list-box]:eq(0)').find('[id^=listitem0jqx]').click();
        cy.get('[class=Add-button]').click();
        cy.get('[id^=jqxSliderjqx]:eq(1)').trigger('change').invoke('val', 1);
        cy.server();
        cy.route({method: 'POST', url: /draft-results/}).as('postPlayers');
        cy.route({method: 'GET', url: /draft-results/}).as('getResults');
        cy.get('[class=Draft-button]').click();
        cy.wait('@postPlayers').wait('@getResults');
        cy.get('[id^=jqxGridjqx]').contains('Saquon Barkley').should('exist');
        cy.get('[id^=jqxGridjqx]').get('[class$=jqx-item]').should('have.length', 3);
        cy.contains('All Players').click();
        cy.get('[id^=jqxGridjqx]').get('[class$=jqx-item]').should('have.length', 36);
        cy.contains('Expected Team').click();
        cy.get('[id^=jqxGridjqx]').get('[class$=jqx-item]').should('have.length', 36);
        cy.get('[class=Clear-button]').click();
    });

    it('can draft successfully with multiple players', function () {
        cy.get('[id^=filterjqxListBox]').get('input:eq(0)').type('Saq');
        cy.get('[class^=Player-list-box]:eq(0)').find('[id^=listitem0jqx]').click();
        cy.get('[class=Add-button]').click();
        cy.get('[id^=filterjqxListBox]').get('input:eq(0)');
        cy.get('[id^=filterjqxListBox]').get('input:eq(0)').type('Bears');
        cy.get('[class^=Player-list-box]:eq(0)').find('[id^=listitem0jqx]').click();
        cy.get('[class=Add-button]').click();
        cy.server();
        cy.route({method: 'POST', url: /draft-results/}).as('postPlayers');
        cy.route({method: 'GET', url: /draft-results/}).as('getResults');
        cy.get('[class=Draft-button]').click();
        cy.wait('@postPlayers').wait('@getResults');
        cy.get('[id^=jqxGridjqx]').contains('Saquon Barkley').should('exist');
        cy.get('[id^=jqxGridjqx]').contains('Bears D/ST').should('exist');
        cy.get('[id^=jqxGridjqx]').get('[class$=jqx-item]').should('have.length', 6);
        cy.contains('All Players').click();
        cy.get('[id^=jqxGridjqx]').get('[class$=jqx-item]').should('have.length', 39);
        cy.get('[class=Clear-button]').click();
    });
});