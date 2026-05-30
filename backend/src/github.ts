import axios from 'axios';

const CODE_EXTENSIONS = new Set([
  'js', 'jsx', 'ts', 'tsx', 'py', 'java', 'c', 'cpp', 'h', 'hpp',
  'cs', 'go', 'rs', 'rb', 'php', 'swift', 'kt', 'scala', 'vue',
  'svelte', 'html', 'css', 'scss', 'less', 'sql', 'sh', 'bash',
  'yaml', 'yml', 'json', 'xml', 'toml', 'md', 'txt', 'env',
  'dockerfile', 'makefile', 'gradle', 'cmake',
]);

const MAX_FILES = 40;
const MAX_FILE_SIZE = 100_000; // 100 KB

/**
 * Service to fetch repository contents from GitHub API.
 * Public repos only.
 */
export class GitHubService {
  private static BASE_URL = 'https://api.github.com';

  private static headers() {
    const h: Record<string, string> = { Accept: 'application/vnd.github.v3+json' };
    if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    return h;
  }

  /**
   * Fetch a flat list of code files from a repo using the Git Trees API (recursive).
   * Returns { files: [{ name, path, content }] }
   */
  static async fetchRepoTree(owner: string, repo: string, branch: string = 'main') {
    // 1. Try the specified branch, fallback to 'master'
    let treeData: any;
    for (const ref of [branch, 'master']) {
      try {
        const res = await axios.get(
          `${this.BASE_URL}/repos/${owner}/${repo}/git/trees/${ref}?recursive=1`,
          { headers: this.headers() }
        );
        treeData = res.data;
        break;
      } catch {
        // try next ref
      }
    }
    if (!treeData) throw new Error('Could not fetch repo tree. Check the URL and ensure the repo is public.');

    // 2. Filter to code blobs only
    const blobs = (treeData.tree as any[])
      .filter((item: any) => {
        if (item.type !== 'blob') return false;
        if (item.size > MAX_FILE_SIZE) return false;
        const ext = item.path.split('.').pop()?.toLowerCase() || '';
        const baseName = item.path.split('/').pop()?.toLowerCase() || '';
        return CODE_EXTENSIONS.has(ext) || CODE_EXTENSIONS.has(baseName);
      })
      .slice(0, MAX_FILES);

    // 3. Fetch content for each blob in parallel (batched)
    const files = await Promise.all(
      blobs.map(async (blob: any) => {
        try {
          const res = await axios.get(
            `${this.BASE_URL}/repos/${owner}/${repo}/contents/${blob.path}`,
            { headers: this.headers() }
          );
          let content = '';
          if (res.data.content && res.data.encoding === 'base64') {
            content = Buffer.from(res.data.content, 'base64').toString('utf-8');
          }
          return { name: blob.path.split('/').pop(), path: blob.path, content };
        } catch {
          return null;
        }
      })
    );

    return { files: files.filter(Boolean) };
  }

  static async fetchRepoContents(owner: string, repo: string, path: string = '') {
    try {
      const response = await axios.get(
        `${this.BASE_URL}/repos/${owner}/${repo}/contents/${path}`,
        { headers: this.headers() }
      );
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching GitHub repo: ${error.message}`);
      throw new Error('Could not fetch repository contents. Check if it is public.');
    }
  }

  static async fetchFileContent(url: string) {
    try {
      const response = await axios.get(url, { headers: this.headers() });
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

