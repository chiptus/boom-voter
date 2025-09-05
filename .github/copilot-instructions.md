# Copilot Custom Instructions

see CLAUDE.md for more details and rules.

## Function Definitions After Return in React Components

In this codebase, it is acceptable and preferred to define helper functions (such as event handlers) after the main component’s return statement. This style improves readability by keeping the primary component logic at the top and allowing additional details to be found below. JavaScript and TypeScript support function hoisting for function declarations, so this pattern is safe and intentional. Please do not flag this as a style issue in reviews.
