import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Alert,
    Collapse,
    IconButton,
    LinearProgress
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SendIcon from '@mui/icons-material/Send';
import { useTranslation } from 'react-i18next';

/**
 * Component to collect user feedback when errors occur
 * 
 * @param {Object} props
 * @param {Error|Object|string} props.error - The error that occurred
 * @param {Function} props.onSubmit - Function called when feedback is submitted
 * @param {string} props.context - Where the error occurred (for logging)
 */
const ErrorFeedback = ({ error, onSubmit, context = 'unknown' }) => {
    console.log('ErrorFeedback received context:', context);
    console.log('ErrorFeedback received error:', error);

    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [email, setEmail] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const toggleExpanded = () => setExpanded(!expanded);

    const handleSubmit = async () => {
        setSubmitting(true);

        try {
            await onSubmit({
                feedback,
                email,
                error,
                context,
                timestamp: new Date().toISOString(),
                url: window.location.href,
                userAgent: navigator.userAgent
            });

            setSubmitted(true);
            // Close dialog after 1.5 seconds
            setTimeout(() => {
                handleClose();
                // Reset form after closing
                setTimeout(() => {
                    setFeedback('');
                    setEmail('');
                    setSubmitted(false);
                }, 300);
            }, 1500);
        } catch (err) {
            console.error('Failed to submit error feedback:', err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Button
                variant="outlined"
                className="cancel-button"
                size="small"
                onClick={handleOpen}
                startIcon={<SendIcon />}
                sx={{ mt: 1 }}
            >
                {t('error_report_problem')}
            </Button>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{t('error_report_title')}</DialogTitle>

                <DialogContent>
                    {submitted ? (
                        <Alert severity="success" sx={{ my: 2 }}>
                            {t('error_report_thanks')}
                        </Alert>
                    ) : (
                        <>
                            <Typography variant="body2" sx={{ mb: 2 }}>
                                {t('error_report_description')}
                            </Typography>

                            <TextField
                                label={t('error_report_what_happened')}
                                multiline
                                rows={4}
                                fullWidth
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                placeholder={t('error_report_placeholder')}
                                margin="normal"
                                disabled={submitting}
                            />

                            <TextField
                                label={t('error_report_email')}
                                fullWidth
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t('error_report_email_placeholder')}
                                margin="normal"
                                helperText={t('error_report_email_help')}
                                disabled={submitting}
                            />

                            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                                <Button
                                    size="small"
                                    variant="text"
                                    onClick={toggleExpanded}
                                    endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                >
                                    {t('error_report_technical_details')}
                                </Button>
                            </Box>

                            <Collapse in={expanded}>
                                <Box
                                    sx={{
                                        mt: 1,
                                        p: 1.5,
                                        bgcolor: 'grey.100',
                                        borderRadius: 1,
                                        overflowX: 'auto',
                                        fontSize: '0.75rem'
                                    }}
                                >
                                    <pre style={{
                                        margin: 0,
                                        whiteSpace: 'pre-wrap',
                                        wordBreak: 'break-word'
                                    }}>
                                        {JSON.stringify(error, null, 2)}
                                    </pre>
                                </Box>
                            </Collapse>
                        </>
                    )}

                    {submitting && <LinearProgress sx={{ mt: 2 }} />}
                </DialogContent>

                {!submitted && (
                    <DialogActions>
                        <Button
                            onClick={handleClose}
                            disabled={submitting}
                            variant="outlined"
                            className="cancel-button"
                        >
                            {t('cancel')}
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={!feedback.trim() || submitting}
                            variant="contained"
                            startIcon={<SendIcon />}
                        >
                            {t('error_report_submit')}
                        </Button>
                    </DialogActions>
                )}
            </Dialog>
        </>
    );
};

export default ErrorFeedback;