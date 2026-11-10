import urllib.request
import urllib.parse
import json

def ping_engines():
    sitemap_url = "https://www.gococoon.store/sitemap.xml"
    print(f"Pinging search engines for sitemap: {sitemap_url}")

    # 1. Bing Ping
    try:
        bing_url = f"https://www.bing.com/ping?sitemap={urllib.parse.quote(sitemap_url)}"
        req = urllib.request.Request(bing_url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=10) as resp:
            print(f"  Bing Ping Status: {resp.status}")
    except Exception as e:
        print(f"  Bing Ping: {e}")

    # 2. IndexNow Ping (covers Bing, Copilot, Seznam, Yandex)
    try:
        indexnow_url = "https://api.indexnow.org/indexnow"
        payload = json.dumps({
            "host": "www.gococoon.store",
            "key": "03F5A5A02DCA945B4D9EBACC8CFEC530",
            "keyLocation": "https://www.gococoon.store/03F5A5A02DCA945B4D9EBACC8CFEC530.txt",
            "urlList": [
                "https://www.gococoon.store",
                "https://www.gococoon.store/blog",
                sitemap_url
            ]
        }).encode("utf-8")
        req = urllib.request.Request(indexnow_url, data=payload, headers={"Content-Type": "application/json; charset=utf-8"}, method="POST")
        with urllib.request.urlopen(req, timeout=10) as resp:
            print(f"  IndexNow Ping Status: {resp.status}")
    except Exception as e:
        print(f"  IndexNow Ping: {e}")

    print("Search engine notification complete.")

if __name__ == "__main__":
    ping_engines()
