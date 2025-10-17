import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import UploadPage from './UploadPage';

// Mock fetch globally
global.fetch = vi.fn();

// Render helper
const renderWithRouter = (component) =>
  render(<BrowserRouter>{component}</BrowserRouter>);

describe('UploadPage', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('renders upload page with correct heading and elements', () => {
    renderWithRouter(<UploadPage />);

    expect(screen.getByText('Upload Credit Report')).toBeInTheDocument();
    expect(screen.getByText('Drop your XML file here')).toBeInTheDocument();
    expect(screen.getByText('Choose File')).toBeInTheDocument();
    expect(screen.getByText('Before you upload')).toBeInTheDocument();
  });
  
  it('displays validation error for file too large', async () => {
    const user = userEvent.setup();
    const { container } = renderWithRouter(<UploadPage />);

    const input = container.querySelector('input[type="file"]');
    const largeContent = new Array(3 * 1024 * 1024).fill('x').join(''); // 3 MB
    const file = new File([largeContent], 'test.xml', { type: 'text/xml' });
    

    await user.upload(input, file);

    await waitFor(() => {
      expect(screen.getByText(/File is too large/i)).toBeInTheDocument();
    });
  });

  it('successfully uploads file and shows success message', async () => {
    const user = userEvent.setup();

    fetch.mockResolvedValueOnce({
      json: async () => ({ message: 'File uploaded successfully' }),
    });

    const { container } = renderWithRouter(<UploadPage />);

    const input = container.querySelector('input[type="file"]');
    const file = new File(['sample content'], 'test.xml', { type: 'text/xml' });

    await user.upload(input, file);

    await waitFor(() => {
      expect(screen.getByText('File uploaded successfully')).toBeInTheDocument();
      expect(screen.getByText('View Reports')).toBeInTheDocument();
    }, { timeout: 3000 });

  });
});
