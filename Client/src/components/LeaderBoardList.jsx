import React from "react";
import {
  Avatar,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

const LeaderboardList = ({ users }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (isMobile) {
    // Mobile-friendly card view
    return (
      <Box p={2}>
        <Typography variant="h5" align="center" fontWeight="bold" gutterBottom>
  Leaderboard {users?.[0]?.location?.area && `- ${users[0].location.area}`}
</Typography>

        {users.map((user, index) => (
          <Paper key={user._id} elevation={3} sx={{ p: 2, mb: 2, borderRadius: 3 }}>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar src={user.avatar} alt={user.fullName} sx={{ width: 56, height: 56 }} />
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">{user.fullName}</Typography>
                <Typography variant="body2" color="text.secondary">{user.email}</Typography>
              </Box>
            </Box>
            <Box mt={1} ml={7}>
              <Typography variant="body2"><strong>Resolved:</strong> {user.resolvedCount}</Typography>
              <Typography variant="body2"><strong>Area:</strong> {user.location?.area}</Typography>
              <Typography variant="body2"><strong>City:</strong> {user.location?.city}</Typography>
              <Typography variant="body2"><strong>Country:</strong> {user.location?.country}</Typography>
            </Box>
          </Paper>
        ))}
      </Box>
    );
  }

  // Desktop table view
  return (
    <Box maxWidth="lg" mx="auto" p={4}>
      <Typography variant="h5" align="center" fontWeight="bold" gutterBottom>
  Leaderboard {users?.[0]?.location?.area && `- ${users[0].location.area}`}
</Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 4, boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell><strong>Rank</strong></TableCell>
              <TableCell><strong>Avatar</strong></TableCell>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Resolved</strong></TableCell>
              <TableCell><strong>Area</strong></TableCell>
              <TableCell><strong>City</strong></TableCell>
              <TableCell><strong>Country</strong></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users?.map((user, index) => (
              <TableRow key={user._id} hover>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Avatar src={user.avatar} alt={user.fullName} />
                </TableCell>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.resolvedCount}</TableCell>
                <TableCell>{user.location?.area}</TableCell>
                <TableCell>{user.location?.city}</TableCell>
                <TableCell>{user.location?.country}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default LeaderboardList;
