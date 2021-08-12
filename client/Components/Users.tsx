import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import postsStyles from "../styles/Posts.module.css";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export default function Posts({ users }: any) {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <h1>All Users</h1>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>
              <strong style={{ fontSize: "130%" }}>Name</strong>
            </TableCell>
            <TableCell>
              <strong style={{ fontSize: "130%" }}>EMAIL</strong>
            </TableCell>
            <TableCell>
              <strong style={{ fontSize: "130%" }}>Role</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users?.map((user: any) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
