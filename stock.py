import yfinance as yf
import json

symbols = ["2330.TW", "2317.TW", "2454.TW", "2603.TW"]

data = []

name_map = {
    "2330.TW": "台積電",
    "2317.TW": "鴻海",
    "2454.TW": "聯發科",
    "2603.TW": "長榮"
}

for symbol in symbols:
    stock = yf.Ticker(symbol)
    info = stock.info
    item = {
        "symbol": symbol,
        "name": name_map.get(symbol, info.get("shortName", "未知公司")),
        "price": info.get("currentPrice"),
        "high": info.get("dayHigh"),
        "low": info.get("dayLow"),
        "volume": info.get("volume"),
        "updated": info.get("regularMarketTime")
    }
    data.append(item)

with open("final_report/stocks.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("✅ 已儲存多筆股價至 stocks.json")
