window.function = async function (sheet_url) {
	// Validate input
	if (!sheet_url || !sheet_url.value) {
		throw new Error('Please provide a Google Sheets CSV URL');
	}

	const url = sheet_url.value.trim();

	// Basic validation - ensure it's a Google Sheets URL
	if (!url.startsWith('https://docs.google.com/spreadsheets/')) {
		throw new Error('Invalid URL. Must be a Google Sheets URL starting with https://docs.google.com/spreadsheets/');
	}

	// Ensure it's a published CSV URL
	if (!url.includes('/pub?output=csv')) {
		throw new Error('URL must be a published CSV link (ending with /pub?output=csv)');
	}

	// Use the Cloudflare Worker proxy to fetch the CSV
	const proxyUrl = 'https://csv.aimike0411.workers.dev';

	try {
		const response = await fetch(`${proxyUrl}?url=${encodeURIComponent(url)}`);

		if (!response.ok) {
			throw new Error(`Failed to fetch CSV: ${response.status} ${response.statusText}`);
		}

		const csvData = await response.text();

		// Return the raw CSV data
		return csvData;
	} catch (error) {
		throw new Error(`Error fetching CSV: ${error.message}`);
	}
};
