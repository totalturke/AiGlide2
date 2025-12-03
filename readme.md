# Google Sheets CSV Fetcher - Glide Plugin

This Glide plugin fetches CSV data from published Google Sheets URLs and returns it as plain text.

## Features

- ✅ Fetches CSV data from published Google Sheets
- ✅ Uses Cloudflare Worker proxy to bypass CORS restrictions
- ✅ Returns raw CSV data that can be used in Glide
- ✅ Validates URLs before fetching

## Setup

### 1. Publish Your Google Sheet as CSV

1. Open your Google Sheet
2. Go to `File > Share > Publish to web`
3. Select `CSV` as the format
4. Copy the generated URL (it should end with `/pub?output=csv`)

### 2. Use in Glide

1. Add this plugin to your Glide app
2. Create a computed column using this plugin
3. Pass the published Google Sheets CSV URL as the parameter
4. The plugin will return the CSV data as plain text

## Parameters

- **Google Sheets CSV URL** (required): The published Google Sheets URL ending with `/pub?output=csv`

## Return Value

- **Type**: String
- **Content**: Raw CSV data from the Google Sheet

## Example

**Input URL:**
```
https://docs.google.com/spreadsheets/d/e/2PACX-1vS5Hg-TvirNFWb_5YG9KG48_vi1FFyyNYQSaubdzCG9tci5lqrKKJ-ANvkgHmyr-8D6uyyOvfYwRSai/pub?output=csv
```

**Output:**
```
Numbers,Names
1,Peter
2,Luca
3,Maria
4,Miguel
5,Marc
6,Juan
```

## Testing Locally

To test the plugin locally:

1. Open `index.html` in a browser
2. The driver will load and you can test the function

## Cloudflare Worker

This plugin uses a Cloudflare Worker proxy deployed at:
- `https://csv.aimike0411.workers.dev`

The proxy handles CORS and ensures the CSV data is returned as plain text instead of triggering a browser download.

## Troubleshooting

### "Please provide a Google Sheets CSV URL"
- Make sure you're passing a URL parameter

### "Invalid URL"
- Ensure the URL starts with `https://docs.google.com/spreadsheets/`

### "URL must be a published CSV link"
- Make sure the URL ends with `/pub?output=csv`
- Republish your sheet if needed

### "Failed to fetch CSV"
- Check that the Google Sheet is published and publicly accessible
- Verify the URL is correct
- Ensure the Cloudflare Worker is deployed and running

## Author

Created for Glide Apps

## License

MIT
