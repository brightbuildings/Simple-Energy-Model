import React from "react";
import { render, screen } from '@testing-library/react';
import Footer from './Footer';


test("renders branding", () => {
  render(<Footer />);
  const year = new Date().getFullYear();
  expect(screen.getByText("Bright Buildings "+year)).toBeInTheDocument();
});