import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test/utils/test-utils";
import userEvent from "@testing-library/user-event";
import { AccessibleButton } from "../AccessibleButton";

// Mock the accessibility utility
vi.mock("@/utils/accessibility", () => ({
  keyboardNavigation: {
    handleActivation: vi.fn((event, callback) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        callback();
      }
    }),
  },
}));

describe("AccessibleButton", () => {
  it("renders with default props", () => {
    render(<AccessibleButton>Click me</AccessibleButton>);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Click me");
    expect(button).toHaveAttribute("type", "button");
    expect(button).not.toBeDisabled();
  });

  it("renders with different variants", () => {
    const { rerender } = render(
      <AccessibleButton variant="primary">Primary</AccessibleButton>,
    );
    let button = screen.getByRole("button");
    expect(button).toHaveClass(
      "bg-blue-600",
      "text-white",
      "hover:bg-blue-700",
      "focus:ring-blue-500",
    );

    rerender(
      <AccessibleButton variant="secondary">Secondary</AccessibleButton>,
    );
    button = screen.getByRole("button");
    expect(button).toHaveClass(
      "bg-gray-200",
      "text-gray-900",
      "hover:bg-gray-300",
      "focus:ring-gray-500",
    );

    rerender(<AccessibleButton variant="danger">Danger</AccessibleButton>);
    button = screen.getByRole("button");
    expect(button).toHaveClass(
      "bg-red-600",
      "text-white",
      "hover:bg-red-700",
      "focus:ring-red-500",
    );

    rerender(<AccessibleButton variant="ghost">Ghost</AccessibleButton>);
    button = screen.getByRole("button");
    expect(button).toHaveClass(
      "text-gray-700",
      "hover:bg-gray-100",
      "focus:ring-gray-500",
    );
  });

  it("renders with different sizes", () => {
    const { rerender } = render(
      <AccessibleButton size="sm">Small</AccessibleButton>,
    );
    let button = screen.getByRole("button");
    expect(button).toHaveClass("px-3", "py-1.5", "text-sm");

    rerender(<AccessibleButton size="md">Medium</AccessibleButton>);
    button = screen.getByRole("button");
    expect(button).toHaveClass("px-4", "py-2", "text-sm");

    rerender(<AccessibleButton size="lg">Large</AccessibleButton>);
    button = screen.getByRole("button");
    expect(button).toHaveClass("px-6", "py-3", "text-base");
  });

  it("handles click events", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<AccessibleButton onClick={handleClick}>Click me</AccessibleButton>);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("handles keyboard activation", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<AccessibleButton onClick={handleClick}>Click me</AccessibleButton>);

    const button = screen.getByRole("button");
    button.focus();

    await user.keyboard("{Enter}");
    expect(handleClick).toHaveBeenCalledTimes(1);

    await user.keyboard(" ");
    expect(handleClick).toHaveBeenCalledTimes(2);
  });

  it("shows loading state", () => {
    render(
      <AccessibleButton loading loadingText="Saving...">
        Save
      </AccessibleButton>,
    );

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-disabled", "true");
    expect(button).toHaveAttribute("aria-busy", "true");

    // Check for loading spinner
    const spinner = button.querySelector("svg");
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass("animate-spin");

    // Check for loading text
    expect(
      screen.getByText("Saving...", { selector: ".sr-only" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Save", { selector: ".sr-only" }),
    ).toBeInTheDocument();
  });

  it("handles disabled state", () => {
    render(<AccessibleButton disabled>Disabled</AccessibleButton>);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-disabled", "true");
    expect(button).toHaveClass(
      "disabled:opacity-50",
      "disabled:cursor-not-allowed",
    );
  });

  it("prevents click when disabled", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(
      <AccessibleButton disabled onClick={handleClick}>
        Disabled
      </AccessibleButton>,
    );

    const button = screen.getByRole("button");
    await user.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it("prevents click when loading", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(
      <AccessibleButton loading onClick={handleClick}>
        Loading
      </AccessibleButton>,
    );

    const button = screen.getByRole("button");
    await user.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it("applies custom className", () => {
    render(
      <AccessibleButton className="custom-button-class">
        Custom
      </AccessibleButton>,
    );

    const button = screen.getByRole("button");
    expect(button).toHaveClass("custom-button-class");
  });

  it("forwards ref correctly", () => {
    const ref = vi.fn();
    render(<AccessibleButton ref={ref}>Ref test</AccessibleButton>);

    expect(ref).toHaveBeenCalled();
  });

  it("handles custom onKeyDown", async () => {
    const handleKeyDown = vi.fn();
    const user = userEvent.setup();

    render(
      <AccessibleButton onKeyDown={handleKeyDown}>Key test</AccessibleButton>,
    );

    await user.keyboard("{Enter}");

    expect(handleKeyDown).toHaveBeenCalled();
  });

  it("has proper accessibility attributes", () => {
    render(<AccessibleButton>Accessible</AccessibleButton>);

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveClass(
      "focus:outline-none",
      "focus:ring-2",
      "focus:ring-offset-2",
    );
  });

  it("shows correct loading text", () => {
    render(
      <AccessibleButton loading loadingText="Processing...">
        Process
      </AccessibleButton>,
    );

    expect(
      screen.getByText("Processing...", { selector: ".sr-only" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Process", { selector: ".sr-only" }),
    ).toBeInTheDocument();
  });

  it("handles all button HTML attributes", () => {
    render(
      <AccessibleButton
        type="submit"
        form="test-form"
        name="test-button"
        value="test-value"
        data-testid="test-button"
      >
        Submit
      </AccessibleButton>,
    );

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("type", "submit");
    expect(button).toHaveAttribute("form", "test-form");
    expect(button).toHaveAttribute("name", "test-button");
    expect(button).toHaveAttribute("value", "test-value");
    expect(button).toHaveAttribute("data-testid", "test-button");
  });

  it("maintains focus styles", () => {
    render(<AccessibleButton>Focus test</AccessibleButton>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass(
      "focus:outline-none",
      "focus:ring-2",
      "focus:ring-offset-2",
    );
  });

  it("handles loading state with custom loading text", () => {
    render(
      <AccessibleButton loading loadingText="Uploading file...">
        Upload
      </AccessibleButton>,
    );

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(
      screen.getByText("Uploading file...", { selector: ".sr-only" }),
    ).toBeInTheDocument();
  });
});
