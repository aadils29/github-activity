const username = process.argv[2];

if (!username) {
  console.error("Please provide a GitHub username as an argument.");
  process.exit(1);
}

async function fetchGitHubUser(username) {
  const url = `https://api.github.com/users/${username}/events`;

  // We use a try/catch here to handle network-level failures (like no internet)
  try {
    const response = await fetch(url, { headers: { "User-Agent": "Node.js" } });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`User '${username}' not found.`);
      }
      throw new Error(`GitHub API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    // This catches both our "throw" errors and network failures
    console.error(error.message);
    process.exit(1);
  }
}

// Wrapping the execution so 'await' works everywhere
async function run() {
  const activity = await fetchGitHubUser(username);

  if (activity && activity.length > 0) {
    console.log(
      `Successfully fetched ${activity.length} events for ${username}.`,
    );
    // Phase 2 Check: Log the first event to see the structure
    console.log("Sample Event Type:", activity[0].type);
  } else {
    console.log("No recent public activity found for this user.");
  }
}

run();
