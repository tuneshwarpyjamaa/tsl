import { useEffect, useState } from 'react';

/**
 * Memory Monitor Component for Development
 * Shows memory usage in real-time to help identify leaks
 */
export default function MemoryMonitor() {
    const [memoryInfo, setMemoryInfo] = useState(null);

    useEffect(() => {
        // Only run in development and if performance.memory is available
        if (typeof window === 'undefined' ||
            process.env.NODE_ENV === 'production' ||
            !('memory' in performance)) {
            return;
        }

        const interval = setInterval(() => {
            const memInfo = performance.memory;
            setMemoryInfo({
                usedJSHeapSize: Math.round(memInfo.usedJSHeapSize / 1048576), // MB
                totalJSHeapSize: Math.round(memInfo.totalJSHeapSize / 1048576), // MB
                jsHeapSizeLimit: Math.round(memInfo.jsHeapSizeLimit / 1048576), // MB
                percentage: Math.round((memInfo.usedJSHeapSize / memInfo.jsHeapSizeLimit) * 100)
            });
        }, 5000); // Check every 5 seconds

        return () => clearInterval(interval);
    }, []);

    // Don't render in production or if no memory info available
    if (!memoryInfo || process.env.NODE_ENV === 'production') {
        return null;
    }

    const getStatusColor = (percentage) => {
        if (percentage < 50) return '#10B981'; // Green
        if (percentage < 75) return '#F59E0B'; // Yellow
        return '#EF4444'; // Red
    };

    return (
        <div
            style={{
                position: 'fixed',
                bottom: 10,
                right: 10,
                background: 'rgba(0, 0, 0, 0.9)',
                color: 'white',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '11px',
                fontFamily: 'monospace',
                zIndex: 9999,
                border: `1px solid ${getStatusColor(memoryInfo.percentage)}`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                minWidth: '120px'
            }}
        >
            <div style={{ marginBottom: '4px', fontWeight: 'bold' }}>
                Memory Usage
            </div>
            <div>
                <div style={{ color: getStatusColor(memoryInfo.percentage) }}>
                    {memoryInfo.percentage}% used
                </div>
                <div>
                    {memoryInfo.usedJSHeapSize}MB / {memoryInfo.jsHeapSizeLimit}MB
                </div>
                <div style={{
                    width: '100%',
                    height: '4px',
                    backgroundColor: '#333',
                    borderRadius: '2px',
                    marginTop: '4px',
                    overflow: 'hidden'
                }}>
                    <div
                        style={{
                            width: `${memoryInfo.percentage}%`,
                            height: '100%',
                            backgroundColor: getStatusColor(memoryInfo.percentage),
                            transition: 'width 0.3s ease'
                        }}
                    />
                </div>
            </div>
            <div style={{
                marginTop: '4px',
                fontSize: '9px',
                opacity: 0.7,
                textAlign: 'center'
            }}>
                Dev Mode
            </div>
        </div>
    );
}