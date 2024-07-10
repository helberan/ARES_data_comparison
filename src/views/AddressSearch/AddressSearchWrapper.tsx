import { useState, useEffect } from 'react';
import { ARESSubject, Sidlo } from '../../interfaces';
import * as XLSX from 'xlsx';
import { InfoModal } from '../../components/InfoModal';
import { AddressSearchTable } from './AddressSearchTable';
import { styled } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

interface ClientAddressData {
  IČ: string;
  Subjekt: string;
  ulice: string;
  město: string;
  PSČ: string;
  nazevUlice?: string;
  cisloDomovni?: number | boolean;
  cisloOrientacni?: number | boolean;
  nazevObce?: string;
  psc?: number | boolean;
  shoda?: boolean;
}

export const AddressSearchWrapper = () => {
  const [importedData, setImportedData] = useState<ClientAddressData[]>();
  const [companyData, setCompanyData] = useState<ClientAddressData[]>();

  //info messages states
  const [rowNumberErrorMessage, setRowNumberErrorMessage] = useState<boolean>(false);
  const [columnNamesErrorMessage, setColumnNamesErrorMessage] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<boolean>(false);
  const [noDataWarnMessage, setNoDataWarnMessage] = useState<boolean>(false);
  const [noDataToExportWarnMessage, setNoDataToExportWarnMessage] = useState<boolean>(false);
  const [error, setError] = useState(false);

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  //IMPORT
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (event: ProgressEvent<FileReader>) => {
        const workbook = XLSX.read(event.target?.result as string, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const sheetData: ClientAddressData[] = XLSX.utils.sheet_to_json(sheet);

        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
        const headerRow = jsonData[0] as string[];
        console.log('Column names:', headerRow);
        console.log('1: ', headerRow[0]);
        console.log('2: ', headerRow[1]);

        const numberOfRows = sheet['!ref'] ? XLSX.utils.decode_range(sheet['!ref']).e.r + 1 : 0;
        console.log(`Number of rows: ${numberOfRows}`);

        if (headerRow[0] === 'IČ' && headerRow[1] === 'Subjekt' && headerRow[2] === 'ulice' && headerRow[3] === 'město' && headerRow[4] === 'PSČ') {
          if (numberOfRows < 500) {
            setImportedData(sheetData);
            setSuccessMessage(true);
          } else {
            setSuccessMessage(false);
            setRowNumberErrorMessage(true);
            setColumnNamesErrorMessage(false);
            setError(true);
          }
        } else {
          setSuccessMessage(false);
          setColumnNamesErrorMessage(true);
          setRowNumberErrorMessage(false);
          setError(true);
        }
      };

      reader.readAsBinaryString(file);
    }
  };

  const formatPsc = (psc: string) => {
    const formattedPsc: string[] = [];
    for (let i = 0; i < psc.length; i++) {
      if (psc[i] != ' ') {
        formattedPsc.push(psc[i]);
      }
    }
    return formattedPsc.join('');
  };

  const compareAddress = (importedCompany: ClientAddressData, fetchedCompany: any): boolean => {
    const importedAddress = `${importedCompany.ulice}, ${importedCompany.město} ${formatPsc(importedCompany.PSČ)}`;
    const aresCisloOrientacni = fetchedCompany.cisloOrientacni ? `/${fetchedCompany.cisloOrientacni}` : '';
    const aresAddress = `${fetchedCompany.nazevUlice} ${fetchedCompany.cisloDomovni}${aresCisloOrientacni}, ${fetchedCompany.nazevObce} ${fetchedCompany.psc}`;

    /* console.log('imported: ', importedAddress);
    console.log('ares: ', aresAddress); */

    if (importedAddress === aresAddress) {
      return true;
    } else {
      return false;
    }
  };

  //UPDATING COMPANY DATA BASED ON FETCHED DATA
  const handleFetch = async () => {
    if (importedData) {
      const updatedCompanies = await Promise.all(
        importedData.map(async (company) => {
          const fetchedCompanyData = await fetchCompanyData(company.IČ);
          return {
            ...company,
            PSČ: formatPsc(company.PSČ),
            nazevUlice: fetchedCompanyData?.sidlo.nazevUlice,
            cisloDomovni: fetchedCompanyData?.sidlo.cisloDomovni,
            cisloOrientacni: fetchedCompanyData?.sidlo.cisloOrientacni ? fetchedCompanyData.sidlo.cisloOrientacni : false,
            nazevObce: fetchedCompanyData?.sidlo.nazevObce,
            psc: fetchedCompanyData?.sidlo.psc,
            shoda: compareAddress(company, fetchedCompanyData?.sidlo),
          };
        })
      );
      setCompanyData(updatedCompanies);
    } else {
      setNoDataWarnMessage(true);
    }
  };

  //ARES DATA FETCH
  const fetchCompanyData = async (ic: string): Promise<ARESSubject | null> => {
    try {
      const response = await fetch(`https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/${ic}`);
      const data = await response.json();
      return data;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  //EXPORT
  const handleExport = () => {
    console.log(companyData);
    if (companyData) {
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(companyData);

      XLSX.utils.book_append_sheet(wb, ws, 'sesit1');

      XLSX.writeFile(wb, 'export_porovnani_adres.xlsx');
    } else {
      setNoDataToExportWarnMessage(true);
    }
  };

  //ERROR CLEANUP
  useEffect(() => {
    setRowNumberErrorMessage(false);
    setColumnNamesErrorMessage(false);
    setError(false);
    setNoDataWarnMessage(false);
    setNoDataToExportWarnMessage(false);
  }, [importedData]);

  return (
    <div className="App">
      <header>
        <div className="import-wrapper">
          <div className="import-wrapper-inner">
            <InfoModal />
            <Button component="label" role={undefined} variant="contained" tabIndex={-1}>
              Zvolit soubor
              <VisuallyHiddenInput type="file" onChange={handleImport} />
            </Button>
          </div>
          <Button variant="contained" id="compare" onClick={handleFetch} disabled={error ? true : false}>
            Porovnat adresy
          </Button>
        </div>
        <Button variant="contained" onClick={handleExport}>
          Export
        </Button>
      </header>
      <div className="messages">
        {rowNumberErrorMessage && (
          <Alert severity="error">
            Soubor obsahuje <strong>příliš mnoho dat</strong>!
            <br />
            <strong>Maximální počet řádků v souboru je 500!</strong>
          </Alert>
        )}
        {columnNamesErrorMessage && (
          <Alert severity="error">
            Chyba: špatný název sloupců v tabulce!
            <br />
            Název sloupců musí být <strong>"IČ"</strong>, <strong>"Subjekt"</strong>, <strong>"ulice"</strong>, <strong>"město"</strong>,{' '}
            <strong>"PSČ"</strong>!
          </Alert>
        )}
        {successMessage && (
          <Alert severity="success">
            Soubor byl úspěšně nahrán.
            <br />
            Pro porovnání nahraných dat s ARES stiskněte tlačítko "
            <em>
              <strong>Porovnat adresy</strong>
            </em>
            ".
          </Alert>
        )}
        {noDataWarnMessage && (
          <Alert severity="warning">
            Pro porovnání adres subjektů prosím nahrajte soubor.
            <br />
            Pokud si nejste jisti jak, klikněte na ikonku "<strong>?</strong>".
          </Alert>
        )}
        {noDataToExportWarnMessage && (
          <Alert severity="warning">
            Není co exportovat.
            <br />
            Pro porovnání adres subjektů a následný export prosím nahrajte soubor.
          </Alert>
        )}
      </div>

      <div className="table-wrapper">
        <AddressSearchTable tableData={companyData || []} />
      </div>
    </div>
  );
};
