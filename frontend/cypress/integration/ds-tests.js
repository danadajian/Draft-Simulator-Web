describe('Draft Simulator Tests', function () {
    it('Loads successfully', function () {
      cy.visit('http://localhost:5000/');
      cy.contains('Draft Results appear here!').should('exist');
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
        cy.get('[class^=Player-list-box]').type('{home}').next().click();
        cy.get('[class^=Player-list-box]').type('{end}').next().click();
        cy.get('[class^=Player-list-box]').type('{home}');
        cy.contains('Add').click();
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
        cy.contains('Drafting...').should('not.exist');
        cy.contains('Please select at least one player to draft.').should('exist');
        cy.get('[class^=User-list-box]').find('[id^=listitem0jqx]').should('not.exist');
    });

    it('can draft players with nonempty list', function () {
        cy.get('[class^=Player-list-box]').find('[id^=listitem0jqx]').click();
        cy.contains('Add').click();
        cy.contains('Draft').click();
        cy.get('[class^=Draft-list-box]').find('[id^=listitem]').should('have.length', 11);
        // need to change this check later ^
    })
});
