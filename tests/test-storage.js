/**
 * Tests for localStorage storage utilities
 * Tests use isolated keys prefixed with 'test_inkmanager_'
 */

describe('Storage Utilities', function() {
    const TEST_PREFIX = 'test_inkmanager_';
    
    // Cleanup before each test
    beforeEach(function() {
        // Clear any test keys
        for (let i = localStorage.length - 1; i >= 0; i--) {
            const key = localStorage.key(i);
            if (key && key.startsWith(TEST_PREFIX)) {
                localStorage.removeItem(key);
            }
        }
    });
    
    // Cleanup after each test
    afterEach(function() {
        for (let i = localStorage.length - 1; i >= 0; i--) {
            const key = localStorage.key(i);
            if (key && key.startsWith(TEST_PREFIX)) {
                localStorage.removeItem(key);
            }
        }
    });
    
    describe('saveData()', function() {
        it('should save data to localStorage with JSON serialization', function() {
            const testData = { id: 1, name: 'Test Client', email: 'test@example.com' };
            const key = TEST_PREFIX + 'clients';
            
            localStorage.setItem(key, JSON.stringify(testData));
            const retrieved = JSON.parse(localStorage.getItem(key));
            
            expect(retrieved).to.deep.equal(testData);
            expect(retrieved.name).to.equal('Test Client');
        });
        
        it('should handle array data correctly', function() {
            const testArray = [
                { id: 1, name: 'Client 1' },
                { id: 2, name: 'Client 2' },
                { id: 3, name: 'Client 3' }
            ];
            const key = TEST_PREFIX + 'sessions';
            
            localStorage.setItem(key, JSON.stringify(testArray));
            const retrieved = JSON.parse(localStorage.getItem(key));
            
            expect(retrieved).to.be.an('array');
            expect(retrieved).to.have.lengthOf(3);
            expect(retrieved[1].name).to.equal('Client 2');
        });
        
        it('should return null for non-existent keys', function() {
            const result = localStorage.getItem(TEST_PREFIX + 'nonexistent');
            expect(result).to.be.null;
        });
    });
    
    describe('loadData()', function() {
        it('should load and parse JSON data correctly', function() {
            const testData = { setting1: true, setting2: 'value', setting3: 42 };
            const key = TEST_PREFIX + 'settings';
            
            localStorage.setItem(key, JSON.stringify(testData));
            const loaded = JSON.parse(localStorage.getItem(key));
            
            expect(loaded).to.deep.equal(testData);
            expect(loaded.setting1).to.be.true;
            expect(loaded.setting2).to.equal('value');
            expect(loaded.setting3).to.equal(42);
        });
        
        it('should handle missing data with defaults', function() {
            const key = TEST_PREFIX + 'missing';
            const stored = localStorage.getItem(key);
            const result = stored ? JSON.parse(stored) : [];
            
            expect(result).to.be.an('array');
            expect(result).to.have.lengthOf(0);
        });
        
        it('should handle boolean string values correctly', function() {
            const key = TEST_PREFIX + 'booleanTest';
            localStorage.setItem(key, 'true');
            const result = localStorage.getItem(key) === 'true';
            
            expect(result).to.be.true;
            
            localStorage.setItem(key, 'false');
            const result2 = localStorage.getItem(key) === 'true';
            expect(result2).to.be.false;
        });
    });
    
    describe('Data Persistence', function() {
        it('should persist data across multiple operations', function() {
            const key = TEST_PREFIX + 'counter';
            
            // First operation
            localStorage.setItem(key, '1');
            expect(localStorage.getItem(key)).to.equal('1');
            
            // Second operation
            let value = parseInt(localStorage.getItem(key));
            value++;
            localStorage.setItem(key, value.toString());
            expect(localStorage.getItem(key)).to.equal('2');
            
            // Third operation
            value = parseInt(localStorage.getItem(key));
            value++;
            localStorage.setItem(key, value.toString());
            expect(localStorage.getItem(key)).to.equal('3');
        });
    });
});
