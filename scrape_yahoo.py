import sys
import json
import requests
import urllib.parse
from bs4 import BeautifulSoup
import time

def search_ddg_image(query):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
    }
    encoded_query = urllib.parse.quote(query)
    # Using duckduckgo lite to avoid JS heavy scraping
    url = f"https://lite.duckduckgo.com/lite/"
    
    data = {
        'q': query + ' shopee',
        'kl': 'br-pt'
    }
    
    try:
        # DDG Lite doesn't have an explicit image tab, but let's see if we can extract thumbnails
        # Actually, DDG Lite might not return images easily.
        # Let's try Yahoo Image search, which is usually less strict than Google
        yahoo_url = f"https://images.search.yahoo.com/search/images?p={encoded_query}"
        res = requests.get(yahoo_url, headers=headers, timeout=5)
        soup = BeautifulSoup(res.text, 'html.parser')
        
        # Find first image
        for img in soup.find_all('img'):
            src = img.get('src') or img.get('data-src')
            if src and src.startswith('http') and 'yimg.com' in src:
                return src
                
    except Exception as e:
        return None
    
    return None

if __name__ == "__main__":
    if len(sys.argv) > 1:
        # Test mode
        q = " ".join(sys.argv[1:])
        print(f"Buscando: {q}")
        url = search_ddg_image(q)
        print(f"Resultado: {url}")
    else:
        # Batch mode (reads shopee.xlsx and writes back)
        try:
            import pandas as pd
            df = pd.read_excel('shopee.xlsx')
            
            found_count = 0
            print(f"Buscando imagens para {len(df)} produtos...")
            
            for index, row in df.iterrows():
                titulo = str(row['Titulo'])
                
                # if already has valid image, skip
                if pd.notna(row['Imagem']) and str(row['Imagem']).startswith('http'):
                    continue
                    
                # Search using first 5 words of title to keep query simple
                simple_query = " ".join(titulo.split()[:5])
                print(f"[{index+1}/{len(df)}] {simple_query}...", end=" ", flush=True)
                
                img_url = search_ddg_image(simple_query)
                if img_url:
                    df.at[index, 'Imagem'] = img_url
                    found_count += 1
                    print("✅")
                else:
                    print("❌")
                    
                time.sleep(1) # Prevent rate limits
                
            df.to_excel('shopee.xlsx', index=False)
            print(f"\nFinalizado! {found_count} novas imagens encontradas via Yahoo Images.")
            
        except Exception as e:
            print(f"Erro no modo batch: {e}")
