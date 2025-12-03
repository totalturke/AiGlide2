window.function = async function (sheet_url) {
	// Validate input
	if (!sheet_url || !sheet_url.value) {
		return 'Error: Please provide a Google Sheets CSV URL';
	}

	const url = sheet_url.value.trim();

	// Basic validation - ensure it's a Google Sheets URL
	if (!url.startsWith('https://docs.google.com/spreadsheets/')) {
		return 'Error: Invalid URL. Must be a Google Sheets URL';
	}

	// Ensure it's a published CSV URL
	if (!url.includes('/pub?output=csv')) {
		return 'Error: URL must be a published CSV link (ending with /pub?output=csv)';
	}

	// Use the Cloudflare Worker proxy to fetch the CSV
	const proxyUrl = 'https://csv.aimike0411.workers.dev';

	try {
		// Add timeout to prevent hanging
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

		const response = await fetch(`${proxyUrl}?url=${encodeURIComponent(url)}`, {
			signal: controller.signal
		});

		clearTimeout(timeoutId);

		if (!response.ok) {
			return `Error: Failed to fetch CSV (${response.status})`;
		}

		const csvData = await response.text();

		// Return the raw CSV data
		return csvData;
	} catch (error) {
		if (error.name === 'AbortError') {
			return 'Error: Request timeout (10s)';
		}
		return `Error: ${error.message}`;
	}
};
