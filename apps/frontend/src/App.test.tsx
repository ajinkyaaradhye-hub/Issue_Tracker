import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';

test('renders login page when not authenticated', async () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  await waitFor(() => {
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });
});
