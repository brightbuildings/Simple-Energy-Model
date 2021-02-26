import React from "react";
import { render, screen } from '@testing-library/react';
import Header from './Header';


test("renders branding", () => {
  render(<Header />);
  expect(screen.getByText("Bright Buildings")).toBeInTheDocument();
  expect(screen.getByText("Simple Energy Model")).toBeInTheDocument();
});