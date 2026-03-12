# GitHub User Activity CLI

A lightweight command-line interface (CLI) built with **Node.js** that fetches and summarizes recent activity for any GitHub user.

This project was built as a learning exercise to practice interacting with REST APIs using native Node.js features, handling asynchronous data, and implementing data aggregation without external dependencies.

## Features

- **Real-time Data**: Fetches the most recent public events directly from the GitHub API.
- **Smart Aggregation**: Instead of a "wall of text," multiple commits to the same repository are summed up into a single line.
- **Robust Error Handling**:
  - Gracefully handles **404 Not Found** errors for invalid usernames.
  - Detects and reports **API Rate Limiting** with a countdown until reset.
  - Manages network connectivity issues.
- **Zero Dependencies**: Built entirely with native Node.js (no `axios`, `dotenv`, or `chalk` required).

## Prerequisites

- **Node.js**: Version 18.0.0 or higher (required for native `fetch` support).

## Installation

1. **Clone the repository**:
   ```bash
   git clone [https://github.com/your-username/github-activity-cli.git](https://github.com/your-username/github-activity-cli.git)
   cd github-activity-cli
   ```
