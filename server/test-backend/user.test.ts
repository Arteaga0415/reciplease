import request from './jest.setup';

describe('User Registration and Login', () => {

  it('should register a user', async () => {
    const userData = { firstName: 'test', email: 'test@example.com', password: 'password123' };
    const response = await request.post('/register').send(userData);
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });

  it('should fail to register a user with an existing email', async () => {
    const userData = { firstName: 'test', email: 'test@example.com', password: 'password123' };
    const response = await request.post('/register').send(userData);
    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
  });

  it('should log in a user with an existing email', async () => {
    const userData = { email: 'test@example.com', password: 'password123' };
    const response = await request.post('/login').send(userData);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('should fail to log in a user with an wrong email', async () => {
    const userData = { email: 'wrong@example.com', password: 'password123' };
    const response = await request.post('/login').send(userData);
    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it('should add the recipe', async () => {
    const userData = { email: 'test@example.com', password: 'password123' };
    const user = await request.post('/login').send(userData);
    const userID = user.body.user._id;
    const recipeData = {
      recipe: {
        title: "Colita de Cuadril",
        shortDescription: "Carne de Res",
        longDescription: "Tri-tip",
        imageUrl: "https://res.cloudinary.com/dz1qipahy/image/upload/v1709901962/vl2n6sk7j0vkjdtbjeiz.jpg",
        category: "Mains",
        servings: 4,
        duration: 30,
        ingredients: [
          "Chimichurry",
          "Tri-tip",
          "coal"
        ],
        method: [
          "Cut diagonally"
        ]
      },
      id: userID
    };
    const response = await request.post('/create-recipe').send(recipeData);
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });

  it('should get a recipe for a user with id number', async () => {
    const userData = { email: 'test@example.com', password: 'password123' };
    const user = await request.post('/login').send(userData);
    const userID = user.body.user._id;
    const response = await request.get(`/dashboard/${userID}`);

   expect(response.status).toBe(200);
   expect(response.body.success).toBe(true);
  });

  it('should toggle a recipe as favorite', async () => {
    const userData = { email: 'test@example.com', password: 'password123' };
    const user = await request.post('/login').send(userData);
    const userID = user.body.user._id;
    const recipe = await request.get(`/dashboard/${userID}`);
    const recipeID = recipe.body.data[0]._id;
    const toggleFavoriteData = {
      recipeId: recipeID,
      userId: userID
    };
    const toggleResponse = await request.post('/favourite-recipe').send(toggleFavoriteData);
    expect(toggleResponse.status).toBe(201);
  });

  it('should delete a recipe', async () => {
    const userData = { email: 'test@example.com', password: 'password123' };
    const user = await request.post('/login').send(userData);
    const userID = user.body.user._id;
    const recipe = await request.get(`/dashboard/${userID}`);
    const recipeID = recipe.body.data[0]._id;
    const deleteResponse = await request.delete(`/delete-recipe/${userID}/${recipeID}`);
    expect(deleteResponse.status).toBe(200); 
  });

  it('should delete the user', async () => {
    const userData = { email: 'test@example.com', password: 'password123' };
    const user = await request.post('/login').send(userData);
    const userID = user.body.user._id;
    const response = await request.delete(`/delete-user/${userID}`);

   expect(response.status).toBe(200);
   expect(response.body.success).toBe(true);
  });
});
