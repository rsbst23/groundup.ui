import React, { Component } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import ErrorDisplay from './ErrorDisplay';
import ErrorFeedback from './ErrorFeedback';
import { normalizeError, logError } from '../../utils/errorUtils';
import errorFeedbackService from '../../services/errorFeedbackService';

/**
 * Error Boundary component to catch and display unhandled errors
 * Wraps the application to prevent complete crashes
 */
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return {
            hasError: true,
            error: normalizeError(error)
        };
    }

    componentDidCatch(error, errorInfo) {
        // Log the error to the console
        this.setState({ errorInfo });
        logError('ErrorBoundary', { error, errorInfo });
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
    };

    handleFeedbackSubmit = async (feedbackData) => {
        try {
            // Add component stack to feedback
            const enhancedFeedback = {
                ...feedbackData,
                componentStack: this.state.errorInfo?.componentStack,
            };
            return await errorFeedbackService.submit(enhancedFeedback);
        } catch (error) {
            logError('ErrorBoundary:Feedback', error);
            throw error;
        }
    }

    render() {
        const { hasError, error, errorInfo } = this.state;
        const { children, showDetailedErrors = false } = this.props;

        if (hasError) {
            return (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '80vh',
                        p: 3
                    }}
                >
                    <Paper
                        elevation={3}
                        sx={{
                            p: 4,
                            maxWidth: 800,
                            width: '100%'
                        }}
                    >
                        <Typography variant="h4" gutterBottom color="error">
                            Something went wrong
                        </Typography>

                        <ErrorDisplay
                            error={error}
                            showDetails={showDetailedErrors}
                            showFeedback={false} // We'll use a separate feedback component
                            sx={{ mt: 2, mb: 3 }}
                            context="ErrorBoundary"
                        />

                        {showDetailedErrors && errorInfo && (
                            <Box
                                sx={{
                                    mt: 3,
                                    p: 2,
                                    bgcolor: 'grey.100',
                                    borderRadius: 1,
                                    maxHeight: '200px',
                                    overflow: 'auto',
                                    overflowX: 'hidden' // Prevent horizontal scrollbar
                                }}
                            >
                                <Typography variant="subtitle2" gutterBottom>Component Stack:</Typography>
                                <pre style={{
                                    margin: 0,
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word',
                                    overflowWrap: 'break-word',
                                    width: '100%'
                                }}>
                                    {errorInfo.componentStack}
                                </pre>
                            </Box>
                        )}

                        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={this.handleReset}
                            >
                                Try Again
                            </Button>

                            <Button
                                variant="outlined"
                                onClick={() => window.location.href = '/'}
                            >
                                Go to Home Page
                            </Button>

                            <ErrorFeedback
                                error={{
                                    ...error,
                                    componentStack: errorInfo?.componentStack
                                }}
                                onSubmit={this.handleFeedbackSubmit}
                                context="ErrorBoundary"
                            />
                        </Box>
                    </Paper>
                </Box>
            );
        }

        return children;
    }
}

export default ErrorBoundary;