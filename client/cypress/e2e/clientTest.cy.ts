describe('Register and Login Form', () => {

  it('Succesfully Registers with admin, admin', () => {
    cy.visit('http://localhost:5173/');
    cy.contains('button', 'Sign Up').click();
    cy.get('input[name="firstName"]').type('admin');
    cy.get('input[name="email"]').type('admin');
    cy.get('input[name="password"]').type('admin');

    cy.intercept({
      method: 'POST',
      url: 'http://localhost:3000/register', 
    }).as('registrationAttempt');
    
    cy.get('.auth-form', { timeout: 2000 } ).submit();
    cy.wait('@registrationAttempt').then(({ response }) => {
      if (response) {
        expect(response.statusCode).to.equal(201);
      } else {
        throw new Error('Response was undefined');
      }
    });
  });
  it('successfully logs in', () => {
    // Visit the page where the login form is located
    cy.visit('http://localhost:5173/');
    // Fill in the email and password fields
    cy.get('input[name="email"]').type('admin');
    cy.get('input[name="password"]').type('admin');
    // Submit the form
    cy.get('.auth-form').submit();

    // Wait for the URL to change to the dashboard
    cy.url().should('include', '/dashboard');
    // Add assertions here to verify the login was successful
    cy.contains('button', 'Add recipe').should('be.visible');
    cy.contains('button', 'Mains').should('be.visible');
    cy.contains('button', 'Desserts').should('be.visible');
    cy.contains('button', 'Favourites').should('be.visible');

    cy.contains('button', 'Add recipe').click();
    // Wait for the URL to change to /create-recipe
    cy.url().should('include', '/create-recipe');
    // Assert that the text "on the menu" is visible on the page
    cy.contains('on the menu').should('be.visible');

  });
  it('should successfully delete the user', () => {
    cy.visit('http://localhost:5173/');

    cy.intercept('POST', '/login').as('loginUser');

    cy.get('input[name="email"]').type('admin');
    cy.get('input[name="password"]').type('admin');
    // Submit the form
    cy.get('.auth-form').submit();
    
    cy.wait('@loginUser').then(({ response }) => {
      if (response) {
        const userId = response.body.user._id;
        console.log('Extracted userId:', userId);
        cy.request('DELETE', `http://localhost:3000/delete-user/${userId}`).then((response) => {
          expect(response.status).to.eq(200);
        });
      }
    });
  });
});
