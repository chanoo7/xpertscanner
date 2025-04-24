import PropTypes from 'prop-types';
// material-ui
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { FormOutlined, DiffOutlined, EnvironmentOutlined, SyncOutlined } from '@ant-design/icons';

// third-party
import { NumericFormat } from 'react-number-format';

// project import
import Dot from 'components/@extended/Dot';

function createData(tracking_no, name, fat, carbs, protein) {
  return { tracking_no, name, fat, carbs, protein };
}

const rows = [
  createData(84564564, 'Dharamapuram Main Road', 40, 2, 2),
  createData(84564564, 'Dharamapuram Link Road', 46, 0, 2),
  createData(84564564, 'Municipal Office Road', 70, 2, 2),
  createData(84564564, 'Perungudi Main Road', 90, 1, 2),
  createData(84564564, 'Tharamani Link Road', 50, 0, 2),
  createData(84564564, 'CBI Colony Main Road', 30, 2, 2),
  
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'tracking_no',
    align: 'left',
    disablePadding: false,
    label: 'Device Id.'
  },
  {
    id: 'name',
    align: 'left',
    disablePadding: true,
    label: 'Location'
  },
  {
    id: 'fat',
    align: 'right',
    disablePadding: false,
    label: 'Total Run Hours'
  },
  {
    id: 'carbs',
    align: 'left',
    disablePadding: false,
    label: 'Status'
  },
  {
    id: 'protein',
    align: 'right',
    disablePadding: false,
    label: 'Actions'
  }
];

// ==============================|| ORDER TABLE - HEADER ||============================== //

function OrderTableHead({ order, orderBy }) {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function OrderStatus({ status }) {
  let color;
  let title;

  switch (status) {
    case 0:
      color = 'warning';
      title = 'Idle';
      break;
    case 1:
      color = 'success';
      title = 'Running';
      break;
    case 2:
      color = 'error';
      title = 'Stopped';
      break;
    default:
      color = 'primary';
      title = 'None';
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Dot color={color} />
      <Typography>{title}</Typography>
    </Stack>
  );
}

// ==============================|| ORDER TABLE ||============================== //

export default function ViewLocations() {
  const order = 'asc';
  const orderBy = 'tracking_no';

  return (
    <Box>
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          display: 'block',
          maxWidth: '100%',
          '& td, & th': { whiteSpace: 'nowrap' }
        }}
      >
        <Table aria-labelledby="tableTitle">
          <OrderTableHead order={order} orderBy={orderBy} />
          <TableBody>
            {stableSort(rows, getComparator(order, orderBy)).map((row, index) => {
              const labelId = `enhanced-table-checkbox-${index}`;

              return (
                <TableRow
                  hover
                  role="checkbox"
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  tabIndex={-1}
                  key={row.tracking_no}
                >
                  <TableCell component="th" id={labelId} scope="row">
                    <Link color="secondary"> {row.tracking_no}</Link>
                  </TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell align="right">{row.fat}</TableCell>
                  <TableCell>
                    <OrderStatus status={row.carbs} />
                  </TableCell>
                  <TableCell align="right">

                    <Tooltip title="Edit Configuration">
                      <IconButton>
                        <FormOutlined />
                      </IconButton>
                    </Tooltip>    

                    <Tooltip title="Reboot Device">
                      <IconButton>
                        <SyncOutlined />
                      </IconButton>
                    </Tooltip> 

                    <Tooltip title="View in Map">
                      <IconButton>
                        <EnvironmentOutlined />
                      </IconButton>
                    </Tooltip> 

                    <Tooltip title="File Report">
                      <IconButton>
                        <DiffOutlined />
                      </IconButton>
                    </Tooltip> 


                         {/* <NumericFormat value={row.protein} displayType="text" thousandSeparator prefix="$" /> */}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

OrderTableHead.propTypes = { order: PropTypes.any, orderBy: PropTypes.string };

OrderStatus.propTypes = { status: PropTypes.number };
