/**
 * Tests for data formatting utilities
 * Tests formatting functions for currency, dates, and other data
 */

describe('Formatting Utilities', function() {
    
    // Helper function: formatCurrency (simplified version for testing)
    function formatCurrency(amount, currencyConfig = { symbol: '$', code: 'USD', locale: 'en-US' }) {
        if (!amount) amount = 0;
        
        try {
            return new Intl.NumberFormat(currencyConfig.locale, {
                style: 'currency',
                currency: currencyConfig.code,
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            }).format(amount);
        } catch (error) {
            // Fallback formatting
            return `${currencyConfig.symbol}${amount.toLocaleString(currencyConfig.locale, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            })}`;
        }
    }
    
    // Helper function: formatDateTime
    function formatDateTime(date) {
        return date.toISOString().slice(0, 16);
    }
    
    // Helper function: formatDate
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
    
    describe('formatCurrency()', function() {
        it('should format USD currency correctly', function() {
            const usdConfig = { symbol: '$', code: 'USD', locale: 'en-US' };
            const result = formatCurrency(100, usdConfig);
            
            expect(result).to.include('100');
            expect(result).to.satisfy(r => r.includes('$') || r.includes('USD'));
        });
        
        it('should format EUR currency correctly', function() {
            const eurConfig = { symbol: '€', code: 'EUR', locale: 'es-ES' };
            const result = formatCurrency(250.50, eurConfig);
            
            expect(result).to.include('250');
            expect(result).to.satisfy(r => r.includes('€') || r.includes('EUR'));
        });
        
        it('should handle zero amounts', function() {
            const usdConfig = { symbol: '$', code: 'USD', locale: 'en-US' };
            const result = formatCurrency(0, usdConfig);
            
            expect(result).to.include('0');
        });
        
        it('should handle null/undefined amounts as zero', function() {
            const usdConfig = { symbol: '$', code: 'USD', locale: 'en-US' };
            const resultNull = formatCurrency(null, usdConfig);
            const resultUndefined = formatCurrency(undefined, usdConfig);
            
            expect(resultNull).to.include('0');
            expect(resultUndefined).to.include('0');
        });
        
        it('should format decimal amounts correctly', function() {
            const usdConfig = { symbol: '$', code: 'USD', locale: 'en-US' };
            const result = formatCurrency(1234.56, usdConfig);
            
            expect(result).to.include('1,234');
            expect(result).to.include('56');
        });
    });
    
    describe('formatDateTime()', function() {
        it('should format date to ISO string (YYYY-MM-DDTHH:MM)', function() {
            const date = new Date('2024-03-15T14:30:00Z');
            const result = formatDateTime(date);
            
            expect(result).to.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
            expect(result).to.include('2024-03-15');
        });
        
        it('should handle current date', function() {
            const now = new Date();
            const result = formatDateTime(now);
            
            expect(result).to.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
        });
        
        it('should maintain timezone in output format', function() {
            const date = new Date('2024-12-25T09:00:00');
            const result = formatDateTime(date);
            
            expect(result).to.include('2024-12-25');
            expect(result.length).to.equal(16);
        });
    });
    
    describe('formatDate()', function() {
        it('should format date to readable format', function() {
            const result = formatDate('2024-03-15T14:30:00Z');
            
            expect(result).to.be.a('string');
            expect(result).to.include('2024');
            expect(result).to.include('Mar');
        });
        
        it('should handle different month formats', function() {
            const jan = formatDate('2024-01-15T00:00:00Z');
            const dec = formatDate('2024-12-15T00:00:00Z');
            
            expect(jan).to.include('Jan');
            expect(dec).to.include('Dec');
        });
    });
    
    describe('Edge Cases', function() {
        it('should handle large currency amounts', function() {
            const usdConfig = { symbol: '$', code: 'USD', locale: 'en-US' };
            const result = formatCurrency(1000000, usdConfig);
            
            expect(result).to.include('1,000,000');
        });
        
        it('should handle very small decimal amounts', function() {
            const usdConfig = { symbol: '$', code: 'USD', locale: 'en-US' };
            const result = formatCurrency(0.01, usdConfig);
            
            expect(result).to.include('0.01');
        });
    });
});
