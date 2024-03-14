import { describe, it, expect, vi  } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from "react-router-dom";
import '@testing-library/jest-dom/vitest';
import Dashboard from '../../../src/pages/dashboard';
import userEvent from '@testing-library/user-event';

vi.mock('../../../src/services/api-service', () => ({
  getRecipes: vi.fn().mockResolvedValue({
    data: [
      {
        _id: "65eb08d0290a7f96cc2419ce",
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
        ],
        favouritedBy: [],
        __v: 0
      },
      {
        _id: "65ec6f5dc151ff6e1ae8c3f4",
        title: "Volcan de Chocolate",
        shortDescription: "Volcan de chocolate",
        longDescription: "Postre de chocolate con helado",
        imageUrl: "https://res.cloudinary.com/dz1qipahy/image/upload/v1709993757/jqicrum8ktm0zgdo3kce.jpg",
        category: "Desserts",
        servings: 2,
        duration: 30,
        ingredients: [
            "Chocolate",
            "Harina",
            "Huevo",
            "Helado"
        ],
        method: [
            "Preparar el volcan y servir con helado"
        ],
        favouritedBy: [
            "65eaf363c786cf9cc79dea89"
        ],
        __v: 1
      }
    ],
    message: "Successfully retrieved recipes for user",
  }),
}));

describe('Dashboard Component', () => {
  it('renders category filter buttons', async () => {
    render(
      <Router>
        <Dashboard />
      </Router>
    );

    const categories = ["All Recipes", "Starters", "Mains", "Sides", "Desserts", "Bakery", "Drinks", "Favourites"];
    for (const category of categories) {
      expect(screen.getByRole('button', { name: category })).toBeInTheDocument();
    }
  });

  it('renders correctly with mock data', async () => {
    render(
      <Router>
        <Dashboard />
      </Router>
    );

    
    expect(await screen.findByText('Colita de Cuadril')).toBeInTheDocument();
    expect(await screen.findByText('Volcan de Chocolate')).toBeInTheDocument();
    
  });

  it('clicks on the "Mains" category button', async () => {
    render(
      <Router>
        <Dashboard />
      </Router>
    );
    
    const mainsButton = screen.getByRole('button', { name: 'Mains' });
    fireEvent.click(mainsButton);
  });

  it('filtering "Mains" category button works', async () => {
    render(
      <Router>
        <Dashboard />
      </Router>
    );
    
    const mainsButton = screen.getByRole('button', { name: 'Mains' });
    fireEvent.click(mainsButton);
    expect(await screen.findByText('Colita de Cuadril')).toBeInTheDocument();
    
    expect(screen.queryByText('Volcan de Chocolate')).not.toBeInTheDocument();
  });

  it('allows user to type in the search bar and filter', async () => {
    render(
      <Router>
        <Dashboard />
      </Router>
    );
    
    const searchInput = screen.getByPlaceholderText('Search here...');
    expect(searchInput).toBeInTheDocument();
    
    await userEvent.type(searchInput, 'colita');
    expect(await screen.findByText('Colita de Cuadril')).toBeInTheDocument();
    expect(screen.queryByText('Volcan de Chocolate')).not.toBeInTheDocument();
  });
});
