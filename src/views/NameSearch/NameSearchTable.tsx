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
  nazevAres?: string;
  shoda?: boolean;
}

export const NameSearchTable = ({ tableData }: { tableData: TableData[] }) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 400 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>
              <b>IČ</b>
            </TableCell>
            <TableCell>
              <b>Název společnosti (ze souboru)</b>
            </TableCell>
            <TableCell>
              <b>Název společnosti (ARES)</b>
            </TableCell>
            <TableCell>
              <b>Porovnání názvů</b>
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
              <TableCell>{company.nazevAres ? company.nazevAres : 'NENALEZENO'}</TableCell>
              <TableCell className={company.shoda ? 'green' : 'red'}>{company.shoda ? 'SHODA' : 'CHYBA'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
