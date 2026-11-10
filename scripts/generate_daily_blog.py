import os
import sys
import json
import re
import datetime
import urllib.request
import urllib.error

# Blog generation script for Cocoon
def generate_blog(groq_api_key=None, dry_run=False):
    key = groq_api_key or os.environ.get("GROQ_API_KEY")
    if not key:
        raise ValueError("GROQ_API_KEY environment variable is required to generate daily blog.")
    
    # Read existing slugs
    with open("src/data/blogPosts.js", "r", encoding="utf-8") as f:
        content = f.read()
    
    existing_slugs = re.findall(r'slug:\s*["\']([^"\']+)["\']', content)
    print(f"Existing blog count: {len(existing_slugs)}")

    # Prompt Groq for a new blog post in pure JSON format
    prompt = f"""You are the lead content writer and master artisan at Cocoon (gococoon.store), founded by Mehak Agarwal.
Cocoon crafts 100% hypoallergenic organic milk cotton crochet bags, bandanas, waist wraps, scrunchies, and heirloom accessories in India.

Generate a brand-new, unique, highly engaging editorial blog post for our artisan journal.
DO NOT use any of these existing slugs: {json.dumps(existing_slugs)}

The blog post MUST be strictly returned as a single JSON object with these exact keys:
{{
  "slug": "url-friendly-kebab-case-slug",
  "title": "Engaging editorial title (max 75 chars)",
  "subtitle": "Informative subtitle highlighting slow fashion / organic milk cotton / styling (max 140 chars)",
  "readTime": "5 min read",
  "author": "Mehak Agarwal",
  "authorRole": "Founder and Lead Artisan at Cocoon",
  "image": "/products/items/chocolate-bow-handbag.jpg",
  "tags": ["Tag1", "Tag2", "Tag3", "Tag4"],
  "excerpt": "Compelling 2-sentence summary for search engines.",
  "metaDescription": "SEO meta description under 155 characters.",
  "relatedCategory": "bags",
  "faqs": [
    {{"question": "FAQ Question 1?", "answer": "Clear factual answer referencing Cocoon and milk cotton."}},
    {{"question": "FAQ Question 2?", "answer": "Clear factual answer."}}
  ],
  "content": "HTML string containing <h2>, <p>, <ul>, <li>, <strong> sections. Rich, educational, authentic craftsmanship details. Minimum 400 words."
}}

Valid relatedCategory values: "bags", "hair-accessories", "bandanas", "belts", "keychains", "mobile-covers".
Valid image paths: 
"/products/items/chocolate-bow-handbag.jpg",
"/products/items/sunflower-baguette-shoulder-bag.jpg",
"/products/items/pink-crochet-waist-scarf.jpg",
"/products/items/candy-festive-crochet-scrunchie.jpg",
"/products/items/burgundy-triangle-bandana.jpg",
"/products/items/lilac-mesh-headband.jpg",
"/products/items/sunflower-granny-backpack.jpg",
"/products/items/chunky-ruffled-scrunchie-yellow-cream.jpg"

Output ONLY valid JSON. No markdown backticks, no preamble.
"""

    headers = {
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0"
    }
    body = json.dumps({
        "model": "openai/gpt-oss-120b",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7
    }).encode("utf-8")

    req = urllib.request.Request("https://api.groq.com/openai/v1/chat/completions", data=body, headers=headers)
    with urllib.request.urlopen(req) as resp:
        res = json.loads(resp.read().decode("utf-8"))
        raw_text = res["choices"][0]["message"]["content"].strip()

    # Clean markdown if present
    if raw_text.startswith("```"):
        raw_text = re.sub(r"^```(?:json)?\n?", "", raw_text)
        raw_text = re.sub(r"\n?```$", "", raw_text)

    post_data = json.loads(raw_text)
    today = datetime.date.today().isoformat()
    post_data["date"] = today

    print(f"Generated new post: '{post_data['title']}' (slug: {post_data['slug']})")

    if dry_run:
        print("[DRY RUN] Skipping write to src/data/blogPosts.js")
        return post_data

    # Format JavaScript object string
    js_post = f"""  {{
    slug: {json.dumps(post_data['slug'])},
    title: {json.dumps(post_data['title'])},
    subtitle: {json.dumps(post_data['subtitle'])},
    date: {json.dumps(post_data['date'])},
    readTime: {json.dumps(post_data['readTime'])},
    author: {json.dumps(post_data['author'])},
    authorRole: {json.dumps(post_data['authorRole'])},
    image: {json.dumps(post_data['image'])},
    tags: {json.dumps(post_data['tags'])},
    excerpt: {json.dumps(post_data['excerpt'])},
    metaDescription: {json.dumps(post_data['metaDescription'])},
    relatedCategory: {json.dumps(post_data['relatedCategory'])},
    faqs: {json.dumps(post_data.get('faqs', []))},
    content: `{post_data['content']}`
  }},
"""

    marker = "export const BLOG_POSTS = [\n"
    idx = content.find(marker)
    if idx == -1:
        raise ValueError("Could not find BLOG_POSTS marker in src/data/blogPosts.js")

    insert_idx = idx + len(marker)
    updated_content = content[:insert_idx] + js_post + content[insert_idx:]

    with open("src/data/blogPosts.js", "w", encoding="utf-8") as f:
        f.write(updated_content)

    print("Successfully published new post into src/data/blogPosts.js!")
    return post_data

if __name__ == "__main__":
    is_dry = "--dry-run" in sys.argv
    generate_blog(dry_run=is_dry)
