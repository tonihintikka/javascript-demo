# Kieliversioinnin Suunnitelma (i18n)

## Valittu ratkaisu: JSON-pohjainen käännöstiedosto + JavaScript

### Miksi tämä ratkaisu?
- Ei tarvitse kopioida HTML-tiedostoja
- Helppo ylläpitää käännöksiä
- Kieli vaihtuu dynaamisesti ilman sivun uudelleenlatausta
- Yksi lähdekoodi

### Rakenne
```
locales/
  fi.json       # Suomenkieliset tekstit (oletus)
  en.json       # Englanninkieliset tekstit
js/
  i18n.js       # Käännöslogiikka
```

### Toimintaperiaate
1. HTML-elementeissä `data-i18n="key"` -attribuutti
2. JavaScript lataa oikean JSON-tiedoston
3. Kieli tallennetaan `localStorage`:een
4. Kielenvaihtonappi navigaatiossa (FI/EN)

### Käännösavainten rakenne
```
nav.*           - Navigaatio
hero.*          - Hero-osiot
demos.*         - Demo-sivujen sisältö
common.*        - Yleiset tekstit (napit, labelit)
sections.*      - Osioiden otsikot
controls.*      - Kontrollien labelit
```

### Toteutuksen vaiheet
1. ✅ Luo `locales/fi.json` käännöstiedosto
2. ✅ Luo `locales/en.json` käännöstiedosto
3. ✅ Luo `js/i18n.js` moduuli
4. ✅ Päivitä HTML-tiedostot data-i18n attribuuteilla
5. ✅ Lisää kielenvaihtonappi navigaatioon
6. ✅ Testaa toimivuus

### Työmäärä-arvio
| Tehtävä | Aika |
|---------|------|
| Käännöstiedostot (fi.json, en.json) | 1-2h |
| i18n.js moduuli | 30min |
| HTML-tiedostojen päivitys | 2-3h |
| Kielenvaihtonappi + tyylit | 30min |
| Testaus | 1h |
| **Yhteensä** | **5-7h** |

---
Luotu: 2025-12-12
