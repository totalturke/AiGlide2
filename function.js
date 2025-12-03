window.function = async function (sheet_url) {
	console.log('[CSV Plugin] Function called');
	console.log('[CSV Plugin] Input:', sheet_url);

	// Validate input
	if (!sheet_url || !sheet_url.value) {
		console.log('[CSV Plugin] Error: No URL provided');
		return 'Error: Please provide a Google Sheets CSV URL';
	}

	const url = sheet_url.value.trim();
	console.log('[CSV Plugin] URL to fetch:', url);

	// Basic validation - ensure it's a Google Sheets URL
	if (!url.startsWith('https://docs.google.com/spreadsheets/')) {
		console.log('[CSV Plugin] Error: Not a Google Sheets URL');
		return 'Error: Invalid URL. Must be a Google Sheets URL';
	}

	// Ensure it's a published CSV URL
	if (!url.includes('/pub?output=csv')) {
		console.log('[CSV Plugin] Error: Not a published CSV URL');
		return 'Error: URL must be a published CSV link (ending with /pub?output=csv)';
	}

	// Use the Cloudflare Worker proxy to fetch the CSV
	const proxyUrl = 'https://csv.aimike0411.workers.dev';
	const fullProxyUrl = `${proxyUrl}?url=${encodeURIComponent(url)}`;
	console.log('[CSV Plugin] Proxy URL:', fullProxyUrl);

	try {
		console.log('[CSV Plugin] Starting fetch...');

		// Add timeout to prevent hanging
		const controller = new AbortController();
		const timeoutId = setTimeout(() => {
			console.log('[CSV Plugin] Timeout triggered after 10s');
			controller.abort();
		}, 10000); // 10 second timeout

		const response = await fetch(fullProxyUrl, {
			signal: controller.signal
		});

		clearTimeout(timeoutId);
		console.log('[CSV Plugin] Fetch completed. Status:', response.status);

		if (!response.ok) {
			console.log('[CSV Plugin] Error: Response not OK');
			return `Error: Failed to fetch CSV (${response.status})`;
		}

		console.log('[CSV Plugin] Reading response text...');
		const csvData = await response.text();

		// Check if the response is HTML (which usually means the sheet is not published or private)
		if (csvData.trim().toLowerCase().startsWith('<!doctype html') || csvData.trim().toLowerCase().startsWith('<html')) {
			console.log('[CSV Plugin] Error: Received HTML instead of CSV');
			return 'Error: The URL returned HTML instead of CSV. Please make sure the Google Sheet is published to the web as CSV.';
		}

		console.log('[CSV Plugin] CSV data length:', csvData.length);
		console.log('[CSV Plugin] First 100 chars:', csvData.substring(0, 100));

		// Return the raw CSV data
		console.log('[CSV Plugin] Returning CSV data');
		return csvData;
	} catch (error) {
		console.log('[CSV Plugin] Caught error:', error.name, error.message);
		if (error.name === 'AbortError') {
			return 'Error: Request timeout (10s)';
		}
		return `Error: ${error.message}`;
	}
};
