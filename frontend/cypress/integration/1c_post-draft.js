describe('Post-draft tests', function () {
    it('preserves draft settings', function () {
        cy.visit('http://localhost:5000/espn');
        cy.get('[class$=jqx-item]').should('not.exist');
        cy.get('[class^=Player-list-box]:eq(1)').find('[id^=listitem0jqx]').should('not.exist');
        cy.get('[class^=Player-list-box]:eq(0)').find('[id^=listitem0jqx]').click();
        cy.get('[class=Add-button]').click();
        cy.get('[id^=jqxSliderjqx]:eq(0)').trigger('change').invoke('val', 8);
        cy.get('[id^=jqxSliderjqx]:eq(1)').trigger('change').invoke('val', 6);
        cy.get('[id^=jqxSliderjqx]:eq(2)').trigger('change').invoke('val', 4);
        cy.get(':checkbox').check();
        cy.server();
        cy.route({method: 'POST', url: /draft-results/}).as('postPlayers');
        cy.route({method: 'GET', url: /draft-results/}).as('getResults');
        cy.get('[class=Draft-button]').click();
        cy.wait('@postPlayers').wait('@getResults');
        cy.get('[id^=jqxSliderjqx]:eq(0)').get('input:eq(4)').should('have.value', '8');
        cy.get('[id^=jqxSliderjqx]:eq(1)').get('input:eq(5)').should('have.value', '6');
        cy.get('[id^=jqxSliderjqx]:eq(2)').get('input:eq(7)').should('have.value', '4');
        cy.get('[id^=jqxSliderjqx]:eq(0)').trigger('change').invoke('val', 10);
        cy.get('[id^=jqxSliderjqx]:eq(1)').trigger('change').invoke('val', 2);
        cy.get('[id^=jqxSliderjqx]:eq(2)').trigger('change').invoke('val', 3);
        cy.get(':checkbox').should('be.checked');
        cy.get(':checkbox').uncheck();
        cy.get('[class=Draft-button]').click();
        cy.wait('@postPlayers').wait('@getResults');
        cy.get('[id^=jqxSliderjqx]:eq(0)').get('input:eq(4)').should('have.value', '10');
        cy.get('[id^=jqxSliderjqx]:eq(1)').get('input:eq(5)').should('have.value', '2');
        cy.get('[id^=jqxSliderjqx]:eq(2)').get('input:eq(7)').should('have.value', '3');
        cy.get(':checkbox').should('not.be.checked');
    });

    it('can add/remove new players after drafting', function () {
        cy.visit('http://localhost:5000/espn');
        cy.get('[class^=Player-list-box]:eq(0)').find('[id^=listitem0jqx]').click();
        cy.get('[class=Add-button]').click();
        cy.server();
        cy.route({method: 'POST', url: /draft-results/}).as('postPlayers');
        cy.route({method: 'GET', url: /draft-results/}).as('getResults');
        cy.get('[class=Draft-button]').click();
        cy.wait('@postPlayers').wait('@getResults');
        cy.get('[id^=filterjqxListBox]').get('input:eq(0)').type('Saq');
        cy.get('[class^=Player-list-box]:eq(0)').find('[id^=listitem0jqx]').click();
        cy.get('[class=Add-button]').click();
        cy.get('[class^=Player-list-box]:eq(1)').find('[id^=listitem0jqx]').should('exist');
        cy.get('[class^=Player-list-box]:eq(1)').find('[id^=listitem1jqx]').should('exist');

        cy.get('[class^=Player-list-box]:eq(1)').find('[id^=listitem0jqx]').click();
        cy.get('[class=Remove-button]').click();
        cy.get('[class^=Player-list-box]:eq(1)').find('[id^=listitem1jqx]').click();
        cy.get('[class=Remove-button]').click();
        cy.get('[class^=Player-list-box]:eq(1)').find('[id^=listitem0jqx]').should('not.exist');
        cy.get('[class^=Player-list-box]:eq(1)').find('[id^=listitem1jqx]').should('not.exist');
    });
});