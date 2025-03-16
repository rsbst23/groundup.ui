import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Paper, Button, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useAuth } from '../../contexts/AuthContext';
import { authLogs } from '../../services/keycloakService';
import { usePage } from '../../contexts/PageContext';

const AuthDebugPage = () => {
    const { setPageConfig } = usePage();
    const { user, isAuthenticated } = useAuth();
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        setPageConfig({
            title: "Auth Debug",
            breadcrumb: [
                { label: "Auth Debug", path: "/application/auth-debug" }
            ],
        });
    }, [setPageConfig]);

    // Load logs on mount and set up refresh
    useEffect(() => {
        loadLogs();

        // Refresh logs every 3 seconds
        const interval = setInterval(loadLogs, 3000);
        return () => clearInterval(interval);
    }, []);

    const loadLogs = () => {
        try {
            const storedLogs = authLogs.getLogs();
            setLogs(storedLogs);
        } catch (error) {
            console.error('Error loading auth logs:', error);
        }
    };

    const clearLogs = () => {
        try {
            authLogs.clearLogs();
            setLogs([]);
        } catch (error) {
            console.error('Error clearing auth logs:', error);
        }
    };

    const formatTime = (timestamp) => {
        try {
            const date = new Date(timestamp);
            return date.toLocaleTimeString();
        } catch (e) {
            return timestamp;
        }
    };

    // Format the details object for display
    const formatDetails = (details) => {
        if (!details) return 'No details';

        if (typeof details === 'string') return details;

        try {
            return JSON.stringify(details, null, 2);
        } catch (e) {
            return 'Error formatting details';
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">Authentication Debug</Typography>
                <Box>
                    <Button
                        startIcon={<RefreshIcon />}
                        onClick={loadLogs}
                        variant="outlined"
                        sx={{ mr: 2 }}
                    >
                        Refresh Logs
                    </Button>
                    <Button
                        startIcon={<DeleteIcon />}
                        onClick={clearLogs}
                        variant="outlined"
                        color="error"
                    >
                        Clear Logs
                    </Button>
                </Box>
            </Box>

            <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" gutterBottom>Authentication Status</Typography>
                <Typography>
                    <strong>Status:</strong> {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
                </Typography>
                {user && (
                    <>
                        <Typography>
                            <strong>User:</strong> {user.name || user.username || 'Unknown'}
                        </Typography>
                        <Typography>
                            <strong>Email:</strong> {user.email || 'N/A'}
                        </Typography>
                        <Typography>
                            <strong>Roles:</strong> {user.roles?.join(', ') || 'None'}
                        </Typography>
                    </>
                )}
            </Paper>

            <Typography variant="h6" gutterBottom>Authentication Log History</Typography>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell width="15%"><strong>Time</strong></TableCell>
                            <TableCell width="20%"><strong>Event</strong></TableCell>
                            <TableCell><strong>Details</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {logs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} align="center">
                                    No authentication logs found
                                </TableCell>
                            </TableRow>
                        ) : (
                            logs.map((log, index) => (
                                <TableRow key={index}>
                                    <TableCell>{formatTime(log.timestamp)}</TableCell>
                                    <TableCell>{log.event}</TableCell>
                                    <TableCell>
                                        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                            {formatDetails(log.details)}
                                        </pre>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default AuthDebugPage;