const port = 3000;

describe('Unmounting and remounting routers', () => {
  /*
    Tests router navigation when there are multiple
    IonReactRouter components that are mounted at different times
    Fixes bug https://github.com/ionic-team/ionic-framework/issues/23170
  */
 
  it('The hardware back button should only travel back one page at a time', () => {
    cy.visit(`http://localhost:${port}/`);
    cy.ionPageVisible('main');
    cy.ionNav('ion-button', 'Swap Mounted Router')
    cy.ionPageVisible('unmounted');
    cy.ionNav('ion-button', 'Swap Mounted Router')
    cy.ionPageVisible('main');

    /*
      The following is copied from ./routing.spec.js
      cy.ionBackClick is replaced with cy.ionHardwareBackEvent
    */
    cy.visit(`http://localhost:${port}/routing/`);
    cy.ionNav('ion-item', 'Details 1');
    cy.ionNav('ion-button', 'Go to Details 2');
    cy.ionNav('ion-button', 'Go to Details 3');
    cy.contains('[data-pageid=home-details-page-3] ion-label', 'Details 3');
    cy.ionTabClick('Settings');
    cy.ionNav('ion-item', 'Settings Details 1');
    cy.ionNav('ion-button', 'Go to Settings Details 2');
    cy.ionNav('ion-button', 'Go to Settings Details 3');
    cy.contains('[data-pageid=settings-details-page-3] ion-label', 'Details 3');
    cy.ionTabClick('Home');
    cy.contains('[data-pageid=home-details-page-3] ion-label', 'Details 3');
    cy.ionHardwareBackEvent();
    cy.contains('[data-pageid=home-details-page-2] ion-label', 'Details 2');
    cy.ionHardwareBackEvent();
    cy.contains('[data-pageid=home-details-page-1] ion-label', 'Details 1');
    cy.ionHardwareBackEvent();
    cy.ionPageVisible('home-page');
  });
});