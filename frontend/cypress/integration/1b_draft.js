describe('Draft tests', function () {
    it('cannot draft players with empty list', function () {
        cy.visit('http://localhost:5000/');
        cy.get('[class$=jqx-item]').should('not.exist');
        const stub = cy.stub();
        cy.on ('window:alert', stub);
        cy
        .get('button').get('[class=Draft-button]').click()
        .then(() => {
          expect(stub.getCall(0)).to.be.calledWith('Please select at least one player to draft.')
        });
        cy.get('[class$=jqx-item]').should('not.exist');
    });

    it('can draft successfully with one player', function () {
        cy.get('[class$=jqx-item]').should('not.exist');
        cy.get('[class^=User-list-box]').find('[id^=listitem0jqx]').should('not.exist');
        cy.get('[class^=Player-list-box]').find('[id^=listitem0jqx]').click();
        cy.contains('Add').click();
        cy.get('[id^=jqxSliderjqx]:eq(1)').trigger('change').invoke('val', 1);
        cy.server();
        cy.route({method: 'POST', url: /draft-results/}).as('postPlayers');
        cy.route({method: 'GET', url: /draft-results/}).as('getResults');
        cy.get('[class=Draft-button]').click();
        cy.wait('@postPlayers').wait('@getResults');
        cy.get('[id^=jqxGridjqx]').contains('Todd Gurley II').should('exist');
        cy.get('[id^=jqxGridjqx]').get('[class$=jqx-item]').should('have.length', 3);
        cy.contains('All Players').click();
        cy.get('[id^=jqxGridjqx]').get('[class$=jqx-item]').should('have.length', 42);
        cy.contains('Expected Team').click();
        cy.get('[id^=jqxGridjqx]').get('[class$=jqx-item]').should('have.length', 42);
        cy.get('[class=Clear-button]').click();
    });

    it('can draft successfully with multiple players', function () {
        cy.get('[id^=filterjqxListBox]').get('input:eq(0)').type('Saq');
        cy.get('[class^=Player-list-box]').find('[id^=listitem0jqx]').click();
        cy.get('[class=Add-button]').click();
        cy.get('[id^=filterjqxListBox]').get('input:eq(0)').type('{backspace}')
            .type('{backspace}').type('{backspace}');
        cy.get('[id^=filterjqxListBox]').get('input:eq(0)').type('Bears');
        cy.get('[class^=Player-list-box]').find('[id^=listitem0jqx]').click();
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
        cy.get('[id^=jqxGridjqx]').get('[class$=jqx-item]').should('have.length', 45);
        cy.get('[class=Clear-button]').click();
    });
});