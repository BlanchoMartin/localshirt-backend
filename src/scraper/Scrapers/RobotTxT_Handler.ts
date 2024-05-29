import axios from 'axios';

export async function IsPathAllowed(
  baseURL: string,
  userAgent: string,
  path: string,
): Promise<boolean> {
  try {
    const robotsTxtResponse = await axios.get(`${baseURL}/robots.txt`);
    const robotsTxtContent = robotsTxtResponse.data;
    const robotsTxtLines = robotsTxtContent.split('\n');

    let isUserAgentMatch = false;
    for (const line of robotsTxtLines) {
      if (line.toLowerCase().startsWith('user-agent')) {
        const agent = line.split(':')[1].trim().toLowerCase();
        if (agent === '*' || agent === userAgent.toLowerCase()) {
          isUserAgentMatch = true;
        } else {
          isUserAgentMatch = false;
        }
      }

      if (isUserAgentMatch) {
        if (line.toLowerCase().startsWith('disallow')) {
          const disallowedPath = line.split(':')[1].trim();
          if (path.startsWith(disallowedPath)) {
            return false;
          }
        }

        if (line.toLowerCase().startsWith('allow')) {
          const allowedPath = line.split(':')[1].trim();
          if (path.startsWith(allowedPath)) {
            return true;
          }
        }
      }
    }

    return true;
  } catch (error) {
    console.error('Error fetching or parsing robots.txt:', error);
    return true;
  }
}

export async function GetCrawlDelay(
  baseURL: string,
  userAgent: string,
): Promise<number | undefined> {
  try {
    const robotsTxtResponse = await axios.get(`${baseURL}/robots.txt`);
    const robotsTxtContent = robotsTxtResponse.data;
    const robotsTxtLines = robotsTxtContent.split('\n');

    let isUserAgentMatch = false;
    for (const line of robotsTxtLines) {
      if (line.toLowerCase().startsWith('user-agent')) {
        const agent = line.split(':')[1].trim().toLowerCase();
        if (agent === '*' || agent === userAgent.toLowerCase()) {
          isUserAgentMatch = true;
        } else {
          isUserAgentMatch = false;
        }
      }

      if (isUserAgentMatch) {
        if (line.toLowerCase().startsWith('crawl-delay')) {
          const crawlDelay = parseInt(line.split(':')[1].trim());
          if (!isNaN(crawlDelay)) {
            return crawlDelay;
          }
        }
      }
    }

    return undefined;
  } catch (error) {
    console.error('Error fetching or parsing robots.txt:', error);
    return undefined;
  }
}
