import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                padding: 4
            }}
        >
            <Typography variant="h4" gutterBottom>
                Access Denied
            </Typography>

            <Typography variant="body1" paragraph align="center">
                You don't have permission to access this page. Please contact your administrator
                if you believe this is an error.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button variant="contained" onClick={() => navigate('/')}>
                    Go to Home
                </Button>
                <Button variant="outlined" onClick={() => navigate(-1)}>
                    Go Back
                </Button>
            </Box>
        </Box>
    );
};

export default Unauthorized;