describe('Pre-draft tests', function () {
    it('Loads successfully', function () {
      cy.visit('http://localhost:5000/login');
      cy.get('[class^=form-group]').find('#username').type('testytest');
      cy.get('#password').type('testing123');
      cy.get('[class^=btn]').contains('Log In').click();
      cy.visit('http://localhost:5000/espn');
      cy.contains('Draft Simulator').should('exist');
      cy.contains('No data to display').should('exist');
    });

    it('does nothing when add, remove, or clear is clicked', function () {
        cy.get('[class=Add-button]').click();
        cy.get('[class^=Player-list-box]:eq(1)').find('[id^=listitem0jqx]').should('not.exist');
        cy.get('[class=Remove-button]').click();
        cy.get('[class^=Player-list-box]:eq(1)').find('[id^=listitem0jqx]').should('not.exist');
        cy.get('[class=Clear-button]').click();
        cy.get('[class^=Player-list-box]:eq(1)').find('[id^=listitem0jqx]').should('not.exist');
    });

    it('can add and remove a player', function () {
      cy.get('[class^=Player-list-box]:eq(1)').find('[id^=listitem0jqx]').should('not.exist');
      cy.get('[class^=Player-list-box]:eq(0)').find('[id^=listitem0jqx]').click();
      cy.get('[class=Add-button]').click();
      cy.get('[class^=Player-list-box]:eq(1)').find('[id^=listitem0jqx]').should('exist');
      cy.get('[class^=Player-list-box]:eq(1)').find('[id^=listitem0jqx]').click();
      cy.get('[class=Remove-button]').click();
      cy.get('[class^=Player-list-box]:eq(1)').find('[id^=listitem0jqx]').should('not.exist');
    });

    it('can add and remove multiple players', function () {
        cy.get('[id^=filterjqxListBox]').get('input:eq(0)').type('Saq');
        cy.get('[class^=Player-list-box]:eq(0)').find('[id^=listitem0jqx]').click();
        cy.get('[class=Add-button]').click();
        cy.get('[id^=filterjqxListBox]').get('input:eq(0)');
        cy.get('[id^=filterjqxListBox]').get('input:eq(0)').type('Bea');
        cy.get('[class^=Player-list-box]:eq(0)').find('[id^=listitem0jqx]').click();
        cy.get('[class=Add-button]').click();
        cy.get('[id^=filterjqxListBox]').get('input:eq(0)');
        cy.get('[class^=Player-list-box]:eq(0)').find('[id^=listitem0jqx]').should('exist');
        cy.get('[class^=Player-list-box]:eq(0)').find('[id^=listitem1jqx]').should('exist');

        cy.get('[class^=Player-list-box]:eq(1)').find('[id^=listitem]').click({multiple: true, force: true});
        cy.get('[class=Remove-button]').click();
        cy.get('[class^=Player-list-box]:eq(1)').find('[id^=listitem0jqx]').should('not.exist');
        cy.get('[class^=Player-list-box]:eq(1)').find('[id^=listitem1jqx]').should('not.exist');
    });

    it('can clear players', function () {
        cy.get('[class=Clear-button]').click();
        cy.get('[class^=Player-list-box]:eq(1)').find('[id^=listitem0jqx]').should('not.exist');
    });

    it('honors sliders', function () {
        cy.get('[id^=jqxSliderjqx]:eq(0)').trigger('change').invoke('val', 12);
        cy.get('[id^=jqxSliderjqx]:eq(0)').get('input:eq(4)').should('have.value', '12');
        cy.get('[id^=jqxSliderjqx]:eq(1)').trigger('change').invoke('val', 3);
        cy.get('[id^=jqxSliderjqx]:eq(1)').get('input:eq(5)').should('have.value', '3');
        cy.get('[id^=jqxSliderjqx]:eq(2)').trigger('change').invoke('val', 1);
        cy.get('[id^=jqxSliderjqx]:eq(2)').get('input:eq(7)').should('have.value', '1');
    });

    it('caps draft pick at number of teams', function () {
        cy.get('[id^=jqxSliderjqx]:eq(0)').trigger('change').invoke('val', 8);
        cy.get('[id^=jqxSliderjqx]:eq(1)').trigger('change').invoke('val', 9);
        cy.get('[id^=jqxSliderjqx]:eq(1)').get('input:eq(4)').should('have.value', '8');
    });
});
