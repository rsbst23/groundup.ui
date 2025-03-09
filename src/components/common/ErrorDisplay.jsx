import React from 'react';
import { Alert, AlertTitle, Box, Typography, List, ListItem } from '@mui/material';
import { normalizeError } from '../../utils/errorUtils';
import { useTranslation } from 'react-i18next';
import ErrorFeedback from './ErrorFeedback';
import errorFeedbackService from '../../services/errorFeedbackService';

/**
 * Reusable component for displaying error messages consistently throughout the app
 * 
 * @param {Object} props
 * @param {Error|Object|string} props.error - The error to display
 * @param {string} props.severity - The severity level of the error (error, warning, info, success)
 * @param {boolean} props.showDetails - Whether to show detailed error information
 * @param {boolean} props.showFeedback - Whether to show the feedback option
 * @param {boolean} props.fullWidth - Whether the error should take full width
 * @param {string} props.context - Context information for where the error occurred
 * @param {Object} props.sx - Additional styles to apply
 */
const ErrorDisplay = ({
    error,
    severity = 'error',
    showDetails = false,
    showFeedback = true,
    fullWidth = true,
    context = 'unknown',
    sx = {}
}) => {
    const { t } = useTranslation();

    if (!error) return null;

    const normalizedError = normalizeError(error);
    const { message, errors = [], statusCode } = normalizedError;

    const handleFeedbackSubmit = async (feedbackData) => {
        return await errorFeedbackService.submit(feedbackData);
    };

    return (
        <Alert
            severity={severity}
            sx={{
                mb: 2,
                width: fullWidth ? '100%' : 'auto',
                overflowX: 'hidden', // Prevent horizontal scrollbar
                '& .MuiAlert-message': {
                    overflow: 'hidden',
                    maxWidth: '100%',
                    wordWrap: 'break-word'
                },
                ...sx
            }}
        >
            <AlertTitle sx={{
                wordBreak: 'break-word',
                overflowWrap: 'break-word'
            }}>
                {message || t('error_occurred')}
            </AlertTitle>

            {/* Show detailed error list if available and details are requested */}
            {showDetails && errors.length > 0 && (
                <Box
                    mt={1}
                    sx={{
                        maxWidth: '100%',
                        overflow: 'hidden'
                    }}
                >
                    <List
                        dense
                        disablePadding
                        sx={{
                            maxWidth: '100%',
                            overflow: 'hidden'
                        }}
                    >
                        {errors.map((err, index) => (
                            <ListItem
                                key={index}
                                disablePadding
                                sx={{
                                    display: 'list-item',
                                    ml: 2,
                                    listStyleType: 'disc',
                                    wordBreak: 'break-word',
                                    overflowWrap: 'break-word',
                                    width: 'auto',
                                    maxWidth: 'calc(100% - 16px)' // Account for the left margin
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    sx={{
                                        wordBreak: 'break-word',
                                        overflowWrap: 'break-word',
                                        width: '100%',
                                        display: 'block'
                                    }}
                                >
                                    {err}
                                </Typography>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}

            {/* Show status code for developers in non-production */}
            {showDetails && statusCode && process.env.NODE_ENV !== 'production' && (
                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                        display: 'block',
                        wordBreak: 'break-word'
                    }}
                >
                    Status: {statusCode}
                </Typography>
            )}

            {/* Add feedback option */}
            {showFeedback && (
                <Box sx={{ mt: 1 }}>
                    <ErrorFeedback
                        error={normalizedError}
                        onSubmit={handleFeedbackSubmit}
                        context={context}
                    />
                </Box>
            )}
        </Alert>
    );
};

export default ErrorDisplay;