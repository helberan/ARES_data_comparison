import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

interface TableData {
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

export const AddressSearchTable = ({ tableData }: { tableData: TableData[] }) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 400 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>
              <b>IČ</b>
            </TableCell>
            <TableCell>
              <b>Název společnosti</b>
            </TableCell>
            <TableCell>
              <b>Ulice, PSČ, město (ze souboru)</b>
            </TableCell>
            <TableCell>
              <b>Ulice, PSČ, město (ARES)</b>
            </TableCell>
            <TableCell>
              <b>Porovnání adres</b>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((company: TableData) => (
            <TableRow key={company.IČ} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                {company.IČ}
              </TableCell>
              <TableCell>{company.Subjekt}</TableCell>
              <TableCell>
                {company.ulice}, {company.město} {company.PSČ}
              </TableCell>
              <TableCell>
                {company.nazevUlice} {company.cisloDomovni}
                {company.cisloOrientacni ? `/${company.cisloOrientacni}` : ''}, {company.nazevObce} {company.psc}
              </TableCell>
              <TableCell>{company.shoda ? 'SHODA' : 'CHYBA'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
