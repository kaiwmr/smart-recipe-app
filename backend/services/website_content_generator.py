import httpx
from bs4 import BeautifulSoup
from services import ai_content_normalizer
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type, retry_if_exception

# Erlaubte Fehler für einen Retry:
# 1. TimeoutException: Webseite braucht zu lange zum Antworten
# 2. ConnectError: Kurzer Verbindungsabbruch
# 3. ValueError: Gemini hat sich beim JSON vertippt (Normalizer stürzt ab)
RETRY_EXCEPTIONS = (httpx.TimeoutException, httpx.ConnectError, ValueError)

# Filterfunktion: nur bei 5xx HTTPStatusError retryen
def retry_if_server_error(exc):
    return isinstance(exc, httpx.HTTPStatusError) and 500 <= exc.response.status_code < 600

@retry(
    stop=stop_after_attempt(3),  # 1 ursprünglicher Versuch + 2 Retries
    wait=wait_exponential(multiplier=1, min=2),  # Retry 1: 2s, Retry 2: 4s
    retry=retry_if_exception_type(RETRY_EXCEPTIONS) | retry_if_exception(retry_if_server_error),
    reraise=True  # Fehler nach letzter Wiederholung erneut werfen
)
async def scrape_and_generate(url: str) -> dict:
    
    headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers)
        response.raise_for_status() # Fehlercodes (400, 401, 403, 404, 500 usw.) -> HTTPError wird ausgelöst

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

    recipe_data = await ai_content_normalizer.call_gemini(clean_html)
    return recipe_data
