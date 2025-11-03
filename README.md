# 🚜 Pinterest URL Collector

> Automatic Pinterest board scraper with visual control panel. Extract hundreds of recipe URLs in minutes!

Perfect for exporting Pinterest recipe boards to [Mealie](https://mealie.io/) or any other recipe manager!

---

## ✨ Features

- 🤖 **Fully Automatic** - Scans entire boards without manual clicking
- 🎨 **Visual Control Panel** - Drag-and-drop UI with live statistics
- 〰️ **Wave Pattern Movement** - Sine wave motion ensures no links are missed
- ⚡ **5 Speed Presets** - From Turbo to Ultra-Precise modes
- 📊 **Real-time Progress** - Live stats, progress bar, and URL preview
- 💾 **One-Click Export** - Download all URLs as .txt file
- 🚫 **Domain Filtering** - Block Instagram and other unwanted domains
- ⏸️ **Pause/Resume** - Full control during collection
- 🎚️ **Adjustable Settings** - Fine-tune wave amplitude and frequency with sliders

---

## 🚀 Quick Start

### Method 1: Bookmarklet (Easiest!)

1. **Create a bookmark** in your browser
2. **Set the URL to:**

```javascript
javascript:(function(){var s=document.createElement('script');s.src='https://raw.githubusercontent.com/eliaskoehnlein05/pinterest-url-collector/main/pinterest-collector.js';document.head.appendChild(s);})();
```

3. Go to any Pinterest board
4. Click the bookmarklet
5. Click **START**
6. Wait ~5-10 minutes
7. Click **EXPORT**

Done! 🎉

---

### Method 2: Browser Console

1. Open Pinterest board
2. Press `F12` → Click `Console` tab
3. Copy entire script from `pinterest-collector.js`
4. Paste in console and press `Enter`
5. Control panel appears!

---

## 📖 How to Use

### Step-by-Step Guide

**1. Open Your Pinterest Board**
   - Must be logged in
   - Board should have pins with external recipe links

**2. Launch the Tool**
   - Click your bookmarklet
   - Control panel appears in top-right

**3. Configure (Optional)**
   - Speed: Choose **FAST** (recommended)
   - Wave: Keep **Sine** (default)
   - Add blocked domains if needed

**4. Start Collection**
   - Click green **▶ Start** button
   - Green dot appears and moves across screen
   - Links flash green when found

**5. Monitor**
   - Watch URL count increase
   - See progress bar fill up
   - View last found URL

**6. Export**
   - Click **💾 Export URLs**
   - .txt file downloads
   - One URL per line

**7. Import to Mealie**
   - Open Mealie
   - Go to bulk import
   - Upload the .txt file
   - Done! 🎉

---

## ⚙️ Settings Explained

### Speed Presets

| Preset | Speed | Time (100 pins) | Best For |
|--------|-------|-----------------|----------|
| 🚀 TURBO | Very Fast | ~3-4 min | Quick scans |
| ⚡ **FAST** | Fast | **~5-7 min** | **Recommended** |
| ✅ NORMAL | Medium | ~8-10 min | Balanced |
| 🎯 PRECISE | Slow | ~12-15 min | Thorough |
| 🔬 ULTRA | Very Slow | ~18-25 min | Best coverage |

### Wave Patterns

- **〰️ Sine** - Smooth wave (best for most cases)
- **/\/\ Triangle** - Zigzag pattern
- **⚡ Random** - Chaotic movement
- **〰〰 Double** - 2x frequency
- **━━ None** - Straight line (fastest)

### Wave Sliders

**Amplitude** (20-200px)
- How high the wave goes
- Higher = more coverage
- Recommended: 80-120px

**Frequency** (0.005-0.05)
- How often it waves
- Higher = more waves
- Recommended: 0.02-0.03

### Domain Filter

Block unwanted domains:
- Type domain name
- Press `Enter` to add
- Click `×` to remove
- Instagram blocked by default

---

## ❓ FAQ

**Q: How long does it take?**  
A: 10-15 minutes for 300-500 pins with FAST preset.

**Q: Does it work on mobile?**  
A: No, desktop browser only.

**Q: Will I get banned from Pinterest?**  
A: No, this just hovers over visible elements. No aggressive scraping.

**Q: What if pins have no external links?**  
A: They're skipped automatically.

**Q: Can I stop and resume later?**  
A: No, data is not saved. You'd need to start over.

**Q: Missing some URLs?**  
A: Try slower preset (PRECISE) or adjust wave settings.

---

## 🐛 Troubleshooting

**Control panel doesn't appear:**
- Refresh page and try again
- Check if you're on pinterest.com
- Make sure JavaScript is enabled

**No URLs being collected:**
- Scroll manually first to load content
- Check if pins have external links
- Try slower speed preset

**Green dot not moving:**
- Click START again
- Refresh page and restart

**Too many Instagram links:**
- Check Domain Filter
- Make sure instagram.com is blocked

---

## 🤝 Contributing

Contributions welcome!

- 🐛 Report bugs
- 💡 Suggest features  
- 📝 Improve docs
- ⭐ Star the repo!

---

## 📜 License

MIT License - see [LICENSE](LICENSE) file

Free to use, modify, and distribute!

---

## 🙏 Credits

- Built for [Mealie](https://mealie.io/) recipe export

---

<div align="center">

**If this saved you time, give it a ⭐!**

[Report Bug](../../issues) · [Request Feature](../../issues)

</div>
