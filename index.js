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
  } else {
    console.log("No recent public activity found for this user.");
  }

  const pushSummaryByRepo = new Map();

  activity.forEach((event) => {
    if (event.type === "PushEvent") {
      const repoName = event.repo ? event.repo.name : "unknown repo";
      // Fallback logic: if size/commits are missing from payload, assume 1.
      const size = event.payload.size;
      const commitsArr = event.payload.commits?.length;
      const commitCount = size || commitsArr || 1;
      pushSummaryByRepo.set(
        repoName,
        (pushSummaryByRepo.get(repoName) || 0) + commitCount,
      );
    }
  });

  activity.forEach((event) => {
    let action = "";
    const repoName = event.repo ? event.repo.name : "unknown repo";

    switch (event.type) {
      case "PushEvent":
        // Push events are summarized after listing non-push events.
        return;

      case "WatchEvent":
        action = `Starred ${repoName}`;
        break;

      case "CreateEvent":
        // Handles creating a branch, tag, or the repo itself
        const type = event.payload.ref_type; // 'branch', 'tag', or 'repository'
        action = `Created a ${type} in ${repoName}`;
        break;

      case "IssuesEvent":
        action = `${event.payload.action.charAt(0).toUpperCase() + event.payload.action.slice(1)} an issue in ${repoName}`;
        break;

      case "PullRequestEvent":
        action = `${event.payload.action.charAt(0).toUpperCase() + event.payload.action.slice(1)} a pull request in ${repoName}`;
        break;

      case "IssueCommentEvent":
        action = `Commented on an issue in ${repoName}`;
        break;

      case "DeleteEvent":
        action = `Deleted ${event.payload.ref_type} ${event.payload.ref} from ${repoName}`;
        break;

      default:
        // Instead of "Did something", let's at least show the event type
        const cleanName = event.type.replace("Event", "");
        action = `${cleanName} activity in ${repoName}`;
    }
    console.log(`- ${action}`);
  });

  if (pushSummaryByRepo.size > 0) {
    for (const [repoName, commitCount] of pushSummaryByRepo.entries()) {
      console.log(`- Pushed ${commitCount} commit(s) to ${repoName}`);
    }
  }
}

run();
