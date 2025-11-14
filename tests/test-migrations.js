/**
 * Tests for data migration utilities
 * Tests use isolated keys prefixed with 'test_inkmanager_'
 */

describe('Data Migrations', function() {
    const TEST_PREFIX = 'test_inkmanager_';
    
    // Cleanup before each test
    beforeEach(function() {
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
    
    // Helper function to migrate old client format to new format
    function migrateClientData(oldClient) {
        return {
            ...oldClient,
            id: oldClient.id || Date.now(),
            createdAt: oldClient.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
    }
    
    // Helper function to migrate settings with version tracking
    function migrateSettings(oldSettings, fromVersion, toVersion) {
        let settings = { ...oldSettings };
        
        if (fromVersion < 2 && toVersion >= 2) {
            // Migration from v1 to v2: add notification settings
            settings.notifications = settings.notifications !== undefined ? settings.notifications : true;
            settings.reminderTime = settings.reminderTime || 2;
        }
        
        settings.version = toVersion;
        return settings;
    }
    
    describe('Client Data Migration', function() {
        it('should add missing ID to legacy client records', function() {
            const legacyClient = {
                name: 'John Doe',
                email: 'john@example.com'
            };
            
            const migrated = migrateClientData(legacyClient);
            
            expect(migrated).to.have.property('id');
            expect(migrated.name).to.equal('John Doe');
            expect(migrated.email).to.equal('john@example.com');
        });
        
        it('should add timestamp fields to legacy records', function() {
            const legacyClient = {
                id: 123,
                name: 'Jane Smith'
            };
            
            const migrated = migrateClientData(legacyClient);
            
            expect(migrated).to.have.property('createdAt');
            expect(migrated).to.have.property('updatedAt');
            expect(migrated.id).to.equal(123);
        });
        
        it('should preserve existing data during migration', function() {
            const client = {
                id: 456,
                name: 'Bob Johnson',
                email: 'bob@example.com',
                phone: '555-1234',
                createdAt: '2024-01-01T00:00:00Z'
            };
            
            const migrated = migrateClientData(client);
            
            expect(migrated.id).to.equal(456);
            expect(migrated.name).to.equal('Bob Johnson');
            expect(migrated.email).to.equal('bob@example.com');
            expect(migrated.phone).to.equal('555-1234');
            expect(migrated.createdAt).to.equal('2024-01-01T00:00:00Z');
        });
    });
    
    describe('Settings Migration', function() {
        it('should migrate from v1 to v2 with notification defaults', function() {
            const v1Settings = {
                theme: 'dark',
                language: 'en',
                version: 1
            };
            
            const v2Settings = migrateSettings(v1Settings, 1, 2);
            
            expect(v2Settings.version).to.equal(2);
            expect(v2Settings.notifications).to.be.true;
            expect(v2Settings.reminderTime).to.equal(2);
            expect(v2Settings.theme).to.equal('dark');
        });
        
        it('should preserve existing notification settings during migration', function() {
            const v1Settings = {
                theme: 'dark',
                notifications: false,
                reminderTime: 5,
                version: 1
            };
            
            const v2Settings = migrateSettings(v1Settings, 1, 2);
            
            expect(v2Settings.notifications).to.be.false;
            expect(v2Settings.reminderTime).to.equal(5);
        });
        
        it('should handle no-op migrations when versions match', function() {
            const currentSettings = {
                theme: 'dark',
                language: 'en',
                notifications: true,
                version: 2
            };
            
            const migrated = migrateSettings(currentSettings, 2, 2);
            
            expect(migrated).to.deep.equal(currentSettings);
        });
    });
    
    describe('Batch Migration', function() {
        it('should migrate multiple client records in batch', function() {
            const legacyClients = [
                { name: 'Client 1', email: 'c1@example.com' },
                { name: 'Client 2', email: 'c2@example.com' },
                { name: 'Client 3', email: 'c3@example.com' }
            ];
            
            const migrated = legacyClients.map(c => migrateClientData(c));
            
            expect(migrated).to.have.lengthOf(3);
            migrated.forEach(client => {
                expect(client).to.have.property('id');
                expect(client).to.have.property('createdAt');
                expect(client).to.have.property('updatedAt');
            });
        });
    });
});
