import requests
from bs4 import BeautifulSoup
import services.ai_content_normalizer as ai_content_normalizer


def scrape_and_generate(url: str) -> dict:
    
    headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    response = requests.get(url, headers=headers)

    html_content = response.text   

    soup = BeautifulSoup(html_content, "html.parser")

    schemas = []
    for script in soup.find_all('script', type='application/ld+json'):
        schemas.append(str(script))

    allowed_tags = ["h1", "h2", "h3", "p", "ul", "ol", "li", "table", "tr", "td", "th"] 
    for tag in soup.find_all(['script', 'style', 'svg', 'nav', 'footer', 'iframe', 'noscript', 'meta', 'link']):
        tag.decompose()
    for tag in soup.find_all(True):
        if tag.name not in allowed_tags:
            tag.unwrap() 
        tag.attrs = {}

    clean_html = "\n".join(schemas) + str(soup)
    clean_html = " ".join(clean_html.split())

    recipe_data = ai_content_normalizer.call_gemini(clean_html)
    return recipe_data
