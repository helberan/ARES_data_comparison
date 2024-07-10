import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import HelpIcon from '@mui/icons-material/Help';
import exampleName from '../assets/example-name.png';
import exampleAddress from '../assets/example-address.png';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '1.5rem',
};

export const InfoModal = ({ text }: { text: string }) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <HelpIcon onClick={handleOpen} />
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <strong>Příprava dat v EXCELu</strong>
          </Typography>
          {text === 'nameSearch' ? (
            <div>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <ul>
                  <li>
                    Excel <strong>nesmí obsahovat</strong> více jak <strong>500 řádků</strong>.
                  </li>
                  <li>
                    Excel <strong>musí obsahovat</strong> pouze jeden sešit se dvěma sloupci (<strong>"IČ"</strong> a <strong>"Subjekt"</strong>):
                  </li>
                </ul>
              </Typography>
              <br />
              <img src={exampleName} alt="example" />
            </div>
          ) : (
            <div>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <ul>
                  <li>
                    Excel <strong>nesmí obsahovat</strong> více jak <strong>500 řádků</strong>.
                  </li>
                  <li>
                    Excel <strong>musí obsahovat</strong> pouze jeden sešit se sloupci <strong>"IČ"</strong>, <strong>"Subjekt"</strong>,{' '}
                    <strong>"ulice"</strong>, <strong>"město"</strong> a <strong>"PSČ"</strong>:
                  </li>
                </ul>
              </Typography>
              <br />
              <img src={exampleAddress} alt="example" />
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
};
