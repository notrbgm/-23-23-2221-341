// Production server wrapper
import('./build/index.js').catch(err => {
    console.error('Failed to import app:', err);
    process.exit(1);
});
