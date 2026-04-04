import axios from 'axios';

/**
 * Service to fetch repository contents from GitHub API
 * Public repos only.
 */
export class GitHubService {
  private static BASE_URL = 'https://api.github.com';

  static async fetchRepoContents(owner: string, repo: string, path: string = '') {
    try {
      const response = await axios.get(`${this.BASE_URL}/repos/${owner}/${repo}/contents/${path}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching GitHub repo: ${error.message}`);
      throw new Error('Could not fetch repository contents. Check if it is public.');
    }
  }

  static async fetchFileContent(url: string) {
    try {
      const response = await axios.get(url);
      // GitHub API returns base64 content for file data
      if (response.data.content && response.data.encoding === 'base64') {
        return Buffer.from(response.data.content, 'base64').toString('utf-8');
      }
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching file content: ${error.message}`);
      throw new Error('Could not fetch file content.');
    }
  }
}
