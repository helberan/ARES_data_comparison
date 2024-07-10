import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { InfoModal } from '../../components/InfoModal';
import { NameSearchTable } from './NameSearchTable';
import { styled } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

interface ClientNameData {
  IČ: string;
  Subjekt: string;
  nazevAres?: string;
  shoda?: boolean;
}

export const NameSearchWrapper = () => {
  const [importedData, setImportedData] = useState<ClientNameData[]>();
  const [companyData, setCompanyData] = useState<ClientNameData[]>();
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
        const sheetData: ClientNameData[] = XLSX.utils.sheet_to_json(sheet);

        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
        const headerRow = jsonData[0] as string[];
        /* console.log('Column names:', headerRow);
        console.log('1: ', headerRow[0]);
        console.log('2: ', headerRow[1]); */

        const numberOfRows = sheet['!ref'] ? XLSX.utils.decode_range(sheet['!ref']).e.r + 1 : 0;
        //console.log(`Number of rows: ${numberOfRows}`);

        if (headerRow[0] === 'IČ' && headerRow[1] === 'Subjekt') {
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
    console.log(successMessage);
  };

  //UPDATING COMPANY DATA BASED ON FETCHED DATA
  const handleFetch = async () => {
    if (importedData) {
      const updatedCompanies = await Promise.all(
        importedData.map(async (company) => {
          const fetchedCompanyName = await fetchCompanyData(company.IČ);
          return { ...company, nazevAres: fetchedCompanyName, shoda: fetchedCompanyName === company.Subjekt };
        })
      );
      setCompanyData(updatedCompanies);
    } else {
      setNoDataWarnMessage(true);
    }
  };

  //ARES DATA FETCH
  const fetchCompanyData = async (ic: string): Promise<string> => {
    try {
      const response = await fetch(`https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/${ic}`);
      const data = await response.json();
      return data.obchodniJmeno;
    } catch (err) {
      console.error(err);
      return '';
    }
  };

  //EXPORT
  const handleExport = () => {
    console.log(companyData);
    if (companyData) {
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(companyData);

      XLSX.utils.book_append_sheet(wb, ws, 'sesit1');

      XLSX.writeFile(wb, 'export_porovnani_nazvu.xlsx');
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
    <div className="content-wrapper">
      <header>
        <div className="import-wrapper">
          <div className="import-wrapper-inner">
            <InfoModal text="nameSearch" />
            <Button component="label" role={undefined} variant="contained" tabIndex={-1}>
              Zvolit soubor
              <VisuallyHiddenInput type="file" onChange={handleImport} />
            </Button>
          </div>
          <Button variant="contained" id="compare" onClick={handleFetch} disabled={error ? true : false}>
            Porovnat názvy
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
            Název sloupců musí být <strong>"IČ"</strong> a <strong>"Subjekt"</strong>!
          </Alert>
        )}
        {successMessage && (
          <Alert severity="success">
            Soubor byl úspěšně nahrán.
            <br />
            Pro porovnání nahraných dat s ARES stiskněte tlačítko "
            <em>
              <strong>Porovnat názvy</strong>
            </em>
            ".
          </Alert>
        )}
        {noDataWarnMessage && (
          <Alert severity="warning">
            Pro porovnání názvů subjektů prosím nahrajte soubor.
            <br />
            Pokud si nejste jisti jak, klikněte na ikonku "<strong>?</strong>".
          </Alert>
        )}
        {noDataToExportWarnMessage && (
          <Alert severity="warning">
            Není co exportovat.
            <br />
            Pro porovnání názvů subjektů a následný export prosím nahrajte soubor.
          </Alert>
        )}
      </div>

      <div className="table-wrapper">
        <NameSearchTable tableData={companyData || []} />
      </div>
    </div>
  );
};
