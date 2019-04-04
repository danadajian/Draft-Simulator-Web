describe('Draft Simulator Tests', function () {
    it('Loads successfully', function () {
      cy.visit('http://localhost:5000/');
      cy.contains('Draft Simulator').should('exist');
    });

    it('can add and remove a player', function () {
      cy.get('[class^=User-list-box]').find('[id^=listitem0jqx]').should('not.exist');
      cy.get('[class^=Player-list-box]').find('[id^=listitem0jqx]').click();
      cy.contains('Add').click();
      cy.get('[class^=User-list-box]').find('[id^=listitem0jqx]').should('exist');
      cy.get('[class^=User-list-box]').find('[id^=listitem0jqx]').click();
      cy.contains('Remove').click();
      cy.get('[class^=User-list-box]').find('[id^=listitem0jqx]').should('not.exist');
    });

    it('can add and remove multiple players', function () {
        cy.get('[id^=filterjqxListBox]').get('input:eq(0)').type('Saq');
        cy.get('[class^=Player-list-box]').find('[id^=listitem0jqx]').click();
        cy.contains('Add').click();
        cy.get('[id^=filterjqxListBox]').get('input:eq(0)').type('{backspace}')
            .type('{backspace}').type('{backspace}');
        cy.get('[id^=filterjqxListBox]').get('input:eq(0)').type('Ode');
        cy.get('[class^=Player-list-box]').find('[id^=listitem0jqx]').click();
        cy.contains('Add').click();
        cy.get('[id^=filterjqxListBox]').get('input:eq(0)').type('{backspace}')
            .type('{backspace}').type('{backspace}');
        cy.get('[class^=User-list-box]').find('[id^=listitem0jqx]').should('exist');
        cy.get('[class^=User-list-box]').find('[id^=listitem1jqx]').should('exist');

        cy.get('[class^=User-list-box]').find('[id^=listitem]').click({multiple: true, force: true});
        cy.contains('Remove').click();
        cy.get('[class^=User-list-box]').find('[id^=listitem0jqx]').should('not.exist');
        cy.get('[class^=User-list-box]').find('[id^=listitem1jqx]').should('not.exist');
    });

    it('can clear players', function () {
        cy.contains('Clear').click();
        cy.get('[class^=User-list-box]').not(find('[id^=listitem0jqx]'));
        cy.get('[class^=User-list-box]').find('[id^=listitem0jqx]').should('not.exist');
    });

    it('cannot draft players with empty list', function () {
        cy.contains('Draft').click();
        cy.contains('No data to display').should('exist');
        cy.get('[id^=jqxGridjqx]').find('[jqx-grid-cell jqx-grid-empty-cell]').should('exist');
    });

    it('can draft players with nonempty list', function () {
        cy.get('[class^=Player-list-box]').find('[id^=listitem0jqx]').click();
        cy.contains('Add').click();
        cy.contains('Draft').click();
        cy.get('[id^=jqxGridjqx]').find('[jqx-grid-cell jqx-grid-empty-cell]').should('not.exist');
        // cy.get('[id^=jqxGridjqx]').find('[id^=listitem]').should('have.length', 11);
        // need to change this check later ^
    })
});
