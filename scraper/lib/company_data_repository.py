from lib.company_data import CompanyData
from urllib.parse import urljoin, urlparse
import requests
from bs4 import BeautifulSoup
import re

# Keywords used to identify pages likely to contain company values
PAGE_KEYWORDS = [
    'about', 'values', 'our-values', 'mission', 'culture', 'team',
    'careers', 'about-us', 'what-we-do', 'purpose', 'manifesto',
    'impact', 'diversity', 'inclusion', 'why-join', 'life-at',
    'who-we-are', 'our-story', 'sustainability', 'people',
]

# Keywords used to identify relevant text content within a page
CONTENT_KEYWORDS = [
    'value', 'mission', 'vision', 'ethos', 'belief', 'culture',
    'we believe', 'we are', "we're", 'our people', 'our team',
    'passionate', 'committed', 'purpose', 'impact', 'sustainability',
    'inclusion', 'diversity', 'trust', 'transparency', 'innovation',
    'collaboration', 'growth', 'community', 'responsibility',
]

MAX_PAGES = 5        # max subpages to scrape
MAX_TEXT_LEN = 300   # max characters kept per paragraph block

HEADERS = {
    'User-Agent': (
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) '
        'AppleWebKit/537.36 (KHTML, like Gecko) '
        'Chrome/120.0.0.0 Safari/537.36'
    )
}


class CompanyDataRepository:

    def __init__(self):
        self.extracted_values = []
        self.searched_links = []

    def get_company_values(self, website_url):
        self.extracted_values.clear()
        self.searched_links.clear()

        base_domain = urlparse(website_url).netloc

        try:
            response = requests.get(website_url, timeout=10, headers=HEADERS)
            response.raise_for_status()
        except Exception:
            return "No company values found"

        soup = BeautifulSoup(response.text, 'html.parser')

        # Extract from the main page first
        main_text = self._extract_meaningful_text(soup)
        if main_text:
            self.extracted_values.append(main_text)

        # Find candidate subpage links
        candidate_urls = self._find_candidate_links(soup, website_url, base_domain)

        for url in candidate_urls[:MAX_PAGES]:
            if url in self.searched_links:
                continue
            self.searched_links.append(url)

            try:
                page_response = requests.get(url, timeout=10, headers=HEADERS)
                page_response.raise_for_status()
                page_soup = BeautifulSoup(page_response.text, 'html.parser')
                page_text = self._extract_meaningful_text(page_soup)
                if page_text:
                    self.extracted_values.append(page_text)
            except Exception:
                continue

        if not self.extracted_values:
            return "No company values found"

        # Deduplicate and join, keeping a reasonable total length
        seen = set()
        unique_blocks = []
        for block in self.extracted_values:
            if block not in seen:
                seen.add(block)
                unique_blocks.append(block)

        return "\n\n".join(unique_blocks)

    def _find_candidate_links(self, soup, base_url, base_domain):
        """
        Find links on the page that are likely to lead to company values content.
        Handles relative URLs, absolute URLs, and stays within the same domain.
        """
        candidates = []
        seen_hrefs = set()

        for a_tag in soup.find_all('a', href=True):
            href = a_tag['href'].strip()

            # Skip anchors, javascript, mailto
            if not href or href.startswith('#') or href.startswith('javascript:') or href.startswith('mailto:'):
                continue

            # Resolve relative URLs to absolute
            absolute_url = urljoin(base_url, href)
            parsed = urlparse(absolute_url)

            # Stay on the same domain
            if parsed.netloc != base_domain:
                continue

            # Check if path or link text contains a relevant keyword
            path_lower = parsed.path.lower()
            link_text = a_tag.get_text(strip=True).lower()
            combined = path_lower + ' ' + link_text

            if not any(kw in combined for kw in PAGE_KEYWORDS):
                continue

            # Normalise: strip trailing slash and fragments
            clean_url = absolute_url.split('#')[0].rstrip('/')
            if clean_url in seen_hrefs:
                continue

            seen_hrefs.add(clean_url)
            candidates.append(clean_url)

        return candidates

    def _extract_meaningful_text(self, soup):
        """
        Extract text from semantic HTML elements rather than the whole page.
        Targets <main>, <article>, or falls back to <body>.
        Filters paragraphs and headings that contain relevant keywords.
        """
        # Prefer <main> or <article> to avoid nav/footer noise
        container = soup.find('main') or soup.find('article') or soup.find('body')
        if not container:
            return ""

        # Remove noise tags in-place
        for tag in container.find_all(['nav', 'footer', 'header', 'script', 'style', 'noscript']):
            tag.decompose()

        relevant_blocks = []

        for element in container.find_all(['p', 'h1', 'h2', 'h3', 'li']):
            text = element.get_text(separator=' ', strip=True)

            # Skip very short strings (nav items, labels)
            if len(text) < 30:
                continue

            # Keep only text that contains at least one content keyword
            text_lower = text.lower()
            if not any(kw in text_lower for kw in CONTENT_KEYWORDS):
                continue

            # Truncate long paragraphs to keep the LLM context lean
            if len(text) > MAX_TEXT_LEN:
                text = text[:MAX_TEXT_LEN] + '...'

            relevant_blocks.append(text)

        # Deduplicate while preserving order
        seen = set()
        unique = []
        for block in relevant_blocks:
            normalised = re.sub(r'\s+', ' ', block)
            if normalised not in seen:
                seen.add(normalised)
                unique.append(normalised)

        return '\n'.join(unique)

    def create_company_data(self, company_name, website_url):
        values = self.get_company_values(website_url)
        return CompanyData(
            company_name=company_name,
            website_url=website_url,
            extracted_values=values,
            searched_links=self.searched_links
        )
