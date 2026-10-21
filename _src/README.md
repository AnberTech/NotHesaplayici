# Site kaynağı

Bütün sayfalar (`index.html`, `<dil>/index.html`, hesaplayıcı sayfaları, `privacy.html`, `support.html`) bu klasördeki dosyalardan üretilir. **Üretilen HTML dosyalarını elle düzenleme**; değişikliği burada yap, sonra scripti çalıştır.

```
python3 _src/build.py
```

## Dosyalar

| Dosya | Ne işe yarar |
|---|---|
| `build.py` | Sayfaları, `sitemap.xml` ve `llms.txt` dosyasını üretir; dil dosyalarını denetler |
| `page.html` | Bütün sayfaların ortak iskeleti |
| `i18n/<dil>.json` | Sayfa metinleri. Hangi dilin dosyası varsa o dil üretilir. Kaynak `en.json`, ana dil `tr.json` |
| `legal/<dil>.json` | Gizlilik politikası ve destek sayfası metinleri. Dosyası olmayan dil İngilizce sayfalara bağlanır |
| `og.html` | Paylaşım görseli `assets/img/og.jpg` için kaynak |
| `../assets/app.js` | Tema, dil menüsü ve üç hesaplayıcı (gereken final, ortalama, GANO) |
| `../assets/style.css` | Bütün sayfaların stili |

Ekran görüntüleri `assets/img/ss/<dil>_<ekran>.jpg` (560 px genişlik). Almancada "hesapla" ekranı yok, onun yerine not dökümü kullanılır; Kürtçe sayfa İngilizce ekranları gösterir (`build.py` içindeki `SHOTS`, `SHOT_LANG`).

## Hesap kuralları

Uygulamayla aynıdır: ortalama aşağı yuvarlanır; gereken final notu yukarı yuvarlanır ve final barajından düşük olamaz. Not sistemleri (AA–FF, A1–F1, ABD A–F) `assets/app.js` içindeki `SCALES` listesindedir.

Hesaplayıcılar adresle doldurulabilir: `?mid=55&midw=40&hw=&hww=&final=&minf=&target=CC&scale=aa`. Bu biçim `llms.txt` içinde yapay zekâ asistanlarına da anlatılıyor.

## Çeviri kuralları

- Dil dosyası `en.json` ile aynı anahtarlara ve liste uzunluklarına sahip olmalı; script farklıysa durur.
- `_html` ile biten anahtarlarda ve `fin_body`, `avg_body`, `gpa_body` metinlerinde yalnızca `<b>`, `<em>`, `<br>` kullanılır.
- `fin_slug`, `avg_slug`, `gpa_slug`: sayfa adresleri; küçük harf, rakam ve tire (ASCII). Yayındaki bir adresi değiştirme, arama motorları eski adresi kaybeder.
- `brand`: uygulamanın o dildeki adı (iOS projesindeki `CFBundleDisplayName`).
- Gizlilik metninde her bölüm kaynaktakiyle aynı HTML etiketlerini taşımalı.

## Paylaşım görseli

```
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --hide-scrollbars \
  --window-size=1200,630 --virtual-time-budget=3000 --screenshot=/tmp/og.png "file://$PWD/_src/og.html"
sips -s format jpeg -s formatOptions 86 /tmp/og.png --out assets/img/og.jpg
```
