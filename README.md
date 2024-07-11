# Excel Company Data Comparison Tool

This project is a React application that allows you to import Excel data containing company information, fetch additional data from an API (ARES), and compare it with the imported data.

**Disclaimer**: works only with companies that have a Czech business ID.

## Features

- Import Excel file with company data
- Fetch company names/addresses from ARES API using their Business Id number (IČO)
- Compare imported company names/addresses with fetched names/addresses
- Export processed data to Excel

## Technology used

- React
- Vite
- XLSX (Excel library for JavaScript)
- Material UI
- API - ARES (https://ares.gov.cz/stranky/vyvojar-info)

## Project Setup

To set up the project on your local machine, follow these steps:

### `git clone <repository-url>`

Clone the repository to your local machine. Replace "<repository-url>" with the URL of our GitHub repository.

### `npm install`

Install the project dependencies. This command will read the package.json file and install all the required packages.

### `npm run dev`

Runs the app in the development mode.
Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

## Usage

### Import Data:

Click on the "Zvolit soubor" button to select an Excel file (.xlsx) containing company data.
Click "Porovnat" (Compare) to fetch company names from ARES API and compare them with the imported data.

### Export Data:

Once comparison is done, click on "Export" to download the processed data as an Excel file (export.xlsx).


## Plan for next development

- add filtering
- add possibility to export only filtered data
- add info messages timeout
- add error message when imported file isn't an .xlsx file


